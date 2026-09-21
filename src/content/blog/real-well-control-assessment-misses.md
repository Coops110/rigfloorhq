---
title: "15 Well Control Questions Real Crews Actually Get Wrong"
description: "Aggregated from real well control knowledge assessment results — the specific questions missed most often, the common wrong answer, and why the mistake happens. No names, no per-person data, just the pattern."
publishDate: "2026-09-21"
author: "RigFloorHQ Team"
category: "Well Control"
tags: ["well control", "kicks", "assessment", "training", "kill sheet"]
faq:
  - q: "Where does this data come from?"
    a: "An aggregated set of real well control knowledge assessment results, covering roughly 90 individual test-takers. Every question below was missed by at least 7 of them. No names, scores, employer, or any other detail tied to an individual appears anywhere in this post — only which question was missed and how often."
  - q: "Are these official IWCF or IADC exam questions?"
    a: "The subject matter matches standard IWCF/IADC well control theory, but this post isn't affiliated with either body and isn't a substitute for accredited certification. Treat it as a study aid, not exam material."
---

Most well control quizzes test whether you know the formulas. This one is different — it's built from real assessment results, not a question bank someone wrote to sound hard. Roughly 90 people sat a real well control knowledge assessment, and these are the 15 questions the largest number of them got wrong, in order, along with the wrong answer most of them picked and why the mistake is so easy to make.

Nothing below identifies who missed what. The only thing that survived from the original data is the pattern: this specific question, missed by this many people, who mostly picked this specific wrong answer.

## 1. Why differing SIDPP and SICP don't mean the well is unbalanced

**Missed by 12 people.** A well is shut in on a kick. SIDPP reads 350 psi, SICP reads 900 psi. What's happening?

Most people who missed this picked: *the well is unbalanced, with higher bottom hole pressure on the annular side.*

**Correct: the well is balanced** — pressure at the bottom is equal on both sides of the U-tube. SIDPP and SICP are read at two different points in two different fluid columns (drill string mud vs. annulus, now partly displaced by the kick fluid), so there's no reason to expect them to match. The moment both gauges have stabilized and stopped climbing, the well is in static equilibrium — that's what "balanced" actually means here, not "both gauges read the same number."

## 2. What actually happens to pit level circulating a gas kick out

**Missed by 11 people.** Circulating a gas kick out with the Driller's Method, what happens to active pit level?

Most picked: *pit level increases, then stays constant as gas exits the choke.*

**Correct: pit level increases, then decreases as gas exits the choke.** Gas expands as it rises into lower pressure, pushing pit level up — but once that same gas volume actually exits through the choke, the pit level has to come back down to reflect the volume that's now left the system. "Stays constant" ignores that the gas is actively leaving, not just expanding in place.

## 3. What casing pressure should read after the second circulation

**Missed by 11 people.** During the Driller's Method's second circulation, once kill weight mud reaches the bit and the pump is shut down, what should casing pressure read if there's no trapped pressure?

Most picked a calculated hydrostatic-difference figure instead of: **the original SIDPP.**

This is a real checkpoint worth memorizing, not calculating fresh each time: with kill mud now filling the drill string and no trapped pressure, casing pressure at that exact moment should return to the same number it was at initial shut-in — a clean way to confirm the job is tracking correctly without redoing math under pressure.

## 4. Leading indicator vs. lagging indicator of formation pressure

**Missed by 11 people, unanimously.** Which is a *lagging* indicator of increasing formation pressure?

Every single person who missed this picked: *change in ROP.*

**Correct: change in background gas.** ROP is a leading indicator — a drilling break shows up immediately as you cut into a higher-pressure zone. Background gas is lagging by definition: gas cut into the mud downhole doesn't show up at surface until it's actually circulated up, which takes real time (lag time). Mixing up "immediate" and "delayed" indicators is one of the most common conceptual slips in well control training.

## 5. What actually causes ballooning

**Missed by 10 people.** Ballooning happens when bottom-hole pressure runs slightly above fracture pressure. What causes that?

Most picked: *abnormal formation pressure.*

**Correct: annular friction while circulating (ECD).** While pumping, annular friction pressure adds to the static mud weight, briefly pushing BHP above the fracture gradient — the well takes a little fluid. Stop the pumps and that friction pressure disappears, BHP drops back below fracture pressure, and the well gives some fluid back. That on/off pattern tied to pump status is the actual signature of ballooning — a genuine abnormal-pressure zone doesn't behave that way, it just keeps flowing.

## 6. Pit volume during a horizontal gas kick

**Missed by 9 people.** Circulating a gas kick out along a horizontal section, correct procedure — what happens to pit volume?

Most picked: *it decreases as kill mud fills the horizontal section.*

**Correct: it stays approximately constant.** The horizontal geometry doesn't change the underlying volume-balance logic of a correctly executed kill — what's pumped in should track what comes out, regardless of hole angle.

## 7. Shale cutting density in a transition zone

**Missed by 9 people.** Drilling into an abnormally pressured formation through a transition zone, what changes at the shakers?

Most picked the opposite of the real answer: *increase in shale cutting density.*

**Correct: a decrease in cutting density.** As pore pressure rises and the differential between mud weight and formation pressure narrows, shale cuttings come off less compacted and less dense — a genuine, if subtle, formation-pressure warning sign at the shakers.

## 8. Bottom hole pressure while gas migrates with DP pressure held constant

**Missed by 9 people.** Shut in with SIDPP 400 psi / SICP 600 psi, both climbing from gas migration. If drill pipe pressure is held constant at 400 psi, what happens to bottom hole pressure?

Most picked: *it increases.*

**Correct: it stays the same.** Holding drillpipe pressure constant while gas migrates is exactly the point of the technique — it keeps bottom hole pressure stable while casing pressure is allowed to climb (and gets bled off in controlled steps) to accommodate the expanding gas.

## 9. Bottom hole pressure when casing pressure is allowed to run high during pump start-up

**Missed by 8 people.** Bringing pumps to kill speed, casing pressure is allowed to rise above SICP. What happens to bottom hole pressure?

Most picked: *it decreases, possibly allowing more influx.*

**Correct: it increases, and may exceed formation fracture pressure.** Letting casing pressure run above SICP during pump start-up adds pressure at the bottom of the well, not less — the real risk is fracturing the formation, not taking on more influx.

## 10. What to do when barite supply plugs mid-circulation

**Missed by 8 people.** During the Wait and Weight Method's first circulation, the barite supply plugs. What's the right call?

Most picked: *tell the supervisor the crew is fixing it, keep circulating.*

**Correct: inform the supervisor and recommend shutting in while the blockage is fixed.** Continuing to circulate with an unreliable weight-up system risks putting the wrong mud weight downhole mid-kill — stopping to fix it properly is the safer call, not a delay to route around.

## 11. Defining kick tolerance correctly

**Missed by 8 people.** What's the correct definition of kick tolerance?

Most picked a version with "minimum kick intensity" swapped in for "maximum gas kick volume."

**Correct: the maximum gas kick volume, at a given kick intensity and depth, that can be shut in and circulated out without exceeding the well's weak-point fracture pressure.** The two candidate definitions sound alike but swap which variable is fixed and which is the limit being solved for — worth reading kick-tolerance definitions twice before answering.

## 12. Confirming a self-fill float assembly is working

**Missed by 8 people.** Running casing with a self-fill float assembly, what confirms it's working correctly?

Most picked: *returns equal the closed-end volume of the casing.*

**Correct: returns equal the volume of steel run in the hole.** A working self-fill assembly lets mud fill the casing's own bore as it goes in, so the only fluid actually displaced back out is the volume of the steel itself — not the casing's full closed-end displacement, which is what you'd see if the float had failed shut.

## 13. Reduction in bottom hole pressure after severe losses (worked number)

**Missed by 7 people.** Severe losses occur, mud can't be seen in the well, the annulus is topped off with water. Mud weight 12 ppg, brine 8.6 ppg, 150 ft of water in the annulus. What's the reduction in bottom hole pressure?

Most picked 67 psi. **The correct figure is 26 psi** — worked as (12 − 8.6) ppg × 0.052 × 150 ft = 26.5 ≈ 26 psi. The wrong answer generally comes from applying the density difference against the wrong depth or skipping the 0.052 conversion constant — always isolate exactly which interval the lighter fluid actually occupies before multiplying.

## 14. Which pressure to hold constant during the second circulation

**Missed by 7 people.** Pumping kill mud down the drill pipe during the Driller's Method's second circulation, annulus already clean of influx — which pressure is held constant?

Most picked: *hold drill pipe pressure constant.*

**Correct: hold casing pressure constant.** Once the annulus is clean, the schedule shifts to controlling drillpipe pressure by adjusting the choke to hold *casing* pressure steady as kill mud density changes downhole — the two circulations of the Driller's Method genuinely hold different gauges constant, and mixing them up mid-job is a real, consequential mistake.

## 15. Pressure differential across a cement plug (worked number)

**Missed by 7 people.** A 500-ft cement plug sits inside the casing shoe, top of plug at 8,200 ft. Mud below the plug is 11.8 ppg, brine displacing the mud above it is 8.6 ppg. What's the pressure differential across the plug?

Most picked 1,364 psi — the answer you get if you compute both sides of the differential at the *top* of the plug (8,200 ft). **The correct figure is 1,671 psi**, because the plug itself is 500 ft long: the mud below the plug is still exerting its original hydrostatic pressure all the way down to the *bottom* of the plug (8,700 ft), not the top. Differential = (11.8 ppg × 0.052 × 8,700 ft) − (8.6 ppg × 0.052 × 8,200 ft) = 5,338 − 3,667 = 1,671 psi. Forgetting that a plug has real length — and that each side of the differential has to be evaluated at its own actual depth — is exactly what produces the common wrong answer.

## Why this pattern matters more than any single question

None of these are obscure. Every one is standard well control theory, the kind already covered on this site's [well control reference page](/drilling/well-control) and practiced in the [well control quiz](/well-control-quiz). What makes this list worth reading isn't the theory itself — it's that real people, under real assessment conditions, consistently reach for the same wrong answer on the same questions. That's usually a sign the concept is taught as a fact to memorize rather than a mechanism to understand. Work through the "why" on each one above, not just the correct letter, and these stop being the ones that catch you out.

For the math behind the kill-sheet-specific questions above, the [kill sheet calculator](/calculators/kill-sheet) and [hydrostatic pressure calculator](/calculators/hydrostatic) run the same formulas live.
