#!/usr/bin/env python3
"""Assembles TikTok videos 06-08 (calculator screen-recording bookends) from
already-generated narration/captions and screen recordings.

Unlike make-tiktok-videos.py's narrated-slideshow videos (01-05), these
bookend a real screen recording:
  frame1 (hook, ~2s) -> narrated+captioned recording -> frame2 (WARNING, ~3s,
  never shortened) -> frame3 (close+domain, ~3s)
per social/README.md's "Calculator screen recordings (06-08)" section.

Expects, already in social/tiktok/:
  <id>-frame1.png / -frame2.png / -frame3.png   (make-tiktok-frames.ps1)
  <id>.wav / <id>.srt                            (edge-tts narration + captions)
  _rec<NN>/*.webm                                 (Playwright screen recording)

Requires: ffmpeg on PATH.

Run:
  python scripts/make-tiktok-recordings.py            all three
  python scripts/make-tiktok-recordings.py 06          just this id
"""
import importlib.util
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
OUT = REPO / "social" / "tiktok"

# Reuses verify_frame_rate() from make-tiktok-videos.py rather than
# duplicating it -- these videos were never getting the 23-60fps guardrail
# 01/02/03/05 have had since the 2026-09-01 frame-rate bug.
_spec = importlib.util.spec_from_file_location("make_tiktok_videos", HERE / "make-tiktok-videos.py")
_mtv = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mtv)
verify_frame_rate = _mtv.verify_frame_rate
srt_to_ass = _mtv.srt_to_ass

HOOK_S = 2.0
WARNING_S = 3.0
CLOSE_S = 3.0

VIDEOS = {
    "06": {"id": "06-kill-sheet", "rec_dir": "_rec06"},
    "07": {"id": "07-hydrostatic", "rec_dir": "_rec07"},
    "08": {"id": "08-mud-weight-window", "rec_dir": "_rec08"},
}


def probe_duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def build_video(vid: dict):
    tag = vid["id"]
    f1, f2, f3 = (OUT / f"{tag}-frame{n}.png" for n in (1, 2, 3))
    if not (f1.exists() and f2.exists() and f3.exists()):
        print(f"  SKIP {tag}: missing bookend frames")
        return
    wav, srt = OUT / f"{tag}.wav", OUT / f"{tag}.srt"
    if not (wav.exists() and srt.exists()):
        print(f"  SKIP {tag}: missing narration/captions -- run the narration step first")
        return
    rec_dir = OUT / vid["rec_dir"]
    recs = sorted(rec_dir.glob("*.webm"))
    if not recs:
        print(f"  SKIP {tag}: no recording in {vid['rec_dir']}")
        return
    rec = recs[-1]
    mp4 = OUT / f"{tag}.mp4"
    ass = OUT / f"{tag}.ass"
    srt_to_ass(srt, ass)

    narr_dur = probe_duration(wav)
    rec_dur = probe_duration(rec)
    mid_v_dur = min(rec_dur, narr_dur)
    pad = max(0.0, narr_dur - rec_dur)

    vf_caption = f"ass={ass.name}"

    filter_complex = (
        f"[0:v]scale=1080:1920,fps=30,format=yuv420p[v0];"
        f"[1:v]trim=duration={mid_v_dur},setpts=PTS-STARTPTS,"
        f"tpad=stop_mode=clone:stop_duration={pad},"
        f"scale=1080:1920,fps=30,format=yuv420p,{vf_caption}[v1];"
        f"[2:a]atrim=duration={narr_dur},asetpts=PTS-STARTPTS,"
        f"aformat=sample_rates=44100:channel_layouts=stereo[a1];"
        f"[3:v]scale=1080:1920,fps=30,format=yuv420p[v2];"
        f"[4:v]scale=1080:1920,fps=30,format=yuv420p[v3];"
        f"[5:a]aformat=sample_rates=44100:channel_layouts=stereo[a0];"
        f"[6:a]aformat=sample_rates=44100:channel_layouts=stereo[a2];"
        f"[7:a]aformat=sample_rates=44100:channel_layouts=stereo[a3];"
        f"[v0][a0][v1][a1][v2][a2][v3][a3]concat=n=4:v=1:a=1[outv][outa]"
    )

    print(f"  {tag}: assembling (hook {HOOK_S}s -> recording {mid_v_dur:.1f}s -> "
          f"warning {WARNING_S}s -> close {CLOSE_S}s)...")
    subprocess.run([
        "ffmpeg", "-y",
        "-loop", "1", "-t", str(HOOK_S), "-i", f1.name,
        "-i", rec.resolve().as_posix(),
        "-i", wav.name,
        "-loop", "1", "-t", str(WARNING_S), "-i", f2.name,
        "-loop", "1", "-t", str(CLOSE_S), "-i", f3.name,
        "-f", "lavfi", "-t", str(HOOK_S), "-i", "anullsrc=r=44100:cl=stereo",
        "-f", "lavfi", "-t", str(WARNING_S), "-i", "anullsrc=r=44100:cl=stereo",
        "-f", "lavfi", "-t", str(CLOSE_S), "-i", "anullsrc=r=44100:cl=stereo",
        "-filter_complex", filter_complex,
        "-map", "[outv]", "-map", "[outa]",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac",
        mp4.name,
    ], cwd=OUT, check=True)
    verify_frame_rate(mp4)
    print(f"  DONE -> {mp4.relative_to(REPO)}")


def main():
    ids = sys.argv[1:] or list(VIDEOS)
    for vid_id in ids:
        v = VIDEOS.get(vid_id)
        if not v:
            print(f"unknown video id: {vid_id} (known: {', '.join(VIDEOS)})")
            continue
        build_video(v)


if __name__ == "__main__":
    main()
