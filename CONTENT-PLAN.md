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
- **A `diagrams:` frontmatter entry** for each diagram, which renders a
  copy-paste embed block offering the image for reuse with attribution back.
  This is the site's main standing mechanism for earning links: a diagram is
  something other people want, and every reuse credits the page. Declare it
  explicitly — an image is only offered for reuse when that is intended.
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

### Queued from the monetization assessment (24 August 2026)

Not started. In order, and none of them is display ads:

1. **Verify Journey by Mediavine's actual session floor.** 1,000 vs 10,000
   changes whether any of this is a this-year plan.
2. **US Gulf credentials comparison page.** IADC RigPass vs SafeGulf vs
   Veriforce Basic Orientation 7.0 vs BOSIET vs the forthcoming API WorkSafe
   Offshore. The site has zero coverage and GSC already shows ~200
   impressions/month of long conversational queries asking exactly this,
   sitting at positions 38-95. It is also the natural page to monetize with
   Petrolessons and Oilandgasclub, and the traffic proof point for a
   LearnToDrill email.
3. **Cheat-sheet PDF and email capture on the calculators** — after the
   privacy and cookie pages are updated to cover it.
4. **Affiliate network accounts**: ShareASale, CJ, AvantLink, Impact,
   FlexOffers. Then WorkingPerson on the PPE guide.
5. **Direct email to LearnToDrill**, once there is a traffic number worth
   quoting.

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

## Distribution and reuse

Assessed 18 August 2026. Both of these are about the same constraint —
the site needs citations from outside it, not more pages.

### Diagrams: offer the file, not only the embed code

`DiagramEmbed` already says the diagram may be used "on your own site, in a
presentation, or in training material", and it is on `/welding/underwater-welding`,
`/equipment/bop` and `/equipment/rig-types`.

**But it only gives an HTML embed snippet.** Someone building a toolbox talk or
a PowerPoint cannot paste HTML into a slide. The audience most likely to reuse
these — trainers, HSE advisors, supervisors writing a pre-tour — is exactly the
audience the current offer fails.

Two things are missing: a direct link to the image file, and a plain-text credit
line short enough to sit in a slide footer.

Be clear about the trade-off before adding them. **The embed snippet is what
earns links; a downloaded file earns none.** Keep the embed first and most
prominent, and treat the download as reach rather than SEO. It still pays —
a diagram in a training deck seen by thirty hands is brand exposure the site
has no other way to buy — but do not expect it to move rankings.

Worth doing. It is small, and it serves the one mechanism this site has for
earning the external links that everything else is currently blocked on.

### TikTok: not yet, and not on the calculators

The instinct is right — a calculator is the best moment on the site to ask for
a follow, because the visitor has just got something useful. Calculators convert
at 6.3% against a 0.57% site average, so the engagement is real.

Three reasons to hold anyway:

**There is no handle configured.** `src/lib/site.js` carries an email and
nothing else. Adding social links is a decision about whether the TikTok
presence is established enough to point the whole site at, not a code change.

**There is no measured social traffic to build on.** GA4 for the 30 days to
17 August shows Organic Search 98, Direct 57, AI Assistant 3, Unassigned 2,
Referral 1 — and **no Social channel at all**. Note the caveat: TikTok's in-app
browser usually strips the referrer, so TikTok visits tend to land in Direct.
Direct is 57 sessions engaging at 14% against organic's 48%, which looks more
like bots than an engaged social audience, but the two cannot be separated from
GA alone.

**The account is not ready to be pointed at.** As of 18 August the profile
`@rigfloorhq` has **0 followers** on 2 published videos totalling ~750 views,
with 2 more scheduled. Sending an engaged calculator user to an empty profile
converts nobody, and a 0-follower link is weaker social proof than no link.

To correct an earlier note in this file: **outbound links do not meaningfully
weaken the site.** A handful of social links is ordinary and every site has
them; the PageRank argument is not a real reason to avoid this. The reason to
wait is that there is nothing on the other end yet.

Revisit when the account has an audience worth joining — a few hundred followers
is the point where the link starts doing work. Then keep it small and late: one
text link after the calculator has done its job, never a banner above it.

### The inbound funnel is where the loss is

**`/links` exists for exactly this and is not being used.** It is built as the
link-in-bio target — no nav, no footer, one decision — with a `featured` slot
pointing at whatever the current video is about. That slot is presently set to
`/welding/certifications`, correctly matching the live welding test video.

The TikTok bio reads `rigfloorhq.com`, not `rigfloorhq.com/links`. The
purpose-built page is being bypassed for the homepage.

Worth checking at the same time whether that bio line is a **clickable link at
all** rather than plain text. ~750 video views have produced no measurable
social sessions in GA4, and the simplest explanation is that nothing is
clickable. Note the confound: TikTok's in-app browser strips referrers, so any
clicks that do land show up as Direct rather than Social.

Fixing the bio target costs nothing and is worth more than any link pointing
away from the site.

### Facebook: claim the page, work the groups

Facebook is the one major platform where oil and gas has genuinely active
communities — private groups of a few thousand hands each, plus regional job
boards. That is where this audience already is, which is not true of TikTok.

**A Page on its own is close to worthless.** Organic Page reach runs at roughly
1–3% of followers, and a page with no followers reaches nobody. Posting a
diagram to your own page is shouting into a void.

**Groups are where the value is**, with one hard rule: post as a person who
works in the industry, answering a question someone actually asked, with a link
only where it genuinely helps. Drop-and-run link posting gets you removed from
the good groups inside a week. That is a standing time commitment, not something
that can be built once.

Verdict: claim the page as a credibility placeholder — twenty minutes, worth
having the name. Do not build a content strategy on it.

### Where distribution effort actually pays, in order

1. **Diagram outreach.** Possible as of 18 August, when the download and slide
   credit shipped. Email training providers, IWCF and IADC course sites, and
   college drilling programmes offering a diagram for their material. Ten emails
   is an afternoon and each acceptance is a real editorial link. **Highest value
   on this list, because external links are the binding constraint** — see the
   E-E-A-T note above, which is the same problem from a different angle.
2. **LinkedIn.** Where supervisors, toolpushers and HSE managers are. Posts from
   individuals still get organic reach, and it suits BOP or well control
   material far better than short video does.
3. **Reddit** — r/oilandgasworkers and neighbours. Same participation rule as
   Facebook groups. A well-received answer linking a calculator sends traffic
   for years rather than days.
4. **Industry forums and directories.** Smaller and older, and much easier to
   get a genuine listing on than any of the above.
5. **Journalist requests.** Slow, but a trade publication citation is a strong
   link.

### Do not add social icons to the site yet

One account, zero followers. **A footer row of empty profiles reads as
abandoned**, which is worse than no icons at all. Add them when at least one
account has an audience worth showing.

---

## Monetization

Assessed 24 August 2026, against a second opinion that had been researching ad
networks. Two of its conclusions were sound and one was contaminated — it had
confused this site with a food blog mid-conversation and carried "food is
Mediavine's strongest vertical, $20-40 RPM eventually" and "put an email
capture on the recipes" into advice about RigFloorHQ. Neither applies.

### There is no display-ads plan worth making yet

Realistic AdSense page RPM here is **$1.50-$4**, not the $15-40 quoted for
lifestyle sites. Three reasons, all structural:

- The intent is informational. Calculators and a glossary are the opposite of
  purchase intent, and that is what advertisers bid on.
- ~~The geography is wrong for CPM.~~ **Measured, and this was wrong.** See
  "The geography is better than assumed" below.
- Industrial B2B is mid-tier programmatic. Rate cards say $5-15 CPM, the
  publisher receives roughly 68% of it, and most open-exchange inventory
  actually clears at $1-4.

Of those three, the first and third hold. The geography does not.

At the current **~30 sessions/month** any of this is cents. Ads would also slow the
site down, against rankings that are the only thing currently compounding.
Revisit display when sessions are in four figures, not before.

Network thresholds as understood on 24 August 2026 — **verify directly, these
move**: Ezoic raised its minimum from 10,000 to 250,000 users/month in
February 2026 and is out of reach; Raptive dropped to 25,000 pageviews;
Journey by Mediavine is the realistic entry point. `CLAUDE.md` records
Journey's floor as 10,000 sessions and the second opinion says 1,000. **That
discrepancy is unresolved and matters a lot** — 1,000 is reachable this year
and 10,000 is not. Check Mediavine's own page before planning around either.

### The geography is better than assumed

Recorded 24 August 2026 after actually pulling the COUNTRIES dimension, because
the paragraph above originally asserted the opposite from a guess. 90 days to
2026-08-23, top 60 countries covering 97.6% of impressions:

| Group | Impressions | Share | Clicks |
|---|---|---|---|
| Tier-1 (US, CA, UK, EU, AU, NZ, JP, SG) | 8,803 | 55.2% | 32 |
| Gulf + North Africa + Iran | 3,492 | 21.9% | 24 |
| Everywhere else | 3,286 | 20.6% | 30 |

**The US alone is 6,569 impressions, 41.2% of the site.** That is a good geo
mix for CPM, not a bad one, and it removes one of the three reasons display
looked hopeless. It does not rescue display on its own — informational intent
and mid-tier industrial CPMs still apply — but the ceiling is higher than the
$1.50-$4 assumed above, and it should be re-measured rather than guessed at
when there is enough traffic to test.

The uncomfortable detail underneath it: **US CTR is 0.32%, worse than the
0.57% site average.** US impressions are concentrated on underwater welding
and BOP, which rank at 60-68. The best audience is landing on the worst
rankings.

### Three CTR explanations that do not survive measurement

Also from the second opinion, and all three are small enough to ignore:

- **"AI Overviews eat your calculator queries — your six calculators are the
  content most exposed."** All calculator URLs together are **513 impressions,
  3.2% of the site**, and they have the *best* CTR on it after the stop-card
  post — `/calculators/kill-sheet` runs 6.8%. Calculators are not dragging
  anything down; they are the thing that works.
- **"Glossary pages (44 terms) generate high impressions, near-zero clicks,
  dragging the site average down."** `/glossary` is **one URL with 95
  impressions, 0.6% of the site**. There are no per-term URLs. This is not
  happening.
- **"Spanish pages may be picking up LatAm impressions where the SERP is
  crowded."** All 25 Spanish URLs together are **293 impressions, 1.8%**, at a
  **2.73% CTR** — nearly five times the site average, because they rank at
  positions 7-12 where the English pages rank at 60+. The Spanish side is the
  best-performing part of the site per impression. It is just tiny.

What actually determines site CTR is that **four pages are 65.6% of all
impressions**: underwater welding (3,796 at position 68), salary (2,510 at
7.4), stop cards (2,092 at 7.8) and BOP (2,075 at 60.4). Two of those cannot
be clicked because they rank on page seven, and one of the two that do rank
cannot be clicked because Google answers salary in the SERP. That is the whole
explanation.

### The US-only drilldown, and why "work the page-2 list" has no list

The instruction was: filter to United States, sort queries by impressions,
treat anything with 200+ impressions and under 5 clicks as a page-2 page, and
work that list before writing anything new.

Run it and **the list is empty**. Zero US queries have 200+ impressions. The
largest named US query is `blowout preventer` at **143 impressions, position
69.8**. US named-query distribution, same 90 days:

| Position | Impressions | Share of US named | Clicks |
|---|---|---|---|
| 1-3 | 115 | 3.6% | 0 |
| 4-10 | 256 | 8.0% | 3 |
| **11-25** | **55** | **1.7%** | **0** |
| 26-50 | 544 | 16.9% | 0 |
| 51+ | 2,225 | 69.2% | 0 |

Worse than the site-wide picture, not better. And one number to keep in mind
whenever US CTR is quoted: **US named-query CTR is 0.09%, not 0.32%.** The
0.32% is carried almost entirely by the anonymised `(unknown)` bucket — 2,254
impressions and 12 of the 21 US clicks, at position 13.8. GSC hides those
queries, so they cannot be worked as a list either.

"Ignore monetization until US CTR is above 2%" is the right instinct. Just
note that no title or snippet edit gets there from position 67.

### BOP: the diagnosis is right, the prescription is wrong

**Right:** BOP is genuinely the topic the US market associates with this site.
US BOP queries total **1,218 impressions, 37.9% of all US named impressions,
across 25 queries — at a weighted average position of 66.7, with zero clicks.**
By comparison the welding cluster is 193 US impressions. Site-wide the ordering
flips (underwater welding 3,796 vs BOP 2,075), because the welding demand is
Gulf-based, but within the US, BOP is the franchise.

**Wrong:** the prescription was to consolidate — "you almost certainly have
this content spread across equipment pages, the glossary, and maybe a blog
post, all competing with each other", absorb them into one canonical page and
301 the old URLs. Checked against the repo and against GSC page data:

- `/equipment/bop` is **2,701 words** and is the *only* URL receiving BOP
  impressions. Nothing is competing with it.
- **There is no BOP glossary entry.** `grep` on `src/pages/glossary/index.astro`
  returns nothing for `blowout`. `/glossary` is one 1,177-word page at 95
  impressions.
- The next-highest BOP mention count is `blog/well-control-basics`, which ranks
  for well-control queries, not BOP ones.

There is no cannibalisation to fix, and the consolidation was already done —
that page was expanded earlier in August. Following this advice would mean
301-ing live URLs to solve a problem that does not exist. See `CLAUDE.md` on
redirects before ever doing that.

What is actually true is the uncomfortable version: a good, long, correctly
targeted page with real US demand behind it is sitting at position 67. That is
the authority constraint stated a third way, and it is the same answer as
`/welding/underwater-welding`.

### The UAE anomaly is not an anomaly

Flagged as "890 impressions, 3 clicks — something is ranking around position
20-30 for a high-volume query, find it, that's one page carrying 6% of your
impressions." Pulled it: UAE is **941 impressions, 3 clicks, average position
56.9**, and it is not one page at 20-30. It is the underwater welding cluster —
nine queries (`hyperbaric underwater welding`, `dry hyperbaric welding`,
`hyperbaric welding`, `wet welding` and variants) totalling **657 impressions
at positions 61-83, all zero clicks**. Same page, same problem, different
country. Nothing to find.

### The money in this niche is affiliate and direct, not display

Joinable now, no traffic minimum:

- **WorkingPerson.com** — 10%, 90-day cookie, via ShareASale / CJ / AvantLink.
  FR clothing, boots, gloves. Fits the PPE guide directly.
- **Petrolessons** — 10% per sale, free to join, global, PayPal monthly after a
  30-day refund window.
- **Oilandgasclub** — application-based. API, ASNT, CSWIP, HTRI courses, and it
  pays on subscription renewals.
- **Helly Hansen Workwear US** — industrial workwear, standard networks.
- **Amazon Associates** — fallback only. Business and industrial products pay
  2.5%, capped at $225 per item.

Join **ShareASale, CJ, AvantLink, Impact and FlexOffers as accounts** rather
than chasing merchants one at a time; most industrial merchants sit inside
those.

**No public programme — email them directly. This is where the money is.**
Well Control School, Wild Well Control, LearnToDrill, PetroSkills and PETEX run
no affiliate programme at all. Ticket size makes the email worth writing: Well
Control School lists courses at **$1,125**, so a negotiated 10% referral is
**$112 a head**. LearnToDrill is Houston-based, runs gamified web simulations
with IADC and IWCF accreditation, and is new enough to actually need
distribution — the warmest first pitch.

Sponsored-post rate, for when there is traffic to sell: (monthly pageviews ÷
1,000) × CPM at $20-50 for sponsored content. B2B technical blogs command 2-5x
lifestyle rates at equivalent traffic.

### The email list is the asset, and it is buildable at any traffic level

B2B professional niches under 2,500 subscribers charge $100-400 per newsletter
placement; B2B direct sponsorship runs $100-150 CPM against $25-40
programmatic. That is a 30-60x multiple on the $1.50-$4 display RPM above, and
unlike display it does not require scale first.

Concretely: a **"drilling formulas cheat sheet" PDF** offered on the calculator
pages. Those pages already convert far above site average on intents that
require opening the page (`stop cards in oil field` 10.3%,
`/calculators/kill-sheet` 6.3%, against 0.57% site-wide), which is exactly the
audience worth capturing.

**Do not ship an email capture without deciding the consent story first.**
`GA_ID` in `src/lib/site.js` currently governs whether this site claims to set
cookies at all, and the privacy and cookie pages are wired to it in both
languages. A signup form is personal data processing under UK GDPR regardless
of cookies, and the policy pages have to say so before the form goes live.

### What the CTR advice gets wrong here

The second opinion read 0.6% CTR on 14.9K impressions as page-2-to-4 rankings
that titles could fix — "pages sitting at #12 need a nudge, not a rewrite" —
and projected a 4-5x click increase with no new traffic.

Measured, 90 days to 2026-08-23, 8,679 named-query impressions:

| Position band | Impressions | Share | Clicks |
|---|---|---|---|
| 1-3 | 185 | 2.1% | 3 |
| 4-10 | 835 | 9.6% | 14 |
| 11-25 | 194 | 2.2% | 0 |
| 26-50 | 838 | 9.7% | 0 |
| 51+ | 6,511 | 75.0% | 1 |

**Positions 11-25 hold 2.2% of impressions and earned zero clicks.** There is
almost no page-2 inventory to nudge. Three quarters of impressions sit at
position 51 or worse — the underwater welding cluster at 62-80, BOP at 54-75,
rig types at 78-96 — and no title rewrite moves position 70. Meanwhile the
queries that already rank 1-10 are the salary cluster Google answers in the
SERP, which is documented in `CLAUDE.md` and cannot be fixed at all.

Site CTR is low because the site ranks badly, not because it is badly
presented. The constraint is still authority.


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
