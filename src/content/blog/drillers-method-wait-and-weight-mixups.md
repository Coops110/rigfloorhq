---
title: "Driller's Method and Wait and Weight: Common Mix-Ups"
description: "Where the Driller's Method, Wait and Weight, and Volumetric Method get confused with each other — which pressure to hold constant, what a balanced well actually looks like, and the reasoning behind each answer."
publishDate: "2026-09-21"
author: "RigFloorHQ Team"
category: "Well Control"
tags: ["well control", "kill sheet", "driller's method", "wait and weight", "training"]
faq:
  - q: "Are these official IWCF or IADC exam questions?"
    a: "The subject matter follows standard IWCF/IADC well control theory, but this post isn't affiliated with either body and isn't a substitute for accredited certification. Treat it as a study aid, not exam material."
---

The Driller's Method and Wait and Weight Method share a lot of underlying logic, which is exactly why it's so easy to apply the wrong one's rule to the other — hold the wrong pressure constant, or read a checkpoint number the wrong way. Here's where that happens most.

## 1. What differing SIDPP and SICP actually mean

A well is shut in on a kick. SIDPP reads 350 psi, SICP reads 900 psi. This is a **balanced well** — pressure at the bottom is equal on both sides of the U-tube — not an unbalanced one. SIDPP and SICP are read at two different points in two different fluid columns (drill string mud vs. annulus, now partly displaced by the kick fluid), so there's no reason to expect them to match. The moment both gauges have stabilized and stopped climbing, the well is in static equilibrium — that's what "balanced" actually means here, not "both gauges read the same number."

## 2. What casing pressure should read after the second circulation

During the Driller's Method's second circulation, once kill weight mud reaches the bit and the pump is shut down, casing pressure should read the **original SIDPP** if there's no trapped pressure — not a calculated hydrostatic-difference figure. This is a real checkpoint worth memorizing, not calculating fresh each time: with kill mud now filling the drill string and no trapped pressure, casing pressure at that exact moment should return to the same number it was at initial shut-in.

## 3. What to do when barite supply plugs mid-circulation

During the Wait and Weight Method's first circulation, if the barite supply plugs, the right call is to **inform the supervisor and recommend shutting in while the blockage is fixed** — not to keep circulating while the crew fixes it. Continuing to circulate with an unreliable weight-up system risks putting the wrong mud weight downhole mid-kill.

## 4. Bottom hole pressure when casing pressure runs high during start-up

Bringing pumps to kill speed, if casing pressure is allowed to rise above SICP, bottom hole pressure **increases and may exceed formation fracture pressure** — it doesn't decrease. Letting casing pressure run above SICP during pump start-up adds pressure at the bottom of the well, not less — the real risk is fracturing the formation, not taking on more influx.

## 5. Which pressure to hold constant during the second circulation

Pumping kill mud down the drill pipe during the Driller's Method's second circulation, with the annulus already clean of influx, the schedule holds **casing pressure constant** — not drill pipe pressure. Once the annulus is clean, control shifts to adjusting the choke to hold casing pressure steady as kill mud density changes downhole. The two circulations of the Driller's Method genuinely hold different gauges constant, and mixing them up mid-job is a real, consequential mistake.

## 6. Gas bubble pressure while migrating with no action taken

If a gas bubble is migrating with no action taken, its pressure will **stay approximately the same** as it rises — it doesn't increase. The gas expands as it moves into lower-pressure territory higher in the well, which keeps its own internal pressure roughly steady even as surface pressures climb from that expansion.

## 7. The pressure you actually want to hold constant

Circulating out an influx, the pressure you want to keep constant is **bottom hole pressure** — not casing pressure, which is the number you're watching, not the number you're actually protecting. Every kill method's specific pressure-holding rule (drill pipe constant, casing constant) exists purely as a means to that end.

## 8. Gas volume as a kick is properly circulated out

As a gas kick is correctly circulated out, gas volume **increases** — it doesn't stay the same. Falling pressure as gas moves up the annulus lets it expand; a properly executed kill accounts for that expansion rather than assuming a fixed volume throughout.

## 9. Pump pressure after a full circulation with reduced mud weight

After one complete circulation with mud weight decreased, pump pressure will **decrease** — not increase. Lighter mud means less friction pressure moving through the same system, straightforward but easy to get backwards if you're thinking about hydrostatic pressure instead of pump pressure.

## 10. Using a vertical kill sheet on a horizontal well

Killing a well with a horizontal section using the Wait and Weight method, using a vertical kill sheet by mistake means **applying too much pressure to the well** — not too little. A vertical schedule assumes a TVD-based hydrostatic relationship that doesn't hold the same way once the wellbore goes horizontal, and the mismatch runs in the direction of overpressuring, not underpressuring.

## 11. Maximum casing shoe pressure with the Volumetric Method

Using the Volumetric Method on a vertical well, maximum casing shoe pressure occurs **when the top of the gas is at the casing shoe** — not once gas reaches surface. Once gas has passed the shoe, the pressure differential at that point actually starts easing; the shoe sees its worst-case moment while the gas is still sitting right at it.

## 12. Pressure still showing on the drill pipe gauge with no trapped pressure

KWM pumped to the bit at the start of a Wait and Weight kill, pumps shut down, pressure checked. Drill pipe gauge still shows pressure and trapped pressure has been ruled out. The status is that the **drill pipe is still underbalanced, or the stroke count used wasn't correct** — not that a KWM u-tube effect is simply adding pressure with nothing to act on. Assuming "it's just u-tubing" when the numbers don't check out is how a real underbalance gets waved off.

## 13. Casing shoe pressure while a gas bubble passes it

During the Driller's Method's first circulation, a gas bubble moving up the annulus past the casing shoe, with drillpipe pressure correctly held constant — casing shoe pressure **stays constant**. It doesn't increase. Holding drill pipe pressure constant is specifically what keeps bottom hole (and by extension, shoe) pressure stable through this stage.

## 14. Drill pipe pressure that returns to the same value after re-checking

Same scenario as above, but after circulating and re-testing, drill pipe pressure comes back to the exact same reading — no trapped pressure, still not zero. The move is to **circulate a few more strokes, then shut in and check again** — not assume the well isn't killed yet just because KWM hasn't reached surface. A repeatable identical reading is worth one more verification pass before concluding anything.

## 15. What must not vary displacing a tapered string

Displacing kill weight mud through a well with a tapered drill string, the parameter that must **not** vary as different pipe sections get displaced is **bottom hole pressure** — pressure drop per 100 strokes pumped is expected to change as the string geometry changes; BHP is the thing the whole schedule is built to hold steady regardless.

## 16. How kick size affects SICP, not SIDPP

A well shut in on a 25 bbl kick reads 300 psi SIDPP / 650 psi SICP. Had the same well taken a smaller, 10 bbl kick instead, **SICP would be lower** — SIDPP wouldn't change, since SIDPP reflects formation pressure, not kick size. Kick size affects how much of the annulus column got replaced by lighter influx, which is a casing-pressure-side effect, not a drill-pipe-side one.

## 17. Bottom hole pressure holding Final Circulating Pressure constant

Holding Final Circulating Pressure constant as kill mud circulates up the annulus, bottom hole pressure **stays the same** — it doesn't increase. FCP is calculated specifically so that holding it constant on the way up maintains BHP, the same logic underlying the "hold one gauge steady to protect the other" pattern throughout kill methods.

## 18. When Wait and Weight beats Driller's Method on shoe pressure

Wait and Weight gives a lower casing shoe pressure than the Driller's Method specifically when **annulus open-hole capacity is greater than drillstring capacity** — not the reverse. The relative capacities of the two sides determine which method puts less strain on the shoe, and it's easy to assume the comparison runs the other way.

## 19. Casing pressure as an influx moves from horizontal into vertical

As a gas influx moves from a horizontal section into the vertical section of the well, casing pressure will **increase** — it won't stay the same. Once the gas reaches vertical hole, its expansion starts translating into a real height-based pressure effect that a purely horizontal run doesn't produce.

## 20. Bottom hole pressure holding drill pipe pressure constant (wrong practice)

Pumping kill mud to the bit while holding drill pipe pressure flat, without adjusting it to the step-down schedule as heavier mud goes downhole, bottom hole pressure will actually **increase** — not stay the same. Once denser kill mud starts occupying more of the string, holding the surface number static (instead of following the calculated schedule) means the added hydrostatic weight isn't being compensated for, and BHP climbs.

---

The [kill sheet calculator](/calculators/kill-sheet) and [horizontal kill sheet calculator](/calculators/kill-sheet-horizontal) build these exact pressure schedules, and the [bullheading calculator](/calculators/bullheading) covers a related alternative method.
