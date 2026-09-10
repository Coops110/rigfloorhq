# RigFloorHQ Facebook — posting schedule

**Mechanism changed 2026-09-07: posting moves from manual Metricool uploads to a direct Facebook Graph API connection, run by Jarvis.** See [[RigFloorHQ Social Posting]] for the full decision history. Metricool's own Facebook OAuth connection was never fixed (error uncaptured) and is no longer the plan.

**Before any video posts, `scripts/verify-tiktok-sync.py <id>` must pass against the actual file sitting in this folder.** Re-run every time, not just once — this is the reusable version of the sync check that used to be done ad hoc.

**Cadence locked 2026-09-09: 4x/week, Mondays/Wednesdays/Fridays/Sundays, no rest day** — Chris's call: if a slot gets missed, post it the next day rather than skipping it, don't hold for the next scheduled day. Posting is manual (Chris posts through Meta Business Suite's composer directly — see the API-blocked-on-App-Review note in [[RigFloorHQ Social Posting]]), so these dates are the reminder target, not an automated trigger.

**Held videos — do NOT post:** 01 (differential sticking), 02 (hole cleaning), 05 (torque and drag). All three make operational claims and the project's own rule requires someone with rig experience to check them first — confirmed 2026-09-07 that check has **not** happened yet. They stay out of the schedule entirely until Chris clears them, at which point add them back in with Facebook-rewritten captions matching the pattern below.

**Video 04** already ran live starting 2026-08-14 under the old manual workflow — do not repost (`social/tiktok/04-6g-welding-ALREADY-POSTED-do-not-upload.mp4`).

**When each one posts:** update `featured` in `src/pages/links.astro` to point at that video's target page, in the same commit as anything else tied to that post (the existing one-video-running-at-a-time pattern) — the posting script/schedule run should do this automatically, not as a separate manual step.

## Posting order

| # | Date | File | Target | Caption (Facebook) | Tags | Link (UTM: source=facebook, medium=social) |
|---|---|---|---|---|---|---|
| 1 | 2026-09-07 (posted; caption-fix swapped in 2026-09-09) | `03-neutral-point.mp4` | `/equipment/drill-string` | Why drill pipe must never be in compression 👇 Weight on bit doesn't come from pushing down at surface — it comes from letting the string's own weight rest on the bit. Cross the neutral point into the pipe and it buckles, fatigues at the tool joints, and parts. | #neutralpoint #drillstring #drilling #oilfieldwork | `rigfloorhq.com/equipment/drill-string?utm_source=facebook&utm_medium=social&utm_campaign=03-neutral-point` |
| 2 | 2026-09-11 (Fri) | `06-kill-sheet.mp4` | `/calculators/kill-sheet` | Free kill sheet calculator — runs right in your browser 👇 Enter mud weight, SIDPP, TVD and slow pump rate, get kill mud weight, ICP and FCP instantly. No login, no install. | #killsheet #wellcontrol #drilling #oilfieldwork | `rigfloorhq.com/calculators/kill-sheet?utm_source=facebook&utm_medium=social&utm_campaign=06-kill-sheet` |
| 3 | 2026-09-13 (Sun) | `07-hydrostatic.mp4` | `/calculators/hydrostatic` | Check a mud weight against TVD in ten seconds 👇 Mud weight and true vertical depth in, hydrostatic pressure and overbalance out — see exactly what happens when you push mud weight up. | #hydrostaticpressure #mudengineer #drilling #oilfieldwork | `rigfloorhq.com/calculators/hydrostatic?utm_source=facebook&utm_medium=social&utm_campaign=07-hydrostatic` |
| 4 | 2026-09-14 (Mon) | `08-mud-weight-window.mp4` | `/calculators/mud-weight-window` | Drilling engineers, mud loggers, MWD hands: in a normally pressured well, your mud weight window might be several ppg wide — plenty of room for error. In an overpressured shale or a deepwater well, that same window can shrink to under 0.5 ppg. That's your entire safe range between a kick and a lost-circulation event. See exactly how narrow yours is — free calculator, runs in your browser, no login 👇 | #mudweightwindow #wellcontrol #drilling #oilfieldwork | `rigfloorhq.com/calculators/mud-weight-window?utm_source=facebook&utm_medium=social&utm_campaign=08-mud-weight-window` |
| 5 | 2026-09-16 (Wed) | `09-mud-weight-converter.mp4` | `/calculators/mud-weight-converter` | Mud weight gets quoted five different ways depending who's asking, and they all have to agree. Fresh water is 8.33 ppg — 0.433 psi/ft, sg 1.00. Sea water is 8.55 ppg — 0.445 psi/ft, sg 1.03. Type into any box, and every other unit updates instantly 👇 | #mudweight #drilling #wellcontrol #oilfieldwork | `rigfloorhq.com/calculators/mud-weight-converter?utm_source=facebook&utm_medium=social&utm_campaign=09-mud-weight-converter` |
| 6 | 2026-09-18 (Fri) | `10-bop-ram-size.mp4` | `/equipment/bop` | BOP techs, drillers — a pipe ram sized for 5" drill pipe will not seal on 3½". Each ram is cut for exactly one size, and a casing shear ram cuts pipe but doesn't seal the well — that's what the blind shear ram above it is for. See how a full stack is actually built 👇 | #bop #wellcontrol #drilling #oilfieldwork | `rigfloorhq.com/equipment/bop?utm_source=facebook&utm_medium=social&utm_campaign=10-bop-ram-size` |
| 7 | 2026-09-20 (Sun) | `11-jackup-depth.mp4` | `/equipment/rig-types` | Rig schedulers, drillers — a jackup's water depth limit isn't a spec sheet number, it's physics. It can't stand up in water deeper than its own legs, which caps it around 400 ft. Past that the rig has to float instead, and the whole design changes 👇 | #rigtypes #drilling #oilfieldwork #jackup | `rigfloorhq.com/equipment/rig-types?utm_source=facebook&utm_medium=social&utm_campaign=11-jackup-depth` |

**Static-image posts added 2026-09-10 — a new format, run alongside the videos, not on the 4x/week video grid.** Diagnosed video 03's dead traction (retention craters in the first 5 seconds, zero likes/shares/saves) against what's actually winning in Facebook's own "matches your interests" feed for this niche: single static formula/diagram images with instant payoff, no watch time required. First one built: `social/static/12-neutral-point-static.png` (1080x1350, source HTML in the same folder), same neutral-point topic as video 03 deliberately, to isolate format from content as the real variable. Post whenever, not tied to the Mon/Wed/Fri/Sun video cadence.

| Image | Target | Caption (Facebook) | Tags |
|---|---|---|---|
| `social/static/12-neutral-point-static.png` | `/equipment/drill-string` | Why collars push and pipe pulls 👇 The neutral point is where tension becomes compression in the drill string — put it in the wrong place and drill pipe buckles instead of the collars taking the load. The formula and a worked example, one image. | #neutralpoint #drillstring #drilling #oilfieldwork |
| Link (UTM) | `rigfloorhq.com/equipment/drill-string?utm_source=facebook&utm_medium=social&utm_campaign=12-neutral-point-static` | | |

**If a date is missed, post it the next day and shift nothing else** — Chris's explicit call 2026-09-09: don't skip a slot to stay on the original grid, just run one day late and continue from there.

**Held, pending review (not scheduled):**

| File | Target | Old TikTok caption (for reference — needs Facebook rewrite once cleared) |
|---|---|---|
| `01-differential-sticking.mp4` | `/blog/differential-sticking-explained` | Why pulling harder on stuck pipe often makes it worse |
| `02-hole-cleaning.mp4` | `/blog/hole-cleaning-high-angle-wells` | The worst angle for hole cleaning is not the one you think |
| `05-torque-and-drag.mp4` | `/blog/torque-and-drag-early-warning` | The warning was there hours before the number looked wrong |

## Status

- [x] 03 — posted 2026-09-07; caption-fix version swapped in live 2026-09-09
- [ ] 06 — due 2026-09-11 (Fri)
- [ ] 07 — due 2026-09-13 (Sun)
- [ ] 08 — due 2026-09-14 (Mon)
- [ ] 09 — due 2026-09-16 (Wed) — screen-recorded mud weight converter
- [ ] 10 — due 2026-09-18 (Fri) — first animated-diagram video, BOP ram sizing
- [ ] 11 — due 2026-09-20 (Sun) — animated jackup depth-limit video
- [x] 04 — already live since 2026-08-14, do not repost
- [ ] 01 — **held**, pending rig-experience review
- [ ] 02 — **held**, pending rig-experience review
- [ ] 05 — **held**, pending rig-experience review (its original 2026-08-23 TikTok-native schedule also silently failed — never actually posted, so this is still its true first attempt whenever it's cleared)
