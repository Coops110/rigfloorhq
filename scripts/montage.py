#!/usr/bin/env python3
"""
montage.py - build a beat-synced montage from front/back media plus a music track.

Pairs "front" and "back" media (photos and/or videos) into a two-pane composite,
detects the beat grid of a music track, and cuts between pairs on the beat.

Requires: ffmpeg/ffprobe on PATH, numpy.

Example:
    python3 scripts/montage.py \
        --front media/front --back media/back \
        --music media/track.mp3 --out montage.mp4 \
        --layout stack --aspect 9:16 --beats-per-clip 4
"""

import argparse
import json
import math
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np

PHOTO_EXT = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".bmp", ".tif", ".tiff"}
VIDEO_EXT = {".mp4", ".mov", ".m4v", ".avi", ".mkv", ".webm", ".mpg", ".mpeg"}

ASPECTS = {"9:16": (9, 16), "16:9": (16, 9), "1:1": (1, 1), "4:5": (4, 5)}


# --------------------------------------------------------------------------
# shelling out
# --------------------------------------------------------------------------

def run(cmd, capture=True):
    """Run a command, raising with the tail of stderr if it fails."""
    proc = subprocess.run(
        cmd,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE,
        check=False,
    )
    if proc.returncode != 0:
        err = proc.stderr.decode("utf-8", "replace").strip().splitlines()
        tail = "\n".join(err[-12:])
        raise RuntimeError("command failed: %s\n%s" % (" ".join(cmd[:6] + ["..."]), tail))
    return proc.stdout


def probe(path):
    """Return {duration, width, height, has_audio} for a media file."""
    out = run([
        "ffprobe", "-v", "error", "-print_format", "json",
        "-show_format", "-show_streams", str(path),
    ])
    data = json.loads(out)
    streams = data.get("streams", [])
    video = next((s for s in streams if s.get("codec_type") == "video"), None)
    audio = next((s for s in streams if s.get("codec_type") == "audio"), None)
    duration = float(data.get("format", {}).get("duration") or 0.0)
    if not duration and video and video.get("duration"):
        duration = float(video["duration"])
    width = int(video.get("width", 0)) if video else 0
    height = int(video.get("height", 0)) if video else 0
    # honour rotation metadata so portrait phone footage reports portrait dims
    if video:
        rot = 0
        for sd in video.get("side_data_list", []) or []:
            if "rotation" in sd:
                rot = abs(int(sd["rotation"]))
        if rot in (90, 270):
            width, height = height, width
    return {"duration": duration, "width": width, "height": height,
            "has_audio": audio is not None}


# --------------------------------------------------------------------------
# beat detection
# --------------------------------------------------------------------------

def load_audio(path, sr=22050):
    """Decode a track to mono float32 at `sr`."""
    raw = run([
        "ffmpeg", "-v", "error", "-i", str(path),
        "-ac", "1", "-ar", str(sr), "-f", "f32le", "-",
    ])
    x = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
    if x.size == 0:
        raise RuntimeError("no audio decoded from %s" % path)
    peak = np.max(np.abs(x))
    return x / peak if peak > 0 else x


def onset_envelope(x, sr, hop=256, win=1024):
    """
    Spectral-flux onset strength, one value per hop.

    The hop matters more than it looks: at hop=512 the envelope samples at
    43 Hz, and a 120 BPM beat period (0.5s) then falls exactly between
    autocorrelation lags 21 and 22, which aliases the true tempo away
    entirely. 256 samples the envelope at 86 Hz and resolves it cleanly.
    """
    if len(x) < win + hop:
        raise RuntimeError("music track is too short to analyse")
    frames = np.lib.stride_tricks.sliding_window_view(x, win)[::hop]
    spec = np.abs(np.fft.rfft(frames * np.hanning(win), axis=1))
    # log compression keeps loud bass from swamping everything else
    logspec = np.log1p(spec * 20.0)
    flux = np.maximum(np.diff(logspec, axis=0), 0.0).sum(axis=1)
    # subtract a short local mean to sharpen onsets; keep the window well
    # under a beat so accent differences (kick vs hat) are not flattened out
    k = 8
    local = np.convolve(flux, np.ones(k) / k, mode="same")
    env = np.maximum(flux - local, 0.0)
    if env.max() > 0:
        env = env / env.max()
    return env


def estimate_tempo(env, env_rate, bpm_min=70.0, bpm_max=180.0):
    """Autocorrelate the onset envelope; return (bpm, confidence 0-1)."""
    e = env - env.mean()
    ac = np.correlate(e, e, mode="full")[len(e) - 1:]
    if ac[0] > 0:
        ac = ac / ac[0]
    lag_min = max(1, int(round(60.0 / bpm_max * env_rate)))
    lag_max = min(len(ac) - 1, int(round(60.0 / bpm_min * env_rate)))
    if lag_max <= lag_min:
        return 120.0, 0.0
    lags = np.arange(lag_min, lag_max + 1)
    # comb score: a real beat period repeats at its multiples too, which
    # separates the beat from an unrelated peak that happens to score once
    scores = np.zeros(len(lags))
    for i, lag in enumerate(lags):
        for mult in (1, 2, 3, 4):
            j = lag * mult
            if j < len(ac):
                scores[i] += ac[j] / mult
    # mild prior towards 120 BPM, which resolves octave ambiguity
    bpms = 60.0 * env_rate / lags
    scores *= np.exp(-0.5 * (np.log2(bpms / 120.0) / 0.9) ** 2)
    best = int(np.argmax(scores))
    lag = float(lags[best])
    # parabolic interpolation for a sub-bin period, so long montages do not
    # drift away from the beat by the end of the track
    if 0 < best < len(scores) - 1:
        a, b, c = scores[best - 1], scores[best], scores[best + 1]
        denom = a - 2 * b + c
        if denom != 0:
            lag += max(-0.5, min(0.5, 0.5 * (a - c) / denom))
    bpm = 60.0 * env_rate / lag
    conf = float(max(0.0, min(1.0, ac[lags[best]])))
    return bpm, conf


def beat_grid(env, env_rate, bpm, duration, offset_hint=0.0):
    """Find the phase that best explains the onsets, return beat times."""
    period = 60.0 / bpm
    period_frames = period * env_rate
    n_test = max(1, int(round(period_frames)))
    best_phase, best_score = 0.0, -1.0
    for p in range(n_test):
        idx = np.arange(p, len(env), period_frames).astype(int)
        idx = idx[idx < len(env)]
        if idx.size == 0:
            continue
        score = float(env[idx].sum() / len(idx))
        if score > best_score:
            best_score, best_phase = score, p / env_rate
    beats = np.arange(best_phase, duration, period)
    # nudge each beat onto the nearest local onset peak (max 1/8 beat)
    tol = int(round(period_frames / 8))
    snapped = []
    for t in beats:
        c = int(round(t * env_rate))
        lo, hi = max(0, c - tol), min(len(env), c + tol + 1)
        if hi > lo:
            local = env[lo:hi]
            if local.max() > 0.05:
                c = lo + int(np.argmax(local))
        snapped.append(c / env_rate)
    beats = np.array(snapped)
    beats = beats[beats >= max(0.0, offset_hint - 1e-6)]
    return beats


def detect_beats(music, duration, bpm_override=None, start=0.0):
    """Return (beat_times, bpm, confidence) for a music file."""
    sr, hop = 22050, 256
    x = load_audio(music, sr)
    env = onset_envelope(x, sr, hop=hop)
    env_rate = sr / hop
    if bpm_override:
        bpm, conf = float(bpm_override), 1.0
    else:
        bpm, conf = estimate_tempo(env, env_rate)
    beats = beat_grid(env, env_rate, bpm, duration, offset_hint=start)
    return beats, bpm, conf


# --------------------------------------------------------------------------
# media collection
# --------------------------------------------------------------------------

def collect(paths):
    """Expand files and directories into a sorted list of media files."""
    out = []
    for p in paths or []:
        path = Path(p)
        if path.is_dir():
            for child in sorted(path.iterdir()):
                if child.suffix.lower() in PHOTO_EXT | VIDEO_EXT:
                    out.append(child)
        elif path.is_file():
            out.append(path)
        else:
            raise SystemExit("not found: %s" % p)
    return out


def is_photo(path):
    return Path(path).suffix.lower() in PHOTO_EXT


# --------------------------------------------------------------------------
# per-pane filter graphs
# --------------------------------------------------------------------------

def pane_filter(label, out_label, w, h, seconds, fps, photo, index):
    """
    Build the filter chain that turns one input into a w*h pane of `seconds`.

    Photos get a slow Ken Burns move (direction alternates so consecutive
    stills do not all drift the same way); videos are scaled and centre-cropped
    to fill the pane without letterboxing.
    """
    if photo:
        frames = max(2, int(round(seconds * fps)))
        # oversample first so the zoom crop stays sharp
        chain = (
            "[{inp}]scale={w2}:{h2}:force_original_aspect_ratio=increase,"
            "crop={w2}:{h2},setsar=1,"
        ).format(inp=label, w2=w * 2, h2=h * 2)
        zoom_in = (index % 2 == 0)
        if zoom_in:
            z = "min(1.0+0.0012*on,1.16)"
        else:
            z = "max(1.16-0.0012*on,1.0)"
        chain += (
            "zoompan=z='{z}':d={d}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
            ":s={w}x{h}:fps={fps},"
        ).format(z=z, d=frames, w=w, h=h, fps=fps)
        chain += "trim=duration={s},setpts=PTS-STARTPTS,format=yuv420p[{o}]".format(
            s=seconds, o=out_label)
        return chain

    return (
        "[{inp}]scale={w}:{h}:force_original_aspect_ratio=increase,"
        "crop={w}:{h},setsar=1,fps={fps},"
        "trim=duration={s},setpts=PTS-STARTPTS,format=yuv420p[{o}]"
    ).format(inp=label, w=w, h=h, fps=fps, s=seconds, o=out_label)


def compose_filter(layout, W, H, gap, gap_colour):
    """
    Return (front_w, front_h, back_w, back_h, compose_chain).

    compose_chain consumes [fv] and [bv] and produces [v].
    """
    # `pad` the front pane out to the full frame rather than overlaying onto a
    # `color` source: a color source carries its own duration, and every
    # segment came out 1s long because that duration won the `shortest` race.
    # Padding inherits the pane's duration, so the segment length is whatever
    # the beat grid asked for.
    if layout == "stack":
        pw, ph = W, (H - gap) // 2
        chain = (
            "[fv]pad={W}:{H}:0:0:color={c}[bg];"
            "[bg][bv]overlay=0:{y}:eof_action=pass,format=yuv420p[v]"
        ).format(c=gap_colour, W=W, H=H, y=ph + gap)
        return pw, ph, pw, ph, chain

    if layout == "side":
        pw, ph = (W - gap) // 2, H
        chain = (
            "[fv]pad={W}:{H}:0:0:color={c}[bg];"
            "[bg][bv]overlay={x}:0:eof_action=pass,format=yuv420p[v]"
        ).format(c=gap_colour, W=W, H=H, x=pw + gap)
        return pw, ph, pw, ph, chain

    if layout == "pip":
        iw = int(W * 0.32) // 2 * 2
        ih = int(iw * H / W) // 2 * 2
        margin = max(16, W // 40)
        chain = (
            "[fv][bv]overlay={x}:{y}:eof_action=pass,format=yuv420p[v]"
        ).format(x=W - iw - margin, y=H - ih - margin)
        return W, H, iw, ih, chain

    raise SystemExit("unknown layout: %s" % layout)


# --------------------------------------------------------------------------
# rendering
# --------------------------------------------------------------------------

def render_segment(front, back, seconds, args, W, H, out_path, index):
    """Render one composited segment to an intermediate mp4 (no audio)."""
    layout = args.layout
    if back is None or layout == "alternate":
        source = front if (back is None or index % 2 == 0) else back
        inputs, chain = [], []
        inputs += segment_input(source, seconds, args)
        chain.append(pane_filter("0:v", "v", W, H, seconds, args.fps,
                                 is_photo(source), index))
        filter_complex = ";".join(chain)
    else:
        fw, fh, bw, bh, compose = compose_filter(layout, W, H, args.gap,
                                                 args.gap_colour)
        inputs = segment_input(front, seconds, args) + segment_input(back, seconds, args)
        parts = [
            pane_filter("0:v", "fv", fw, fh, seconds, args.fps, is_photo(front), index),
            pane_filter("1:v", "bv", bw, bh, seconds, args.fps, is_photo(back), index + 1),
            compose,
        ]
        filter_complex = ";".join(parts)

    cmd = ["ffmpeg", "-v", "error", "-y"] + inputs + [
        "-filter_complex", filter_complex,
        "-map", "[v]", "-an",
        "-c:v", "libx264", "-preset", args.preset, "-crf", str(args.crf),
        "-pix_fmt", "yuv420p", "-r", str(args.fps),
        "-video_track_timescale", "90000",
        "-t", "%.4f" % seconds,
        str(out_path),
    ]
    run(cmd)


def segment_input(path, seconds, args):
    """Input flags for one source, looping short videos to fill the segment."""
    if is_photo(path):
        return ["-i", str(path)]
    info = probe(path)
    start = 0.0
    if info["duration"] > seconds + args.video_start * 2:
        start = args.video_start
    flags = []
    if info["duration"] < seconds + start:
        flags += ["-stream_loop", "-1"]
    if start:
        flags += ["-ss", "%.3f" % start]
    return flags + ["-t", "%.4f" % (seconds + 0.05), "-i", str(path)]


def build(args):
    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            raise SystemExit("%s not found on PATH" % tool)

    front = collect(args.front)
    back = collect(args.back)
    if not front and not back:
        raise SystemExit("no media found; pass --front and/or --back")
    if not front:
        front, back = back, []
    if not back and args.layout in ("stack", "side", "pip"):
        print("note: no --back media, falling back to full-frame layout")
        args.layout = "alternate"

    music_info = probe(args.music)
    music_len = music_info["duration"]
    if music_len <= 0:
        raise SystemExit("could not read a duration from %s" % args.music)

    beats, bpm, conf = detect_beats(args.music, music_len, args.bpm, args.start)
    print("music: %.1fs, detected %.1f BPM (confidence %.2f), %d beats"
          % (music_len, bpm, conf, len(beats)))
    if conf < 0.15 and not args.bpm:
        print("warning: weak beat detection - pass --bpm to set it by hand")

    step = args.beats_per_clip
    cuts = list(beats[::step])
    if len(cuts) < 2:
        raise SystemExit("not enough beats for a montage; try a longer track")

    pairs = []
    n = len(front) if not back else max(len(front), len(back))
    for i in range(n):
        f = front[i % len(front)] if front else None
        b = back[i % len(back)] if back else None
        pairs.append((f, b))

    n_segments = min(len(pairs), len(cuts) - 1)
    if args.loop_media:
        n_segments = len(cuts) - 1
    if args.max_duration:
        while n_segments > 1 and cuts[n_segments] - cuts[0] > args.max_duration:
            n_segments -= 1
    if n_segments < 1:
        raise SystemExit("nothing to render")

    total = cuts[n_segments] - cuts[0]
    print("montage: %d segments, %.2fs, %.2fs per clip (%d beats)"
          % (n_segments, total, total / n_segments, step))

    W, H = output_size(args)
    workdir = Path(tempfile.mkdtemp(prefix="montage-"))
    try:
        seg_files = []
        for i in range(n_segments):
            seconds = cuts[i + 1] - cuts[i]
            f, b = pairs[i % len(pairs)]
            seg = workdir / ("seg_%03d.mp4" % i)
            print("  [%2d/%d] %.3fs  %s%s" % (
                i + 1, n_segments, seconds,
                Path(f).name if f else "-",
                " + " + Path(b).name if b and args.layout != "alternate" else ""))
            render_segment(f, b, seconds, args, W, H, seg, i)
            seg_files.append(seg)

        listing = workdir / "concat.txt"
        listing.write_text("".join(
            "file '%s'\n" % s.resolve() for s in seg_files), encoding="utf-8")
        silent = workdir / "silent.mp4"
        run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0",
             "-i", str(listing), "-c", "copy", str(silent)])

        # music starts at the first cut so the montage opens on a beat
        fade = min(args.fade_out, total / 3.0)
        afilter = "afade=t=in:st=0:d=%.2f,afade=t=out:st=%.3f:d=%.2f" % (
            min(0.4, total / 8.0), max(0.0, total - fade), fade)
        out = Path(args.out)
        out.parent.mkdir(parents=True, exist_ok=True)
        run(["ffmpeg", "-v", "error", "-y",
             "-i", str(silent),
             "-ss", "%.4f" % cuts[0], "-i", str(args.music),
             "-filter_complex", "[1:a]%s,atrim=duration=%.4f[a]" % (afilter, total),
             "-map", "0:v", "-map", "[a]",
             "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
             "-movflags", "+faststart", "-shortest", str(out)])
    finally:
        if args.keep_temp:
            print("temp files kept in %s" % workdir)
        else:
            shutil.rmtree(workdir, ignore_errors=True)

    final = probe(args.out)
    print("wrote %s - %dx%d, %.2fs, %.1f MB"
          % (args.out, final["width"], final["height"], final["duration"],
             os.path.getsize(args.out) / 1e6))
    return cuts[:n_segments + 1]


def output_size(args):
    if args.aspect not in ASPECTS:
        raise SystemExit("aspect must be one of %s" % ", ".join(ASPECTS))
    aw, ah = ASPECTS[args.aspect]
    H = args.height
    W = int(round(H * aw / ah))
    # h.264 wants even dimensions, and the split needs both halves even too
    W = W // 4 * 4
    H = H // 4 * 4
    return W, H


def main(argv=None):
    p = argparse.ArgumentParser(
        description="Build a beat-synced front/back montage.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    p.add_argument("--front", nargs="+", help="files or directories for the front pane")
    p.add_argument("--back", nargs="+", default=[],
                   help="files or directories for the back pane")
    p.add_argument("--music", required=True, help="music track to sync to")
    p.add_argument("--out", default="montage.mp4", help="output file")
    p.add_argument("--layout", default="stack",
                   choices=["stack", "side", "pip", "alternate"],
                   help="stack=front over back, side=side by side, "
                        "pip=back inset over front, alternate=full frame")
    p.add_argument("--aspect", default="9:16", choices=sorted(ASPECTS))
    p.add_argument("--height", type=int, default=1920, help="output height in pixels")
    p.add_argument("--fps", type=int, default=30)
    p.add_argument("--beats-per-clip", type=int, default=4,
                   help="how many beats each clip holds (4 = one bar)")
    p.add_argument("--bpm", type=float, help="override the detected tempo")
    p.add_argument("--start", type=float, default=0.0,
                   help="skip this many seconds of the track before the first cut")
    p.add_argument("--max-duration", type=float, help="cap the montage length")
    p.add_argument("--loop-media", action="store_true",
                   help="reuse media to fill the whole track")
    p.add_argument("--gap", type=int, default=4, help="pixels between the two panes")
    p.add_argument("--gap-colour", default="black")
    p.add_argument("--fade-out", type=float, default=2.0, help="music fade-out seconds")
    p.add_argument("--video-start", type=float, default=0.5,
                   help="skip this far into each source video")
    p.add_argument("--crf", type=int, default=19)
    p.add_argument("--preset", default="medium")
    p.add_argument("--keep-temp", action="store_true")
    args = p.parse_args(argv)

    if not args.front and not args.back:
        p.error("pass --front and/or --back")
    build(args)
    return 0


if __name__ == "__main__":
    sys.exit(main())
