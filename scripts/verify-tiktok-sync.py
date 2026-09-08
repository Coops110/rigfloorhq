#!/usr/bin/env python3
"""Re-verifies an already-built video against its own source timing data
before it's allowed to post -- catches the caption/narration/on-screen-text
drift bugs found and fixed 2026-09-05 (see [[RigFloorHQ Social Posting]]),
which had been getting missed because nothing re-checked a file already
sitting in ready-to-upload/ after later edits touched shared code. Always
checks the file actually sitting in ready-to-upload/, never the build output
in social/tiktok/ -- that distinction is exactly what caused a wasted
re-diagnosis round last time (a fix was built but never copied over, and the
stale file kept getting reviewed instead of the fixed one).

For narrated-slideshow videos (01, 02, 03, 05, defined with per-frame
`segments` in make-tiktok-videos.py): re-synthesizes the same narration text
through edge-tts (word-boundary timing is deterministic for identical
text+voice) to get real cue timestamps via frame_durations_from_segments(),
decodes the target mp4 to 5fps stills, and diffs consecutive frames
(mean abs luminance, threshold >3) to find the actual on-disk cut points.
Fails if any cut drifts more than TOLERANCE_S from its expected cue time.

For bookend videos (06, 07, 08): re-checks real frame rate via
verify_frame_rate() (make-tiktok-recordings.py doesn't call this itself --
see the fps guardrail added there) and total duration against the expected
hook+recording+warning+close sum. These don't carry the segment-cue drift
risk 01-05 have, since they don't pair on-screen headline cards to specific
narration segments -- their captions are burned straight off the same SRT
that drove the narration, so caption/audio sync is inherent, not computed.

Requires: ffmpeg/ffprobe on PATH, `pip install edge-tts numpy pillow`
(edge-tts already installed per project notes).

Run:
  python scripts/verify-tiktok-sync.py 01 02 03 05 06 07 08
  python scripts/verify-tiktok-sync.py            # everything in ready-to-upload/

Exits non-zero and prints every failure if anything is out of tolerance --
never silently passes a file that hasn't actually been re-measured against
the file sitting in ready-to-upload/ right now.
"""
import asyncio
import importlib.util
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent

FPS_SAMPLE = 5
LUMA_THRESHOLD = 3.0
TOLERANCE_S = 0.5


def _load(name: str, filename: str):
    spec = importlib.util.spec_from_file_location(name, HERE / filename)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


mtv = _load("make_tiktok_videos", "make-tiktok-videos.py")
mtr = _load("make_tiktok_recordings", "make-tiktok-recordings.py")

READY = mtv.OUT / "ready-to-upload"


def find_cuts(mp4: Path) -> list[float]:
    """Decodes mp4 to 5fps stills in a temp dir, diffs consecutive frames
    (mean abs luminance), returns timestamps (seconds) where the diff crosses
    LUMA_THRESHOLD -- i.e. the actual on-disk cut points."""
    with tempfile.TemporaryDirectory() as td:
        pattern = str(Path(td) / "f%05d.png")
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(mp4), "-vf", f"fps={FPS_SAMPLE}", pattern],
            check=True, capture_output=True,
        )
        frames = sorted(Path(td).glob("f*.png"))
        cuts, prev = [], None
        for i, fp in enumerate(frames):
            img = np.asarray(Image.open(fp).convert("L"), dtype=np.float64)
            if prev is not None and np.abs(img - prev).mean() > LUMA_THRESHOLD:
                cuts.append(i / FPS_SAMPLE)
            prev = img
        return cuts


def verify_segment_video(vid_id: str) -> list[str]:
    v = mtv.VIDEOS[vid_id]
    mp4 = READY / f"{v['id']}.mp4"
    if not mp4.exists():
        return [f"{v['id']}: not in ready-to-upload/ ({mp4})"]

    failures = []
    try:
        mtv.verify_frame_rate(mp4)
    except RuntimeError as e:
        failures.append(str(e))

    segments = v.get("segments")
    if not segments:
        return failures  # legacy flat-script video (04) -- no cue timing to check

    script = " ".join(segments)
    with tempfile.TemporaryDirectory() as td:
        words = asyncio.run(mtv.synthesize(script, Path(td) / "verify.wav"))
    durations = mtv.frame_durations_from_segments(segments, words)
    expected_cuts, acc = [], 0.0
    for d in durations[:-1]:
        acc += d
        expected_cuts.append(acc)

    measured_cuts = find_cuts(mp4)
    for i, exp in enumerate(expected_cuts):
        nearest = min(measured_cuts, key=lambda m: abs(m - exp), default=None)
        drift = abs(nearest - exp) if nearest is not None else None
        if drift is None or drift > TOLERANCE_S:
            got = "no cut found" if nearest is None else f"{nearest:.1f}s (drift {drift:.1f}s)"
            failures.append(f"{v['id']}: expected cut #{i + 1} at {exp:.1f}s, nearest measured cut is {got}")
    return failures


def verify_bookend_video(vid_id: str) -> list[str]:
    v = mtr.VIDEOS[vid_id]
    mp4 = READY / f"{v['id']}.mp4"
    if not mp4.exists():
        return [f"{v['id']}: not in ready-to-upload/ ({mp4})"]

    failures = []
    try:
        mtv.verify_frame_rate(mp4)
    except RuntimeError as e:
        failures.append(str(e))

    wav = mtr.OUT / f"{v['id']}.wav"
    recs = sorted((mtr.OUT / v["rec_dir"]).glob("*.webm"))
    if not (wav.exists() and recs):
        failures.append(f"{v['id']}: missing source wav/recording, cannot verify expected duration")
        return failures

    narr_dur = mtr.probe_duration(wav)
    rec_dur = mtr.probe_duration(recs[-1])
    expected_total = mtr.HOOK_S + min(rec_dur, narr_dur) + mtr.WARNING_S + mtr.CLOSE_S
    actual_total = mtr.probe_duration(mp4)
    if abs(actual_total - expected_total) > TOLERANCE_S:
        failures.append(f"{v['id']}: expected total duration {expected_total:.1f}s, actual {actual_total:.1f}s")
    return failures


def main():
    ids = sys.argv[1:]
    if not ids:
        ids = sorted(p.stem.split("-")[0] for p in READY.glob("*.mp4"))

    all_failures = []
    for vid_id in ids:
        if vid_id in mtv.VIDEOS:
            print(f"verifying {vid_id} (narrated slideshow)...")
            fails = verify_segment_video(vid_id)
        elif vid_id in mtr.VIDEOS:
            print(f"verifying {vid_id} (screen-recording bookend)...")
            fails = verify_bookend_video(vid_id)
        else:
            fails = [f"unknown video id: {vid_id}"]
        for f in fails:
            print(f"  FAIL: {f}")
        if not fails:
            print("  PASS")
        all_failures.extend(fails)

    if all_failures:
        print(f"\n{len(all_failures)} verification failure(s) -- do not post until fixed.")
        sys.exit(1)
    print("\nAll videos verified in sync.")


if __name__ == "__main__":
    main()
