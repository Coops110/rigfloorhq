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
    "12-ecd": [
        "Mud weight: twelve. The well feels more.",
        "This is Equivalent Circulating Density: static mud weight, plus the "
        "friction penalty from actually pumping. Enter mud weight, depth, "
        "flow rate, hole size, and pipe size, and the calculator runs "
        "annular velocity, then friction pressure loss, then E C D, in "
        "pounds per gallon.",
        "Here's what matters: E C D is always higher than static mud "
        "weight, never lower,",
        "and a smaller annulus, like a bigger B H A in a tighter hole, "
        "pushes that number up even faster.",
    ],
    "13-gas-migration": [
        "Shut in. No pumps. Why's pressure climbing?",
        "Gas is buoyant. It rises through mud with zero pumps on, and "
        "expanding as it climbs, it pushes shut-in pressure up on its own.",
        "Fifty psi an hour, ten pound mud: the calculator turns that into "
        "a migration rate of ninety-six feet an hour. That number sets "
        "your bleed.",
        "The volumetric method bleeds a calculated mud volume off the "
        "annulus in steps, holding bottomhole pressure steady while gas "
        "keeps rising.",
    ],
    "14-buoyancy": [
        "Same pipe. Two very different weights.",
        "Air weight: nineteen and a half pounds a foot. Buoyed and "
        "open-ended, that drops to sixteen point five two.",
        "Buoyed and closed-ended, with nothing inside pushing back, it "
        "drops further, to nine point three.",
        "Same steel, same mud: the difference is whether the pipe is "
        "open or plugged, and that changes what your hookload actually "
        "reads. Both numbers come straight from the calculator, not a "
        "guess.",
    ],
    "15-riser-margin": [
        "Riser disconnects right now. Does the well stay dead?",
        "On a floating rig, that riser is normally full of mud, heavier "
        "than seawater. Riser margin is how much extra mud weight the "
        "well can lose before it goes underbalanced, if the riser column "
        "gets replaced by seawater.",
        "Plug in mud weight, seawater gradient, water depth, and air "
        "gap, and this well's margin comes back at one point eight five "
        "ppg.",
        "That's the cushion protecting the BOP stack below.",
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
    "16-bullheading": [
        "Kill fluid's going in. Your pressure ceiling just dropped.",
        "Bullheading pumps kill fluid straight down the tubing, forcing the "
        "well's contents back into the formation instead of circulating "
        "them out.",
        "Enter formation pressure, shut-in pressure, TVD, and fluid "
        "weight, and it checks two surface-pressure ceilings.",
        "Here the final ceiling is the tighter one: seventeen thirty-eight "
        "psi, down from twenty-fifty, because the heavier column eats "
        "more margin to frac pressure -- cross it, and you fracture the "
        "formation at surface.",
    ],
    "17-pipe-pull-margin": [
        "Same pressure drop. Way more pipe pulled dry.",
        "This is pipe pull margin: how much pipe comes out, wet or "
        "dry, before hydrostatic pressure drops by a target amount.",
        "Enter the target pressure drop, mud weight, annulus capacity, "
        "and drill pipe capacity and displacement.",
        "Wet pipe only drains into the annulus, so four hundred "
        "forty-two feet comes out before losing seventy-five psi -- dry "
        "pipe drains nothing back in, so that stretches to eighteen "
        "hundred thirty feet.",
    ],
    "18-bit-torque": [
        "Wrong torque, and the bit backs off downhole.",
        "An eight and a half inch bit runs a four and a half reg "
        "connection -- bit size sets the thread, straight off this table.",
        "That connection has three numbers: eighteen thousand minimum, "
        "twenty thousand maximum, twenty-three five hundred severe -- for "
        "directional or high weight-on-bit work.",
        "Below minimum, the connection isn't fully made up and can back "
        "off downhole. Above maximum, you're galling the threads -- read "
        "it with a calibrated torque sub, never by feel.",
    ],
    "19-lag-and-volume": [
        "Down in thirty-seven minutes. Back up takes way longer.",
        "This is lag time: how long fluid or gas at the bit takes to "
        "reach surface, tied to pump output and your own string volumes.",
        "Enter pump type, liner and stroke, drill string and BHA "
        "dimensions, and hole size, and it solves pump output, then "
        "string and annular volume.",
        "At fifty strokes a minute, that's thirty-seven minutes down to "
        "the bit, and ninety-six point six minutes back up to surface "
        "-- bottoms-up travels the much bigger annular volume, not the "
        "string.",
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
        # First line is the hook -- synthesized as its own short clip so it
        # can play under frame1 the instant it appears, instead of the old
        # fixed 2s of dead silence there (fixed 2026-09-24, see
        # make-tiktok-recordings.py). Remaining lines are the body script,
        # spoken over the actual screen recording as before.
        hook_line, *body_lines = lines
        body_script = " ".join(body_lines)

        hook_wav = OUT / f"{vid}-hook.wav"
        wav = OUT / f"{vid}.wav"
        srt = OUT / f"{vid}.srt"

        print(f"  {vid}: synthesizing hook line ({mtv.VOICE})...")
        asyncio.run(mtv.synthesize(hook_line, hook_wav))

        print(f"  {vid}: synthesizing body narration ({mtv.VOICE})...")
        words = asyncio.run(mtv.synthesize(body_script, wav))
        mtv.build_srt(words, srt)
        total = words[-1]["end"] + 0.3 if words else 0.0
        print(f"    -> {hook_wav.name}, {wav.name}, {srt.name}  (body length {total:.2f}s)")

        # Cumulative end-timestamp of each body line, found by matching how
        # many words each line contributes (words are whitespace-split same
        # as the source text, so counts line up positionally). Excludes the
        # hook line -- it plays before the recording segment starts, so
        # Playwright's recording-sync cues only need to cover the body.
        cues = []
        idx = 0
        for line in body_lines:
            n = len(line.split())
            idx += n
            end_t = words[idx - 1]["end"] if idx <= len(words) else total
            cues.append({"line": line, "end": round(end_t, 3)})
        (OUT / f"{vid}-cues.json").write_text(
            json.dumps({"hook": hook_line, "total": round(total, 3), "lines": cues}, indent=2),
            encoding="utf-8",
        )
        print(f"    -> {vid}-cues.json")


if __name__ == "__main__":
    main()
