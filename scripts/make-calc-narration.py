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
import sys
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
    "09-mud-weight-converter": [
        "Mud weight gets quoted five different ways depending who is "
        "asking, and they all have to agree.",
        "Fresh water is eight point three three P P G -- point four "
        "three three psi per foot, specific gravity one point zero.",
        "Sea water is eight point five five P P G -- point four four "
        "five psi per foot, specific gravity one point zero three.",
        "Type into any box, and every other unit updates instantly.",
    ],
    "10-bop-ram-size": [
        "BOP techs, drillers -- every ram in the stack is cut for "
        "exactly one pipe size.",
        "A ram sized for five inch drill pipe will not seal on three "
        "and a half inch. Outside its size, it is useless.",
        "A casing shear ram cuts pipe, but it does not seal the well "
        "-- a blind shear ram above it closes after.",
        "That is why a stack carries several ram types, not one "
        "good-enough one.",
    ],
    "11-jackup-depth": [
        "Rig schedulers, drillers -- a jackup's water depth limit is "
        "not a number on a spec sheet, it is simple physics.",
        "It cannot stand up in water deeper than its own legs -- that "
        "caps it around four hundred feet.",
        "Past that, the rig has to float instead of rest on the "
        "seabed, and that changes the whole design.",
        "A moored semisub holds in heavy seas. A dynamically "
        "positioned drillship moves fast between wells.",
    ],
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    # Optional ids on the command line select a subset -- e.g. only the newly
    # added entry -- so re-running this doesn't re-synthesize (and drift,
    # since edge-tts isn't perfectly deterministic run to run) the already
    # good 06-08 narration every time a new video is added.
    requested = sys.argv[1:]
    items = (
        [(k, v) for k, v in SCRIPTS.items() if k in requested]
        if requested else list(SCRIPTS.items())
    )
    for vid, lines in items:
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
