---
title: "Hole Cleaning in High-Angle Wells: Why Cuttings Beds Form and How to Shift Them"
description: "Above roughly 50 degrees, cuttings stop being carried out and start settling into beds. Why gravity changes the problem, what actually moves a bed, and how to read the signs before the string packs off."
publishDate: "2026-08-03"
author: "RigFloorHQ Team"
category: "Drilling"
tags: ["hole cleaning", "cuttings beds", "high angle", "directional drilling", "stuck pipe", "ECD"]
diagrams:
  - src: "/images/blog/cuttings-beds-by-angle.svg"
    alt: "Three wellbore sections compared. Vertical: cuttings that are not lifted fall back into the flow and get another chance, so cleaning is self-correcting. Between 45 and 60 degrees: cuttings settle onto the low side and form a bed which can then avalanche down the hole as a slug of solids. Near horizontal: beds form readily but tend to sit still, because there is little downhole slope for them to slide along."
    title: "How cuttings transport changes with hole angle"
faq:
  - q: "At what angle does hole cleaning become a problem?"
    a: "Around 30 degrees cuttings start settling measurably. By 50 to 60 degrees, beds form readily. The 45 to 60 degree band is generally treated as the most troublesome because beds both form and can then slide downhole as a slug of solids."
  - q: "Is higher flow rate always better for hole cleaning?"
    a: "More flow generally cleans better, but it is bounded by equivalent circulating density, pump capacity and pressure drop across the bit and motor. In a narrow mud weight window the ECD ceiling is often reached before the ideal cleaning rate, which is why hole cleaning is an optimisation rather than a maximisation."
  - q: "Does pipe rotation really make that much difference to hole cleaning?"
    a: "Yes. Rotation mechanically disturbs the bed and moves material into faster flow. A hole that will not clean while sliding can clean acceptably while rotating at the same flow rate, which is one of the hidden costs of extended sliding intervals with a bent housing motor."
  - q: "Will a viscous sweep fix a cuttings bed?"
    a: "A sweep can mobilise accumulated solids, but it is a tool rather than a fix. If flow rate and rotation are inadequate, sweeps buy time without solving the cause, and very high viscosity can suppress the turbulence that helps clear beds in the first place."
  - q: "How do I know cuttings are being left downhole?"
    a: "Compare cuttings volume at the shakers against what the drilled footage and hole size imply should be arriving. A persistent shortfall is the clearest indication. Rising torque, drag and standpipe pressure support it, and excess hole fill on trips confirms it."
  - q: "Can poor hole cleaning cause a kick?"
    a: "Not directly, but it raises equivalent circulating density, which can fracture the formation and cause losses. Losing mud to the formation reduces hydrostatic pressure, which can allow an influx. The connection is indirect but real."
---

Hole cleaning is one of those subjects that sounds like housekeeping and turns out to be the reason a well got stuck. In a vertical hole it more or less takes care of itself. Past about 50 degrees it stops being automatic, and the difference is not a matter of degree — the mechanism changes entirely.

## Key Takeaways

| Question | Answer |
|---|---|
| What changes above 50 degrees? | Cuttings settle sideways onto the low side of the hole instead of falling back into the flow. They form a bed rather than being re-suspended. |
| Which range is worst? | Roughly 45–60 degrees. Beds form readily and can then avalanche downhole, which is worse than a stable bed at 90 degrees. |
| What actually moves a bed? | Flow rate first, pipe rotation second. Mud properties matter, but they cannot rescue an inadequate flow rate. |
| Why does it end in stuck pipe? | A bed that collapses around the string packs it off — one of the mechanical sticking mechanisms covered in [stuck pipe and fishing operations](/pillars/stuck-pipe-and-fishing-operations). |
| What is the earliest signal? | Cuttings volume at the shakers below what the drilled rate implies. What is not coming out is still downhole. |
| What else does a bed cause? | Rising ECD, because the effective annulus is smaller — which can push you past fracture pressure. See [mud weight and hydrostatics](/drilling/mud-weight). |

## Why Angle Changes the Problem

![Three wellbore sections compared. Vertical: cuttings that are not lifted fall back into the flow and get another chance, so cleaning is self-correcting. Between 45 and 60 degrees: cuttings settle onto the low side and form a bed which can then avalanche down the hole as a slug of solids. Near horizontal: beds form readily but tend to sit still, because there is little downhole slope for them to slide along.](/images/blog/cuttings-beds-by-angle.svg)

In a vertical well, a cutting has to be lifted against gravity. If the annular velocity beats the particle's slip velocity, it comes out. If it does not, it falls back into the flow and gets another chance. The failure mode is gradual and self-correcting.

Tilt the hole and gravity stops opposing the flow and starts acting across it. A cutting now only has to travel a short distance sideways to reach the low side of the annulus, where the flow is slowest. Once it settles there it is no longer in the transport stream at all. It is not being lifted badly — it has left the system.

That is the important distinction. A vertical hole with marginal cleaning carries cuttings slowly. A high-angle hole with marginal cleaning accumulates them, and accumulation is cumulative over hours and days of drilling.

## The 45 to 60 Degree Problem

The intuition that horizontal must be worst is wrong, and it is worth understanding why.

At high angle approaching horizontal, beds form readily but tend to sit still. Gravity holds them against the low side and there is little downhole component to move them.

Between roughly 45 and 60 degrees, a bed has both a reason to form and a slope to slide down. Beds built during drilling can avalanche — sliding en masse down the hole and arriving somewhere below as a slug of solids. That is how a hole that seemed to be cleaning acceptably produces a sudden pack-off on a connection or a trip.

This range gets called the critical angle for exactly that reason. If a well profile spends a long section in it, hole cleaning deserves more attention than the angle alone suggests. Profile and build rate are covered on the [directional drilling page](/drilling/directional).

## What Actually Shifts a Bed

Four levers, in rough order of how much they matter.

### Flow rate

Annular velocity is the primary control and nothing else compensates for having too little of it. If flow rate is below what the hole size and angle require, no combination of mud chemistry fixes it.

The constraint is that flow rate is not freely available. It is bounded at the top by ECD — more flow means more annular pressure loss, and in a narrow [mud weight window](/drilling/mud-weight) that ceiling arrives quickly. It is also bounded by pump capability and by the pressure drop across the bit and any downhole motor.

Hole cleaning in high angle is therefore usually an optimisation against ECD rather than a free choice, which is precisely why it is a planning problem rather than something to solve at the point of trouble.

### Pipe rotation

Rotation is the most effective thing available after flow rate, and it is often underused.

A rotating string mechanically disturbs the bed and drags material off the low side into the faster-moving flow above it. The effect is large: a hole that will not clean while sliding can clean acceptably while rotating at the same flow rate.

This is one of the practical costs of sliding with a bent-housing motor to build angle. While sliding, the string is not rotating, so cleaning degrades over exactly the interval where the hole is also getting more deviated. Rotary steerable systems avoid this because the string keeps turning while steering.

### Mud properties

Rheology matters, but in a more nuanced way than "thicker is better".

In the annulus, a fluid with high low-shear viscosity carries solids better in the laminar flow regime typical of large annuli. But in high-angle hole the mechanism that clears beds is turbulence and mechanical agitation, and very high viscosity suppresses turbulence — so thickening the mud past a point makes bed removal harder, not easier.

The practical approach is usually a base fluid tuned for suspension, with periodic **sweeps** — a pill of higher or lower viscosity pumped round to disturb and mobilise the bed. Sweeps are a tool for shifting accumulated solids, not a substitute for adequate flow and rotation.

### Time

Circulating clean before a trip is not dead time. A hole that has been drilled with marginal cleaning needs bottoms-up circulations, with rotation, to bring accumulated solids out before the string is pulled through them.

Cutting circulation short to save an hour is the decision that most often precedes an expensive trip out.

## Reading the Signs

Hole cleaning problems announce themselves before they cause damage. The signals are unglamorous and mostly free.

**Cuttings volume at the shakers.** The most direct measurement available. Compare what is arriving against what the drilled footage and hole size imply should be arriving. A persistent shortfall means the difference is still downhole. This is a trend observation across a tour, not a glance on the way past.

**Torque and drag.** Both climb as the string works against accumulated solids. As with everything in this area, the trend matters and the absolute number does not — a torque figure that is normal on one well is a warning on another if it has risen steadily over a shift.

**Standpipe pressure.** A bed narrows the effective annulus, raising annular pressure loss and therefore ECD. Rising pump pressure with no other explanation is worth taking seriously.

**Overpull and tight spots.** Consistent tight spots at a particular depth point at a specific interval rather than a general condition.

**Hole fill on trips.** A hole that takes more fill than calculated has given something up.

Each of these is a trend rather than a threshold, which is where [real-time drilling data](/blog/real-time-drilling-data) earns its cost — the trends are visible long before the event, provided someone is watching the trend rather than the instantaneous value.

## Where It Ends If Ignored

Two outcomes, and they compound.

**Pack-off and stuck pipe.** A bed that collapses around the string is one of the mechanical sticking mechanisms. It is also one of the more announced ones — standpipe pressure usually rises and returns drop before the string stops moving. The full picture, including how to tell this apart from differential sticking before acting, is in [stuck pipe and fishing operations](/pillars/stuck-pipe-and-fishing-operations).

**ECD and lost circulation.** Solids in the annulus raise circulating density. In a narrow window that can push bottomhole pressure past fracture pressure, which loses circulation — and losing returns removes the transport mechanism that was already struggling. The failure feeds itself.

There is also a slower cost. Poor cleaning increases wear on the string and on casing, and makes running casing harder, because the hole is not the clean cylinder the casing design assumed.

## Conclusion

Hole cleaning in high angle is a planning problem that gets discovered as an operational one. The levers — flow rate, rotation, mud properties, circulating time — are all decided before trouble appears, and all constrained by things decided earlier still, like the well profile and the mud weight window.

The habit worth building is the shaker check. Counting what comes out against what should be coming out is the cheapest diagnostic on the rig, and it is the one that gives the most warning.

## Frequently Asked Questions

### At what angle does hole cleaning become a problem?

Around 30 degrees cuttings start settling measurably. By 50 to 60 degrees, beds form readily. The 45 to 60 degree band is generally treated as the most troublesome because beds both form and can then slide downhole.

### Is higher flow rate always better for hole cleaning?

More flow generally cleans better, but it is bounded by ECD, pump capacity and pressure drop across the bit and motor. In a narrow mud weight window the ECD ceiling is often reached before the ideal cleaning rate, which is why hole cleaning is an optimisation rather than a maximisation.

### Does pipe rotation really make that much difference?

Yes. Rotation mechanically disturbs the bed and moves material into faster flow. A hole that will not clean while sliding can clean acceptably while rotating at the same flow rate, which is one of the hidden costs of extended sliding intervals.

### Will a viscous sweep fix a cuttings bed?

A sweep can mobilise accumulated solids, but it is a tool rather than a fix. If flow rate and rotation are inadequate, sweeps buy time without solving the cause — and very high viscosity can suppress the turbulence that helps clear beds in the first place.

### How do I know cuttings are being left downhole?

Compare cuttings volume at the shakers against what the drilled footage and hole size imply. A persistent shortfall is the clearest indication. Rising torque, drag and standpipe pressure support it, and excess hole fill on trips confirms it.

### Can poor hole cleaning cause a kick?

Not directly, but it raises ECD, which can fracture the formation and cause losses — and losing mud to the formation reduces hydrostatic pressure, which can allow an influx. The connection is indirect but real, and covered on the [well control page](/drilling/well-control).
