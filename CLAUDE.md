# Working on RigFloorHQ

Rules learned the hard way on this project. Each one exists because ignoring
it broke something real. Content strategy lives in `CONTENT-PLAN.md`; this
file is the engineering half.

## Deploying

`git push origin main` deploys to rigfloorhq.com via Vercel. There is no
manual step.

**Deploys propagate unevenly across the edge.** Checking immediately after a
push routinely returns 404s and stale HTML for some paths while others are
already live — one language version updated and not the other, one SVG served
and its sibling missing. This is normal. Check once, wait, check again. Do not
conclude a deploy failed, and do not start "fixing" it, until a second check
disagrees with the first.

Do not poll in a loop. The sister site tripped Vercel's bot mitigation that
way and got scripted requests 403'd for hours.

## Git on OneDrive

Both this repo and airprohq live under OneDrive. Git's atomic appends can
collide with OneDrive's sync and fail mid-commit:

```
invalid write operation detected
fatal: cannot update the ref 'HEAD': unable to append to '.git/logs/HEAD'
```

The commit does **not** land when this happens, though staged changes survive.
The fix, which git prints itself, is already applied to both repos:

```
git config windows.appendAtomically false
```

If a new clone appears, set it again.

## PowerShell will corrupt your files

Three traps, all of which cost real time here.

**Never round-trip a UTF-8 file through `Get-Content` / `Set-Content`.**
PowerShell 5.1 reads BOM-less UTF-8 as ANSI, so `tipografías` comes back as
`tipografÃ­as`, and writing it out re-encodes the mojibake. This silently
corrupted every accented character in `src/lib/site.js`. Use the Edit tool, or
`[IO.File]::ReadAllText($p,[Text.Encoding]::UTF8)` and
`WriteAllText` with `New-Object System.Text.UTF8Encoding($false)`.

**Never pass a commit message containing double quotes as a `-m` argument.**
PowerShell mangles native-command arguments and git receives the fragments as
pathspecs. Write the message to a file and use `git commit -F`.

**Write that file without a BOM.** `Set-Content -Encoding UTF8` adds one, and
it ends up as an invisible character at the start of the commit subject. One
commit in this history has it.

## Astro structure

Only `src/` is routed. Root-level `pages/`, `components/` and `layouts/` were
a pre-`src/` duplicate that had been sitting in the repo for a month doing
nothing — 29 files that were never in a build.

Root-level markdown is **not** published. That is why `CONTENT-PLAN.md` and
this file can live here safely.

HTML comments ship to the browser. `{/* Astro comments */}` do not. A block of
developer notes about the analytics setup was going out on all 76 pages before
it was moved.

## hreflang

`BaseLayout`'s `alternateHref` generates the hreflang tags. `Nav`'s
`alternateHref` only sets the language-switcher link. **These are not the same
thing.** A page with no translation should still send the switcher somewhere
sensible while declaring no hreflang at all.

**Never declare an alternate that does not reciprocate.** Search engines
ignore non-reciprocal hreflang, so the tag achieves nothing while actively
asserting something false — the stuck pipe pillar claimed a Spanish page that
pointed back at a different English page, telling Google two competing English
pages were translations of each other.

Emit no hreflang rather than a lone `x-default`. On its own it says "use this
when no listed language matches" while listing no languages.

When auditing this, note that an EN page and its ES twin **both** declaring
both alternates is correct, not a conflict. A naive check flags all 74 pages
as broken. Compare reciprocity, not counts.

## Publishing

**Ship a new page and its inbound links in the same commit.** Two editorial
links minimum, in body content, from pages that are genuinely related.

To be exact about the ordering, because it matters: the new page and the links
pointing at it go into **one build and one deploy**. There is never a moment
where a link is live and its target is not. Adding links to a page that has not
been created yet would produce 404s, and is not what this rule says.

The failure this prevents is the opposite one — a page going live with nothing
pointing at it. Every blog post on this site once had exactly one inbound link,
the blog index, so four posts of 2,200+ words were earning nothing at all.

Before committing, verify every internal link resolves against `dist/`. Run
`npm run build` first or there is nothing to check against. The site currently
has 3,889 internal links and zero broken.

Check `CONTENT-PLAN.md`'s "already covered" table first. Four pages were
competing on well control and two on welding certifications, all written
without anyone checking what existed.

Decide the Spanish version at publish time. Deferring it is what produced the
hreflang mess.

## Metadata

**`og:image` must be a raster.** Setting a post's image to an SVG produced a
valid-looking `og:image` that social scrapers refuse to render — a blank
preview, worse than the generic fallback it replaced. Both blog routes now
fall back to the PNG unless the declared image is `.png`, `.jpg` or `.webp`.

Check that declared assets exist. `og-default.png`, `favicon.ico` and
`apple-touch-icon.png` were referenced on every page and none of them existed,
so every share anywhere rendered with no image.

**FAQ structured data must match visible body content.** The `faq` frontmatter
is duplicated in the post body deliberately. Marking up questions that are not
on the page is a structured data violation, not a shortcut.

Do not put UTM parameters on internal links. They belong on the inbound URL
only — a UTM on an internal link starts a new GA4 session and destroys the
attribution it was added to collect.

## Heading order

All 86 pages currently pass a document-wide heading check: exactly one `h1`, no
skipped levels. It was 51 pages failing. Keep it there — the check is at the
bottom of this section.

**Heading level is document structure, not a size picker.** Every `h4` on this
site (65 of them, in 12 files) was really a level-3 item that had been chosen
for its styling. They are all `h3` now, with the CSS selectors renamed to
match — `.career-step h3`, `.safety-item h3`, `.acc-header h3`. If you want
smaller text, style the `h3`; do not drop a level.

**The footer's column headings are `h2`, and that is deliberate.** They were
`h4`, which skipped from every page's `h2` — the single failure in a
Lighthouse Accessibility 98. Demoting them to `h3` fixed 32 pages and broke
`/glossary`, whose own content has no `h2` at all, so the footer's `h3` then
skipped straight from the page `h1`. `h2` is the only level that is safe after
*any* page content, because a heading check flags jumps down the tree, never
steps back up. Do not "tidy" them to `h3`.

**Index pages need a heading for their first card grid.** The pattern is a
`page-hero` `h1` followed immediately by a `card-grid` of `h3` cards, with no
section title — an `h1` -> `h3` skip. Those sections now carry
`<h2 class="sr-only">`. The `.sr-only` utility is in `global.css`; read the
comment above it before using it, especially the part about never swapping it
for `display:none`.

`/links` had no `h1` at all — its logo is an `<img>`, and an image is not a
heading.

Verifying this needs a real browser, not grep. A visually-hidden heading that
has fallen out of the accessibility tree is worse than the skip it replaced,
and markup alone cannot tell you which you have. Playwright's
`locator.ariaSnapshot()` prints the actual tree with levels
(`page.accessibility` was removed from Playwright and no longer exists).
Check the heading is present in that tree, that its box is ~1x1, and that it
adds no horizontal overflow.

## Colour

`--rust` `#c94a1f` is **not a text colour**. It measures 4.09 on `--ink` and
3.42 on `--steel`, below the 4.5 AA threshold, and it was being used on 9 and
10px labels. Use `--ember` `#f07038` for text and keep `--rust` for borders,
fills, hovers and the wordmark.

Measure any new text colour before using it. The audience reads on phones,
often outdoors, and small low-contrast type fails there first. There is a
contrast note in `global.css` with the numbers.

## Fonts

The three families are **self-hosted** in `public/fonts/`, declared by
`src/styles/fonts.css`, and regenerated by `scripts/fetch-fonts.py`. They are
the identical woff2 files Google serves, so rendering did not change when they
moved.

They were moved off `fonts.googleapis.com` because that stylesheet was the
site's only render-blocking third-party request, and it sat in front of an LCP
that is **text** — the hero `h1`, in Barlow Condensed 900. The chain was HTML →
CSS on one Google origin → six woff2 files on a second Google origin. Lighthouse
put the render-blocking cost at 2,420 ms of the 4.1 s LCP.

Consequences worth knowing:

`fonts.css` is `@import`ed next to `global.css` in `BaseLayout`, so it bundles
into the same stylesheet and costs **no extra request**. Do not add it as its
own `<link>`; that would reintroduce exactly the blocking request this removed.

Only `latin` and `latin-ext` are kept. Spanish is fully covered by `latin` —
verified in a browser, `ñ` renders as a real glyph, and `latin-ext` is never
actually fetched by either language. Google's cyrillic, greek and vietnamese
subsets were dead weight.

Only two faces are preloaded: Barlow Condensed 900 (the LCP element) and Inter
400 (body). Preloading more makes them compete for bandwidth on the slow
connections the audit models. Adding preloads is not free.

**Font filenames are not content-hashed, and `vercel.json` serves `/fonts/`
`immutable` for a year.** If a regenerated file ever differs, rename it, or
caches will serve the old one indefinitely.

## Response headers

`vercel.json` sets them. There was no `vercel.json` at all until the headers
were added, so anything it does now is deliberate.

The CSP is `object-src 'none'; base-uri 'none'; frame-ancestors 'self'` and
deliberately has **no `script-src`**. The consent and GA Consent Mode blocks are
inline by necessity — the `consent default` command has to reach `dataLayer`
before `gtag.js` loads — so any `script-src` without matching hashes or a nonce
would break the cookie banner and silently take consent handling with it. Add
one only with hashes, and only after testing the banner in a real browser.

Do not treat Lighthouse's Trust and Safety section as a scoreboard. Those items
are **unscored**: the site reported Best Practices 100 while sending none of
these headers. They are worth setting, but they buy security, not points.

## Analytics

`GA_ID` in `src/lib/site.js` is a single switch. Empty means no gtag, no
consent banner, no cookie-settings link, **and** the privacy and cookie pages
render their no-cookies wording in both languages. That coupling is
deliberate: it makes it impossible to ship a policy claiming the site sets no
cookies while it is setting them.

Never add analytics by pasting Google's snippet. It calls `gtag('config')`
immediately and would set cookies before the visitor is asked, which is what
UK PECR and EU ePrivacy actually prohibit.

## Search performance

The goal is 50,000 sessions/month, which is Mediavine's threshold. Worth
knowing before planning around it: **Journey by Mediavine takes sites at
10,000 sessions/month** — same company, same ad stack, a quarter of the
distance. Verify current thresholds directly, ad networks move them.

Data lives in two places, both connected through Supermetrics: GA4 property
`548204808`, and Search Console `sc-domain:rigfloorhq.com`. GSC is the more
honest number for organic, because GA is consent-gated and GSC is not.

### Sitemap lastmod comes from git, and must stay that way

`scripts/git-lastmod.mjs` reads one `git log` pass and gives each URL the date
of the last commit touching **its own source file**. `astro.config.mjs` feeds
that to the sitemap's `serialize`.

**Do not replace this with file mtime.** Vercel clones the repo fresh for every
deploy, so every file carries the same checkout mtime and all 83 URLs would
claim they changed on every build. Google discounts sitemaps that do that,
which is worse than sending no lastmod at all — and the sitemap shipped with
none until 2026-08-18, so there is nothing to fall back to.

Editing `BaseLayout`, `Nav`, `Footer` or `global.css` deliberately bumps
**nothing**. A font swap or a heading-level fix is not a content change.
Verified: the self-hosted-fonts commit touched all four of those and moved zero
dates, while the heading-order commit moved exactly the pages whose own files
it edited.

A URL whose source cannot be resolved gets **no** lastmod rather than a guessed
one. Blog posts resolve to `src/content/blog{,-es}/<slug>.md`, not to
`[slug].astro`, so fixing one post does not restamp all twelve.

Every build prints `N/M sitemap URLs have lastmod` and warns if any are
missing. It was 83/83 when this was added. If that number drops, a route was
added whose source path the candidate list does not cover — extend
`sourceCandidates`, do not paper over it with a default date.

### The lesson that cost the most to learn

**Ranking first is not the same as getting clicks.** `/careers/salary` ranks
**position 1** for roughly seventeen "how much do X make" queries — *how much
do offshore oil rig workers make*, *offshore oil worker salary*, *how much
does a roughneck make on an oil rig* — and earns **zero clicks from any of
them**. Google answers salary questions in the SERP with an AI Overview or a
pay widget, so the searcher never needs the page.

You cannot rank higher than first. No title, no schema and no content change
recovers those. Before optimising any page, ask whether the query is one
Google can answer without a click; if it is, better rankings buy nothing.

The corollary is where the site actually earns: intents that **require**
opening the page. `stop cards in oil field` converts at **10.3%** and
`/calculators/kill-sheet` at **6.3%**, against a site average of 0.57%.
Examples, templates, calculators, procedures and comparisons are the shape
that works here. Prefer them over "what is X" and "how much does X pay".

### Titles are length-budgeted

`BaseLayout` appends `" | RigFloorHQ"` — 13 characters — unless the title
already contains "RigFloorHQ". Google truncates around 60. **Keep titles to
about 45 characters.** Three of the site's best-ranked pages were shipping
titles that rendered at 71, 80 and 85 and were cut mid-phrase, so the
targeting they were carefully written for never displayed. Meta descriptions
truncate near 155; one was 191.

When a page targets a multi-word phrase, keep the phrase **whole**. "Hyperbaric
Welding and Wet Welding" beats interleaving them into "Hyperbaric & Wet
Welding" — the queries are searched as complete phrases.

### Internal anchor text is a signal you control

The highest-demand page on the site had the **fewest** inbound internal links,
and every one used a generic anchor: "full guide", "Read More", "underwater
welding page". Nothing pointing at it said what it was about. When a page
matters, link it from genuinely related body copy using the words it should
rank for. Counting inbound links per page is a one-line grep and worth doing
before assuming a ranking problem is about authority.

### Baseline, 30 days to 2026-08-17

Compare against this rather than re-deriving it. Site total: **10,091
impressions, 58 clicks, 0.57% CTR**; GA showed ~350 sessions/month, from
tracking that only starts 3 Aug 2026.

| Page | Impr. | Clicks | Position |
|---|---|---|---|
| `/welding/underwater-welding` | 2,214 | 1 | ~66 |
| `/careers/salary` | 1,869 | 11 | 6.6 |
| `/blog/stop-card-system` | 1,362 | 26 | 6.6 |
| `/equipment/bop` | 1,328 | 2 | 60.6 |

### If underwater welding has not improved

It was retargeted on 2026-08-17 — title, `h1` and three inbound anchors — from
a baseline of position ~66 across `hyperbaric welding` (353 impressions), `dry
hyperbaric welding` (344), `hyperbaric underwater welding` (323), `wet welding`
(294) and `underwater wet welding` (192). Expect position to move before
clicks do; 65 → 20s would be a good result. Give it three to four weeks.

**If position has not moved by then, on-page work is not the constraint and
repeating it is waste.** The page content is already strong — 200+ lines
covering both methods, the four chamber arrangements, AWS D3.6M classes and
depth limits. Two things are worth trying instead, in order:

Split it. `hyperbaric welding` (~1,020 impressions across its variants) and
`wet welding` (~486) are separate intents that one URL is splitting its
targeting between. Two focused pages, each linked from the other, is the
standard fix. It was not done first because it carries cannibalisation risk
and is a content decision, not a technical one.

Then accept it is an authority problem. Position 65 on competitive terms
usually reflects the domain, not the page, and no amount of on-page work
substitutes for external links. At that point the honest answer is that this
page needs citations from outside the site, and effort is better spent on the
click-worthy intents above.

**Do not "fix" `/careers/salary` again.** It is the best-ranked page on the
site and structurally cannot earn clicks on its main cluster. Its jobs-intent
queries — `offshore oil rig jobs` (70 impressions, position 5.4) and
neighbours — are the part worth building for, and they want their own page,
not edits to the pay table.

## Verify, don't assert

Most errors here came from stating something without checking it.

A build piped to `Out-Null` failed silently and the "verification" that
followed was reported as passing when it had never run. If output is
suppressed, the check is worthless.

Static checks are not enough for anything interactive. The consent banner
looked perfect in the markup and was invisible in a real browser, because the
reveal ran inside `requestAnimationFrame`, which is paused in background tabs
— while focus had already been moved into it. `curl` would never have found
that.

Run the check, then say the number.
