---
title: "Shut-In Pressure Behavior: What Actually Happens"
description: "How SIDPP, SICP, and bottom hole pressure actually behave during shut-in, migration, and stripping operations — and where the assumptions people bring to it go wrong."
publishDate: "2026-09-21"
author: "RigFloorHQ Team"
category: "Well Control"
tags: ["well control", "shut-in", "SIDPP", "SICP", "training"]
faq:
  - q: "Are these official IWCF or IADC exam questions?"
    a: "The subject matter follows standard IWCF/IADC well control theory, but this post isn't affiliated with either body and isn't a substitute for accredited certification. Treat it as a study aid, not exam material."
---

Shut-in pressure behavior is one of those areas where the math is simple but the intuition is easy to get backwards — especially anything involving gas migration, where holding one pressure constant has a very specific, non-obvious effect on another. Here's where that reasoning tends to go wrong.

## 1. Pit volume circulating a kick out of a horizontal section

Circulating a gas kick out along a horizontal hole section, correct procedure has pit volume stay **approximately constant** — not decrease as kill mud fills the horizontal section. The horizontal geometry doesn't change the underlying volume-balance logic of a correctly executed kill: what's pumped in should track what comes out, regardless of hole angle.

## 2. Bottom hole pressure holding drill pipe pressure constant during migration

Shut in with SIDPP 400 psi / SICP 600 psi, both climbing from gas migration. If drill pipe pressure is held constant at 400 psi, bottom hole pressure **stays the same** — it doesn't increase. Holding drillpipe pressure constant while gas migrates is exactly the point of the technique: it keeps bottom hole pressure stable while casing pressure is allowed to climb (and gets bled off in controlled steps) to accommodate the expanding gas.

## 3. Bottom hole pressure when a float fails and mud u-tubes

Casing run with a non-return float assembly, not kept full, shoe at 3,000 ft. If the float fails and mud u-tubes up inside the casing, bottom hole pressure **decreases** — it doesn't stay the same "due to the u-tube effect." The u-tube effect is precisely what's removing hydrostatic pressure from the annulus side; assuming it cancels out gets the mechanism backwards.

## 4. Which gauge tells you formation pressure

Shut in on a kick with the bit on bottom, formation pressure is calculated from the **drill pipe pressure gauge**, not the casing pressure gauge. Drill pipe pressure reflects a clean mud column with no influx in it, which is what makes it usable for that calculation — the casing side has the kick fluid mixed in and isn't a clean read.

## 5. Bottom hole pressure holding casing pressure constant during migration

Same migrating-gas scenario, but this time casing pressure is held constant at 600 psi. Now bottom hole pressure **decreases** — the opposite of the drill-pipe-constant case above. Holding casing pressure constant while gas keeps migrating and expanding means drill pipe pressure has to be allowed to rise to compensate, and if it isn't, BHP falls. These two scenarios (hold drill pipe constant vs. hold casing constant) are mirror images of each other, and mixing them up is the single most common error in this whole topic.

## 6. Maintaining constant BHP while stripping in

Stripping into the hole with no influx migration, constant bottom hole pressure is maintained by **bleeding off the drill pipe's closed-end displacement** as each stand goes in — not by pumping an equivalent volume into the well. Pipe going into a full hole displaces fluid; the well control move is to let that displaced volume out, not add more on top of it.

## 7. SIDPP and SICP rising together after stabilizing

After 15 minutes of stable shut-in pressures, both SIDPP and SICP start slowly climbing by the same amount. The probable cause is **the influx migrating up the wellbore** — not a second influx entering the well, which would typically show a different pressure signature (not a matched, gradual rise on both gauges).

## 8. Checking for trapped pressure correctly

The correct trapped-pressure check is to **bleed a small amount of pressure from the choke, shut the well back in, and watch the gauge** — not to bleed all pressure to 0 psi first. Bleeding everything off risks going underbalanced before you've confirmed what you're dealing with; a small bleed gives you the same diagnostic information (does pressure climb back, or hold steady) without that risk.

## 9. What happens if gas migrates with no float in the string

If gas migrates after shut-in with no float in the drill string, **both drill pipe and annulus pressures will increase** — shut-in pressures won't remain constant. With no float isolating the string, pressure communicates freely between drill pipe and annulus, so a migrating kick shows up on both gauges, not just one.

## 10. Why SIDPP and SICP read differently

Vertical well, surface stack, kick taken and shut in: SIDPP 350 psi, SICP 450 psi. The difference exists because **the influx sits in the annulus and is lower density than the mud** — not because the influx is *higher* density. A lighter influx column provides less hydrostatic pressure on the annulus side, which is exactly why casing pressure reads higher than drill pipe pressure in this scenario.

## 11. Finding ICP without a known SCR pressure

Shut in on a kick without knowing the slow circulating rate pressure, the correct approach is to **follow proper start-up procedure and read the drillpipe gauge (minus any safety margin) once at kill rate** — that reading is the ICP. Using SIDPP directly as the circulating pressure skips the start-up step that's there specifically to establish a safe, verified pressure.

## 12. Equipment specific to shutting in on casing

Shutting in an operation involving casing calls for a **suitable crossover (swage)** as the specific piece of kit — not a Full Opening Safety Valve, which is a drill-string tool used in a different context (stripping/tripping pipe), not a casing-specific shut-in item.

## 13. Trip tank recovery while stripping with rising pressures

Fifteen stands off bottom with a gas kick taken, shut-in pressures slowly rising, stripping in while holding casing pressure constant — the volume recovered in the trip tank comes from **both gas expansion (if the influx is migrating) and closed-end pipe displacement** — not displacement alone. Ignoring the migration component understates the volume you should expect to see, which can mask a real problem.

## 14. What to delegate after a successful shut-in

Once shut-in is complete, a task that's appropriate to delegate to a crew member is **checking for leaks at the pumps, pipework, and pit areas** — not communicating the kill plan to the crew, which is a supervisory responsibility that shouldn't be handed off.

## 15. Surface signs when a gas kick dissolves in oil-based mud

A gas kick that goes into solution in oil-based mud typically shows up at surface as **a pit gain equal to or smaller than the kick volume** — not a decreasing flow rate and pit level. Gas staying in solution means it isn't expanding the way it would in water-based mud, so the surface signature is muted rather than reversed.

## 16. Sequencing an inside BOP after a swabbed-in kick

Bit inside the casing, kick swabbed in, FOSV installed and closed on the drill pipe, no float in the string, well shut in on the annular. Before stripping back to bottom, the correct next step is to **install the inside blowout preventer above the FOSV, then open the drill pipe safety valve** — not open the FOSV first. Opening the FOSV before the inside BOP is in place removes your barrier before the replacement is ready.

## 17. SIDPP and SICP with an influx in a horizontal section

Taking a gas kick while drilling a horizontal section, if the influx is entirely within that horizontal section, SIDPP and SICP will read **about the same** — not SICP much higher than SIDPP. In a horizontal run there's no meaningful vertical height difference between the two fluid columns at that point, which is what normally drives the SIDPP/SICP split in a vertical well.

## 18. Effect of trapped pressure from an early shut-in

If a well is shut in before the pumps are fully stopped, and some pressure ends up trapped, the effect on the wellbore is **additional overbalance on all pressures**, not no effect at all. Trapped pressure adds on top of the real formation pressure everywhere in the well, which is exactly why checking for trapped pressure (see #8) matters before proceeding with a kill.

## 19. Finding SIDPP behind a float, method one

With a float in the drill string, one way to find SIDPP is to **pump slowly down the drill pipe until SICP starts to increase, then stop — the drill pipe pressure reading minus current trapped pressure gives SIDPP.** The float blocks a direct annulus-side reading, so this indirect method is how the number gets recovered without guessing.

## 20. SIDPP when the influx is swabbed in below the bit

If the swabbed-in influx sits below the bit, SIDPP will read **the same as SICP** — the drill string below the bit is exposed to the same influx as the annulus in that scenario, so the usual SIDPP/SICP split from a lighter annulus column doesn't apply here.

---

For the math behind ICP, FCP, and pressure schedules, the [kill sheet calculator](/calculators/kill-sheet) and [horizontal kill sheet calculator](/calculators/kill-sheet-horizontal) run these live. Background theory is on the [well control reference page](/drilling/well-control).
