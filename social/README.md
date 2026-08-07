# Social assets

Generated frames live in `social/tiktok/` and are **gitignored** — they are
binaries, not site content. Regenerate them with:

```
powershell -File scripts/make-tiktok-frames.ps1
```

This README is the part worth keeping.

---

## The workflow

Roughly **10 minutes per video** once the CapCut template exists, so a batch of
ten is an afternoon.

1. Import the four frames for one topic into CapCut.
2. Set each frame to ~5–7 seconds. Frame 1 shorter — the hook has about two
   seconds to land.
3. Add TikTok's built-in text-to-speech reading the script below, or record
   your own voice.
4. Turn auto-captions on. A large share of viewers watch muted.
5. Export 1080×1920.
6. Schedule. Do not post ten in one day.

**Safe zones are already handled.** The frames keep all content inside
x 80–880 and y 250–1430, because TikTok's own UI covers the bottom ~450px and
the right ~200px. Do not add text outside that box.

---

## Framing rule

**Never imply rig experience you do not have.** Say "the rule is" and "here is
why", not "when I was on the floor". Every claim below is on the site and can
be checked.

If asked in comments whether you have worked a rig, the good answer is the true
one: no, this is a reference project, reviewed by someone who has. That is
defensible. Pretending is not.

**Get videos 1, 2 and 5 checked before posting.** They are operational.

---

## The five videos

Bio link for all of them:
`https://rigfloorhq.com/links?utm_source=tiktok&utm_medium=social&utm_campaign=bio`

Swap `bio` for the video id when you want to tell them apart.

### 01 — Differential sticking
**Target:** `/blog/differential-sticking-explained`

> Your drill string is stuck. The one thing you should not do is pull harder.
> Differential sticking is pressure holding the pipe against the wall. The force
> is the pressure difference multiplied by the contact area — and tension
> reduces neither of them. Worse, in a deviated hole pulling presses the string
> harder into the wall, which increases the contact area. You do not out-pull
> it. You lower the pressure.

**Caption:** Why pulling harder on stuck pipe often makes it worse 👇
**Tags:** #oilfield #drilling #roughneck #oilandgas #drillingrig #wellcontrol

### 02 — Hole cleaning
**Target:** `/blog/hole-cleaning-high-angle-wells`

> Everyone assumes horizontal wells are the hardest to clean. They are not.
> Past about fifty degrees, cuttings settle onto the low side and leave the
> flow entirely — they stop being carried and start accumulating. But near
> horizontal, those beds mostly sit still. Between forty-five and sixty degrees
> they form *and* have a slope to slide down, so they avalanche. The dangerous
> angle is the middle one.

**Caption:** The worst angle for hole cleaning is not the one you think
**Tags:** #drilling #directionaldrilling #oilfield #mudengineer #oilandgas

### 03 — The neutral point
**Target:** `/equipment/drill-string`

> Weight on bit does not come from pushing down from surface. It comes from
> letting part of the string's own weight rest on the bit. Drill collars are
> thick-walled and built for compression. Drill pipe is thin-walled and built
> for tension. The boundary is the neutral point, and it has to stay inside the
> collars. Put drill pipe into compression and it buckles, fatigues at the tool
> joints, and eventually parts.

**Caption:** Why drill pipe must never be in compression
**Tags:** #drilling #oilfield #drillstring #oilandgas #roughneck

### 04 — 6G welding *(best for follower growth)*
**Target:** `/welding/certifications`

> There is one welding test worth having, and the rest are included. Welder
> qualification is by position, not by how the weld looks. 1G rotates the pipe,
> so you never leave flat. 5G is fixed horizontal. 6G is fixed at forty-five
> degrees — every position in a single weld, with no comfortable place to
> start. Pass 6G and you are qualified for everything below it. On a rig you
> cannot rotate a mud line to suit yourself.

**Caption:** The only welding ticket worth testing for
**Tags:** #welding #welder #pipewelder #6g #weldinglife #oilfield

### 05 — Torque and drag
**Target:** `/blog/torque-and-drag-early-warning`

> By the time torque looks high, you have been in trouble for hours. A torque
> figure means nothing on its own — it depends on depth, angle, mud and hole
> size. What carries the information is the gap between what the model
> predicted and what the string actually did. That gap opens several
> connections before the number ever looks alarming. Watch the divergence, not
> the value.

**Caption:** The warning was there hours before the number looked wrong
**Tags:** #drilling #oilfield #oilandgas #drillingrig #wellsite

---

## Also worth filming

**Calculator screen recordings.** Highest conversion of anything here and
almost no production — record your phone, enter numbers, say what each output
means. Must carry the disclaimer: learning tool only, use your company's
approved sheet on a live well. It is already in the terms.

---

## What to measure

Monthly, not daily.

- **GA4 → Acquisition** for the `tiktok` source. Remember analytics is
  consent-gated, so it under-reports.
- **Search Console → brand queries.** People who see the name and Google it
  later are the real prize. That shows up as impressions for "rigfloorhq",
  not as TikTok traffic.

Do not judge this by rankings moving. Social links are nofollow and pass no
authority. The value is traffic, brand search, and the chance that someone with
a website of their own finds you.
