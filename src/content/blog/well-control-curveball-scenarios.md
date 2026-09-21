---
title: "Well Control Curveballs: Trickier Scenarios Worth a Second Look"
description: "Worked pressure problems and edge-case well control scenarios that don't fit neatly into a single category — mud gas separators, PWD readings, BOP testing, and the reasoning behind each answer."
publishDate: "2026-09-21"
author: "RigFloorHQ Team"
category: "Well Control"
tags: ["well control", "kill sheet", "training"]
faq:
  - q: "Are these official IWCF or IADC exam questions?"
    a: "The subject matter follows standard IWCF/IADC well control theory, but this post isn't affiliated with either body and isn't a substitute for accredited certification. Treat it as a study aid, not exam material."
---

A handful of well control scenarios don't fit cleanly under pressure, kill methods, or shut-in conditions — they're the ones that combine two ideas at once, or hinge on a number that's easy to derive the wrong way. Here they are, worked through properly.

## 1. Reduction in bottom hole pressure after severe losses (worked number)

Severe losses occur, mud can't be seen in the well, and the annulus gets topped off with water. Mud weight 12 ppg, brine 8.6 ppg, 150 ft of water in the annulus. The reduction in bottom hole pressure is **26 psi**, worked as (12 − 8.6) ppg × 0.052 × 150 ft = 26.52 ≈ 26 psi — not 67 psi. That wrong figure usually comes from applying the density difference against the wrong depth, or skipping the 0.052 conversion constant. Always isolate exactly which interval the lighter fluid actually occupies before multiplying.

## 2. Pressure differential across a cement plug (worked number)

A 500-ft cement plug sits inside the casing shoe, top of plug at 8,200 ft. Mud below the plug is 11.8 ppg, brine displacing the mud above it is 8.6 ppg. The pressure differential across the plug is **1,671 psi** — not 1,364 psi, which is what you get if you only account for the density difference over the 8,200 ft above the plug and forget the plug has real length. The full calculation adds a second term for that length: (11.8 − 8.6) × 0.052 × 8,200 = 1,364, plus 500 × 11.8 × 0.052 = 307, for a total of 1,671 psi. Forgetting that a plug occupies real depth — not just a point — is exactly what produces the common wrong answer.

## 3. The real danger of circulating a gas kick through the choke manifold

One of the genuine dangers of circulating a gas kick through the choke manifold is that **the increased gas volume can overload the mud gas separator** — not that it increases bottom hole pressure. The separator has a finite capacity; a large enough gas kick can exceed it, which is a surface-equipment risk distinct from anything happening downhole at that point.

## 4. What actually causes an ECD reduction on a PWD tool

A Pressure While Drilling tool showing a reduction in ECD is most likely explained by **a loss of overbalance, with formation fluid contaminating the mud in the annulus** — not a change in ROP, which doesn't directly affect a pressure-based reading like ECD.

## 5. Choosing a kill method when bit-to-shoe volume exceeds string volume

In a well where the bit-to-shoe volume is greater than drill string volume, the kill method that minimizes the risk of losses is the **Wait and Weight Method** — not the Volumetric Method, which isn't a general-purpose circulating kill method to begin with and doesn't address this particular volume relationship.

## 6. Why side outlet valves stay open during a BOP test plug test

Testing a surface BOP stack with a test plug, the side outlet valves below the plug are kept open specifically **to check for a leaking test plug** — not to prevent a pressure lock. If the plug were sealing improperly, pressure showing up below it through those open valves is exactly how you'd catch it.

## 7. SICP reading 300 psi high after the first circulation

The Driller's Method's first circulation is done, pumps shut down, and SICP reads 300 psi higher than the original SIDPP. The correct response is to **resume circulation and continue until the influx is fully out and SICP equals SIDPP** — not to jump straight into pumping kill mud to the bit while holding casing pressure constant. A mismatch between SICP and SIDPP at this checkpoint means the first circulation isn't actually finished yet.

---

For the underlying math, the [kill sheet calculator](/calculators/kill-sheet) and [hydrostatic pressure calculator](/calculators/hydrostatic) run these formulas live. The PWD/ECD concept in #4 above is covered from a different angle in [well control basics](/blog/well-control-basics-common-mistakes).
