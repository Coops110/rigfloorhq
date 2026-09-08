#!/usr/bin/env python3
"""Generates narration audio + burned-caption SRTs for the 06-08 calculator
screen-recording videos, reusing the exact TTS voice, WordBoundary timing
approach, and SRT chunking from make-tiktok-videos.py (imported directly so
the two never drift apart).

For video 08 (freshly recorded, not reused footage) this also writes a
cues.json with the cumulative timestamp after each script line, so the
Playwright recording script can time its actions to land on the same beats
as the narration -- true sync instead of an approximate overlay.

Run with C:\\Python312\\python.exe (bare `python` resolves to a different
app's venv without edge-tts installed -- see social/README.md).

Usage:
  C:\\Python312\\python.exe scripts/make-calc-narration.py
"""
import asyncio
import importlib.util
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
OUT = REPO / "social" / "tiktok"

# Import make-tiktok-videos.py as a module to reuse its synthesize/build_srt/
# srt_timestamp functions and VOICE/FONT_SIZE/MARGIN_V constants verbatim,
# so 06-08 match 01-05's narration and caption styling exactly.
spec = importlib.util.spec_from_file_location("mtv", HERE / "make-tiktok-videos.py")
mtv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mtv)

# Each entry's "lines" are spoken back-to-back as one continuous script (no
# gap between lines -- they're split here only so we can read off cumulative
# end-timestamps as sync cues for assembly / recording).
SCRIPTS = {
    "06-kill-sheet": [
        "You start with what's already on the rig floor: mud weight, "
        "shut-in pressure, depth, and pump rate.",
        "Kill mud weight is the density that balances the well.",
        "ICP holds pressure steady the moment you start pumping kill mud.",
        "FCP is where that pressure settles once kill mud has fully "
        "replaced what's in the hole.",
    ],
    "07-hydrostatic": [
        "Hydrostatic pressure is mud weight times depth, compared against "
        "pore and fracture pressure.",
        "At nine pounds per gallon, you're safely inside the window.",
        "Push mud weight to ten point five, and the overbalance grows, "
        "but you're still safe.",
        "Push it to twelve, and overbalance jumps past fifteen hundred "
        "psi -- high overbalance, watch your E C D.",
    ],
    "08-mud-weight-window": [
        "This is the room you have to work with: pore pressure on one "
        "side, fracture pressure on the other, plenty of margin between "
        "them.",
        "Now watch what happens as that gap closes.",
        "This is the window you are actually drilling inside, and "
        "sometimes there is almost nothing left.",
    ],
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for vid, lines in SCRIPTS.items():
        script = " ".join(lines)
        wav = OUT / f"{vid}.wav"
        srt = OUT / f"{vid}.srt"
        print(f"  {vid}: synthesizing narration ({mtv.VOICE})...")
        words = asyncio.run(mtv.synthesize(script, wav))
        mtv.build_srt(words, srt)
        total = words[-1]["end"] + 0.3 if words else 0.0
        print(f"    -> {wav.name}, {srt.name}  (narration length {total:.2f}s)")

        # Cumulative end-timestamp of each line, found by matching how many
        # words each line contributes (words are whitespace-split same as
        # the source text, so counts line up positionally).
        cues = []
        idx = 0
        for line in lines:
            n = len(line.split())
            idx += n
            end_t = words[idx - 1]["end"] if idx <= len(words) else total
            cues.append({"line": line, "end": round(end_t, 3)})
        (OUT / f"{vid}-cues.json").write_text(
            json.dumps({"total": round(total, 3), "lines": cues}, indent=2),
            encoding="utf-8",
        )
        print(f"    -> {vid}-cues.json")


if __name__ == "__main__":
    main()
