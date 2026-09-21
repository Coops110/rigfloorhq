---
title: "Kick Warning Signs and Shut-In: Common Mistakes"
description: "Kick indicators, barrier types, and shut-in procedure questions that read as straightforward but hide a real trap — ballooning, float assemblies, flow checks, and the reasoning behind each answer."
publishDate: "2026-09-21"
author: "RigFloorHQ Team"
category: "Well Control"
tags: ["well control", "kicks", "shut-in", "training", "BOP"]
faq:
  - q: "Are these official IWCF or IADC exam questions?"
    a: "The subject matter follows standard IWCF/IADC well control theory, but this post isn't affiliated with either body and isn't a substitute for accredited certification. Treat it as a study aid, not exam material."
---

Some of the most consistently missed well control questions aren't about hard math — they're about warning signs and shut-in procedure that sound like common sense until you look closer. Here's where the reasoning usually goes wrong.

## 1. What actually causes ballooning

Ballooning happens when bottom-hole pressure runs slightly above fracture pressure. The cause is **annular friction while circulating (ECD)** — not abnormal formation pressure. While pumping, friction pressure adds to static mud weight and briefly pushes BHP above fracture gradient; stop the pumps and that friction disappears, BHP drops back below fracture pressure, and the well gives fluid back. That on/off pattern tied to pump status is the real signature — a genuine abnormal-pressure zone doesn't behave that way.

## 2. Confirming a self-fill float assembly is working

Running casing with a self-fill float assembly, the sign it's working correctly is that **returns equal the volume of steel run in the hole** — not the closed-end volume of the casing. A working self-fill assembly lets mud fill the casing's own bore as it goes in, so the only fluid actually displaced back out is the steel itself.

## 3. The warning sign that doesn't belong on the list

Asked which of several options is *not* a warning sign of increasing formation pressure, the answer is often **increasing shale density** — real warning signs point the other way (decreasing density, as covered in the basics post). A gradual ROP decrease, by contrast, genuinely can be a warning sign in some contexts, which is what makes this question a trap.

## 4. Why early kick detection matters (SICP, not just influx size)

Detecting a kick early matters because minimizing the influx size results in a **lower SICP** — not higher. A smaller kick means less gas volume to expand and less pressure buildup as it's circulated out. Getting the direction backwards here undermines the whole logic of why fast detection matters.

## 5. A failed plug on an open well

If a plug fails and the well is open, the well **will flow** — it won't remain static. The plug was the barrier; take it away with nothing else in place and there's nothing left to prevent flow, which is exactly the mechanism a plug is there to guard against.

## 6. Suspecting a low SICP reading

If the Driller suspects the SICP reading on the remote choke panel is too low, the right move is to **compare it against the SICP gauge on the choke manifold** and report to the supervisor — not the standpipe manifold, which reads drill pipe-side pressure, not casing-side. Comparing against the wrong gauge tells you nothing about whether the reading you're worried about is actually wrong.

## 7. What a blown pop-off valve looks like

If the pump's pop-off valve blows while circulating out a kick, you'll see a **rapid drop in drill pipe pressure and a drop in casing pressure** — not a drop in drill pipe pressure with casing pressure unaffected. The two are connected through the same circulating system; a pop-off event affects both sides, just not necessarily equally.

## 8. What makes kick detection harder

Kick detection gets harder **drilling low-permeability formations with oil-based mud** — not high-permeability. Low permeability slows the influx itself, which slows the surface signs (pit gain, flow increase), and oil-based mud further masks gas cutting since gas tends to stay in solution longer than in water-based systems. Two masking effects stacked, not one canceling the other.

## 9. What counts as a "procedural" barrier

A procedural barrier is something like **monitoring the well for gains or losses** — a practice, not a physical thing. Drilling fluid is a *physical* barrier (it has hydrostatic weight doing the work); a monitoring practice is procedural. The two categories get blurred because both "count" as barriers in casual conversation.

## 10. Reading SIDPP with a non-return valve in the string

If the well kicks while tripping and a non-return (float) valve is stabbed into the string, that valve **has to be pumped open before you can read Shut In Drill Pipe Pressure** — it's not simply forbidden to run in closed position, which misses the practical point: the float being there is normal and expected, you just need a way to get a real SIDPP reading through it.

## 11. What a PWD tool shows during an influx

A Pressure While Drilling tool signals an influx through a **reduction in ECD**, not an increase. An influx entering the annulus is generally lighter than the mud it's displacing, which lowers the equivalent circulating density — the opposite of what you'd expect if you assumed "more fluid in the annulus" simply meant "more pressure."

## 12. Casing not kept full with a non-return float

If casing isn't kept full while running in with a non-return float assembly, the real risk is the **float failing and mud u-tubing up inside the casing** — not a sudden hook load decrease, which isn't the mechanism at play here at all.

## 13. What makes a kick bigger during shut-in

Calling the Toolpusher to the floor **before** shutting in — i.e., delaying the shut-in itself to get someone else present — is the practice that leads to a bigger influx. Regular pit drills, by contrast, are exactly what's supposed to make shut-in faster, not slower. The trap is assuming "getting a supervisor involved first" is always the cautious move; here, it costs time the well doesn't have.

## 14. What the Volumetric Method actually maintains

The Volumetric Method's whole point is maintaining **constant bottom hole pressure** as an influx migrates to surface — not constant pressure "inside" the influx itself, which isn't a control variable you actually have access to.

## 15. Physical barrier vs. procedure, restated

A cement plug is a **physical barrier** — it's a real thing sitting in the well doing hydrostatic or mechanical work. A proper BOP shut-in procedure is a *procedure* — necessary, but not itself a physical thing in the well. Same distinction as the procedural-barrier question above, from the other direction.

## 16. What actually causes a kick while running casing

Running casing, a kick is more likely caused by **surging-induced losses dropping the mud level** — not by keeping the casing full, which is actually the preventive measure, not the cause. Running pipe too fast pushes down on the fluid column (surging), can induce losses, and a dropping mud level is what erodes your hydrostatic overbalance.

## 17. Why you monitor pits after drilling out a float shoe

Circulating the hole clean after a casing and cement job, before drilling out the shoe, you watch pit and flow levels mainly to **check the float shoe isn't leaking** — not to track cement volume being cleaned out, which isn't the well control concern at that stage.

## 18. A plugged self-fill float during casing running

If a self-fill float gets plugged and the casing stops filling on its own, the real risk is that **if the plug suddenly clears, mud level in the annulus will drop** — a sudden change, not a gradual one from "losses due to higher mud level," which gets the direction of the risk backwards.

## 19. Responding to total losses in water-based mud

If total losses occur while drilling water-based mud, the right response is to **stop drilling, top-fill the hole with water, and record the volume** — not immediately pump lost circulation material, which is a later step once the situation is actually assessed, not the first reaction.

## 20. When a flow check isn't required

Of the routine flow-check trigger points, the one that does **not** require a flow check is after the **Driller increases weight on bit** — a normal drilling adjustment, not an event associated with well control risk. Tripping back to bottom, by contrast, is a classic flow-check trigger, which is what makes this pairing a common trap.

---

For hands-on practice with these scenarios, the [well control quiz](/well-control-quiz) covers the same ground interactively, and the [kill sheet calculator](/calculators/kill-sheet) runs the pressure math behind a real kill.
