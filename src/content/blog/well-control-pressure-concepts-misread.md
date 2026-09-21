---
title: "Well Control Pressure Concepts That Get Misread"
description: "Pressure, hydrostatic, and definition-based well control questions that read one way but mean another — ECD, porosity, SIDPP, and the reasoning behind each correct answer."
publishDate: "2026-09-21"
author: "RigFloorHQ Team"
category: "Well Control"
tags: ["well control", "hydrostatic pressure", "training", "kill sheet"]
faq:
  - q: "Are these official IWCF or IADC exam questions?"
    a: "The subject matter follows standard IWCF/IADC well control theory, but this post isn't affiliated with either body and isn't a substitute for accredited certification. Treat it as a study aid, not exam material."
---

A lot of well control pressure questions aren't hard because the math is hard — they're hard because two definitions sound alike, or a scenario reads like a different one you've seen before. Here are the pressure and definition concepts that get misread most often.

## 1. A self-fill float that fails to convert

If a self-fill (autofill-tube type) float assembly fails to convert to a check valve, the real consequence is that **fluids from the annulus or formation can enter the casing** — not that pressure needs to be held on the annulus to prevent u-tubing. The float's whole job is to stop backflow into the casing once it converts; failing to convert means that protection simply isn't there.

## 2. Blind Rams vs. Blind/Shear Rams

These are two different pieces of equipment and it's easy to blur them. **Blind Rams seal off open hole** — no pipe in the way, just a clean seal. **Blind/Shear Rams cut the drillstring and then seal off the hole**, for when there's pipe in the way and no other option. Assuming "blind" always implies cutting is the mix-up.

## 3. First step after shut-in pressures stabilize

Once a well is shut in and pressures have stabilized, the first move is to **check the well is secure — no leaks** — not to start reading drillpipe pressure to back into formation pressure. Confirming the barrier is actually holding comes before any pressure interpretation.

## 4. Defining Equivalent Circulating Density

ECD is **mud hydrostatic pressure plus annular friction loss**, expressed as an equivalent mud weight — not hydrostatic alone. Leaving out the friction component is the whole reason ECD exists as a separate concept from static mud weight in the first place.

## 5. Defining porosity

Porosity is **the amount of void space in the rock, expressed as a percentage** — not the pressure of fluid sitting in that pore space, which is a related but separate idea (pore pressure). The two get confused because they both involve pores, but one's a volume measurement and the other's a pressure.

## 6. The point of the surface-stack start-up procedure

The recommended pump start-up procedure on a surface stack rig exists to **maintain correct bottom hole pressure** — not to hold drill pipe pressure constant for its own sake. Drill pipe pressure is the tool you're adjusting; bottom hole pressure is the thing you're actually protecting.

## 7. Measuring ECD loss while drilling

A loss of ECD that might mean the well's gone underbalanced is best caught with a **Pressure While Drilling (PWD) tool** — not a rotary steerable tool, which serves a completely different purpose (directional control, not pressure measurement) even though both sit in the BHA.

## 8. Which way fluid moves if a cement plug fails

A well full of 12.2 ppg mud has a 500-ft cement plug set and tested, with the mud above it replaced by lighter 10.2 ppg brine. If that plug failed, fluid would move **upward, driven by the higher-pressure mud below** — not downward from above. The heavier fluid is underneath; pressure always pushes from the higher side toward the lower one.

## 9. What actually drives influx speed

Between formation permeability and the differential pressure between mud hydrostatic and formation pressure, the largest influx over a given time comes from **high permeability paired with a high differential pressure** — both factors compounding, not one offsetting the other. Picking "high permeability with a *low* differential" undersells how much the differential itself matters.

## 10. What a choke drill is actually for

A choke drill exists to help the crew **understand how choke and well pressures react during a kill** — not specifically to rehearse lining up for a reverse-circulation kill, which is a narrower, less common scenario than the drill is designed to cover.

## 11. The full objective of the lube and bleed method

Lube and bleed reduces surface pressure by **increasing hydrostatic pressure and removing gas** — both halves matter. Naming only the hydrostatic increase and leaving out the gas removal misses half of what the method is actually doing.

## 12. Pump pressure at a different SPM (worked number)

Pump pressure of 355 psi at 42 SPM, what's the new pressure at 35 SPM? Pressure scales with the **square** of the speed ratio, not linearly: 355 × (35/42)² ≈ **247 psi**, not 296 psi (which is what you'd get scaling linearly). Forgetting the square relationship is the single most common way to misjudge pump pressure changes.

## 13. What a pit drill actually trains

The main reason for a pit drill is to make sure the crew can **recognize and react to a kick** — not to train them to actually kill the well, which is a separate, later skill. A pit drill is about catching the kick early, not resolving it.

## 14. The full objective of the Volumetric Method

The Volumetric Method exists to **let gas expand as it migrates toward the BOP while casing pressure is allowed to rise to compensate for bled mud** — not to remove a saltwater influx when circulation isn't possible, which is a different problem the method isn't built for.

## 15. Porosity vs. permeability, restated

Asked directly which term describes the percentage of void space in a formation, the answer is **porosity**, not permeability — permeability describes how well those void spaces connect and let fluid flow, a related but distinct rock property.

## 16. What "abnormal pressure" actually means

Abnormal pressure means **formation pressure exceeds the normal hydrostatic pressure of formation water at that depth** — it isn't about excess pressure generated by circulating mud fast, which is a surface/dynamic effect entirely separate from the geological cause of abnormal pressure.

## 17. The purpose of a ram BOP's weep hole

The weep hole on a ram-type BOP is there to **indicate a leak from the primary mud seal on the piston rod** — an early warning sign — not to prevent damage to the closing chamber, which isn't what that small drilled hole is doing at all.

## 18. Hydrostatic pressure of setting cement

As a column of cement sets, its hydrostatic pressure **decreases** — it doesn't stay the same. Cement transitions from a fluid state to a solid one, and as it gels, it stops transmitting full hydrostatic pressure the way a liquid does. This is exactly why cement jobs are watched closely for pressure loss during the setting window.

## 19. Defining Shut In Drill Pipe Pressure precisely

SIDPP is defined as the difference between **fluid hydrostatic pressure in the drill string and formation pressure** — not the annulus. It's easy to swap "drill string" for "annulus" here since SICP (the annulus-side equivalent) is defined the same way but on the other side of the well.

---

For the formulas behind these, the [hydrostatic pressure calculator](/calculators/hydrostatic) and [mud weight converter](/calculators/mud-weight-converter) run the same math live. Background theory lives on the [well control reference page](/drilling/well-control).
