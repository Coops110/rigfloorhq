# RigFloorHQ — Content Plan

Working document for what gets published, in what order, and what has to be
true before anything goes live. Kept in the repo so it is version-controlled
alongside the site it describes.

Engineering rules — hreflang, metadata, PowerShell traps, deploy behaviour —
are in `CLAUDE.md`. Read that too before touching anything structural.

Last reviewed: 3 August 2026

---

## The constraint worth stating first

**One substantial piece per week is a ceiling, not a floor.**

Four strong pages a month will outperform sixteen thin ones, and this site has
already proved it: the August 2026 audit found four blog posts of 2,200+ words
earning nothing, because every one of them had a single inbound link. The
problem was never volume.

Google's *scaled content abuse* policy targets producing pages at volume
without adding value, and the helpful-content guidance applies harder to
safety-adjacent material. Publishing faster is the main way this site could
damage itself.

---

## The 4-week cycle

| Week | Focus | Output |
| --- | --- | --- |
| 1 | Pillar work | A new pillar section, or a new pillar started |
| 2 | Cluster support | One supporting post, linked both ways at publish |
| 3 | Depth or repair | A second support post, **or** thicken an existing thin page |
| 4 | Maintenance | **No new URLs.** Linking audit, Search Console review, Spanish parity, refresh dates |

Week 4 is the one that gets skipped and shouldn't. The August 2026 session
produced more value from fixing internal links and de-duplicating overlapping
pages than any single new post would have.

---

## Rules for every publish

1. **Ship the page and its inbound links in the same commit.** Minimum two
   contextual inbound links from relevant existing pages, in body content —
   not nav or footer. They build and deploy together, so no link is ever live
   ahead of its target. Never publish an orphan: both existing pillars had to
   be retro-fitted because this was skipped.
2. **Check overlap first.** Use the inventory below. If an existing page
   already targets the query, the job is differentiating or expanding it, not
   adding a page.
3. **One page, one intent.** If the query it owns cannot be stated in one
   sentence, it is not ready.
4. **Decide Spanish at publish time.** Translate it or deliberately do not.
   Drifting is what produced the hreflang problems fixed in August 2026.
   If there is no translation, declare no `alternateHref` on `BaseLayout` —
   a non-reciprocal hreflang is ignored and misdescribes the pages.
5. **Safety framing on anything operational.** Reference material, never
   instruction. Company procedure and the certified supervisor govern.
6. **Run `npm run build` and check the page renders** before committing. Verify
   any TOC anchors resolve against real heading ids.

## Per-post pattern

Established from the stuck pipe cluster and worth repeating. Each post gets:

- **An SVG diagram** in `public/images/blog/`. A few KB, crisp at any size, and
  it carries the mechanism better than prose. Give it `<title>` and `<desc>`
  as well as alt text.
- **Alt text that conveys the mechanism**, not the picture. Someone who cannot
  see it should still learn why a bed forms at 50° and not at 5°. "Diagram of
  hole cleaning" is useless.
- **Six FAQ pairs** in frontmatter, repeated in the body. They render as
  FAQPage structured data. The duplication is deliberate — see `CLAUDE.md`.
- **Two or more inbound links** added to existing pages *in the same commit*,
  so the links and their target go live together.
- **The Spanish version**, or a deliberate decision not to.

Do not set `image:` to an SVG. It becomes `og:image` and social scrapers will
not render it. Leave it unset and the PNG fallback is used.

---

## Current inventory — check against this before writing

### Clusters

| Section | Pages |
| --- | --- |
| Careers | hub, roughneck, driller, salary, certifications |
| Equipment | hub, rig-types, drill-string, bop |
| Drilling | hub, casing, directional, mud-weight, well-control |
| Welding | hub, certifications, underwater-welding |
| Safety | hub, h2s |
| Calculators | hub, hydrostatic, kill-sheet, mud-weight-window |
| Reference | glossary |
| Pillars | advanced-well-control-and-hydrostatics, stuck-pipe-and-fishing-operations |

### Blog

well-control-basics · five-warning-signs-of-a-kick · rig-floor-ppe-guide ·
permit-to-work-system · stop-card-system · real-time-drilling-data ·
roustabout-to-driller-timeline · hole-cleaning-high-angle-wells ·
differential-sticking-explained · drilling-jars-explained ·
torque-and-drag-early-warning · welcome-to-rigfloorhq *(noindex)*

### Already covered — do not write these again

| Topic | Owned by |
| --- | --- |
| Well control procedure, shut-in, kill methods | `/drilling/well-control` |
| What a kick is, why shut-in works | `/blog/well-control-basics` |
| Individual kick warning signs | `/blog/five-warning-signs-of-a-kick` |
| TVD/MD, ECD, volumetric, MPD | the advanced well control pillar |
| BOP stack, rams, pressure checks | `/equipment/bop` |
| Hydrostatic maths, swab/surge, mud composition | `/drilling/mud-weight` |
| Neutral point, pipe grades, inspection class | `/equipment/drill-string` |
| Casing strings, liners, LOT/FIT | `/drilling/casing` |
| Build rate, profiles, dogleg severity | `/drilling/directional` |
| Welding positions, WPS/PQR/WPQ, continuity | `/welding/certifications` |
| Hyperbaric chamber types, AWS D3.6M classes, arc under pressure | `/welding/underwater-welding` |
| Differential vs mechanical sticking, fishing | the stuck pipe pillar |
| Cuttings transport, beds, critical angle | `/blog/hole-cleaning-high-angle-wells` |
| The three sticking conditions, spotting fluids | `/blog/differential-sticking-explained` |
| Jar cocking and firing, up vs down, accelerators | `/blog/drilling-jars-explained` |
| Friction factor, modelled vs measured, three weights | `/blog/torque-and-drag-early-warning` |

---

## Queue

### Done — stuck pipe cluster complete (3 August 2026)

All four supporting posts published EN and ES, each with an SVG diagram and
FAQPage markup, each linked both ways with the pillar:

1. ✅ Hole cleaning in high-angle wells
2. ✅ Differential sticking explained
3. ✅ Drilling jars explained
4. ✅ Torque and drag as early warning

### Next — a maintenance week

Per the cycle, no new URLs. Search Console review, check the four new posts are
indexing, verify internal links, and confirm nothing has drifted.

Do not start the next pillar until this has happened. The point of the
maintenance week is that it catches the problems the August audit found, and
skipping it is how they accumulated in the first place.

### Next pillars, in priority order

- **Drilling Fluids & Mud Systems** — largest cluster potential. Mud types,
  rheology, solids control, lost circulation, mud logging.
  **Overlap risk:** `/drilling/mud-weight` now covers what makes mud heavy and
  basic solids control. The pillar must go past that, not restate it.
- **Well Completions** — the site stops at drilling and never covers
  perforating, frac, sand control, wellheads. No overlap risk.
- **Offshore Life & Rotations** — careers covers roles and pay but not
  rotations, HUET/BOSIET in practice, or what the job is like. No overlap risk.

### Known thin pages, if a week needs filling

Hubs and calculators, where brevity is partly appropriate — expand only where
there is something real to add: `/equipment` (219 words), `/` (265),
`/calculators/hydrostatic` (300), `/drilling` (330), `/calculators/kill-sheet`
(341), `/calculators/mud-weight-window` (347), `/safety` (367), `/careers` (367).

---

## Worth more than any single post

**E-E-A-T is the weakest signal on this site, not volume.** `/about` names no
author with field credentials on a site publishing well control and safety
guidance.

If there is real rig experience behind the content, attribute it by name. If
there is not, a named reviewer who has it — credited for review rather than
authorship — is worth more than a month of posts. This is the highest-leverage
single change available, and no amount of publishing substitutes for it.

---

## Measurement

Check **monthly**, not weekly — weekly is noise.

- Impressions and clicks by page in Search Console
- Queries ranking 5–20 — the closest available wins, and usually a case for
  expanding an existing page rather than writing a new one
- Whether new pages get indexed within roughly two weeks

**If a page is not indexed after a month**, it is almost always thin or
orphaned. Check inbound links and word count before assuming anything else.

GA4 (`G-YGCX22M94L`) is consent-gated, so analytics numbers under-report by
however many visitors decline. Use Search Console for search performance and
treat GA4 as directional for on-site behaviour.

---

## Policy guardrails

- **Scaled content abuse** — do not batch-produce. The cadence above exists for
  this reason.
- **Helpful content** — every page should answer something a working hand or a
  new entrant actually asks. If it exists to target a keyword, it is the wrong
  page.
- **Safety-adjacent accuracy** — name standards rather than paraphrasing them
  into fact, and point at the current published version. Standards get revised.
- **No fabricated specifics.** Figures, pay ranges and intervals vary by
  region, operator and cycle. Say so, and mark them as indicative.
