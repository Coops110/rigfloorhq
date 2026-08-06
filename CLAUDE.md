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

**Link a new page in before it goes live, not after.** Two inbound editorial
links minimum, in body content, from pages that are genuinely related. Every
blog post on this site once had exactly one inbound link — the blog index —
so four posts of 2,200+ words were earning nothing at all.

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

## Colour

`--rust` `#c94a1f` is **not a text colour**. It measures 4.09 on `--ink` and
3.42 on `--steel`, below the 4.5 AA threshold, and it was being used on 9 and
10px labels. Use `--ember` `#f07038` for text and keep `--rust` for borders,
fills, hovers and the wordmark.

Measure any new text colour before using it. The audience reads on phones,
often outdoors, and small low-contrast type fails there first. There is a
contrast note in `global.css` with the numbers.

## Analytics

`GA_ID` in `src/lib/site.js` is a single switch. Empty means no gtag, no
consent banner, no cookie-settings link, **and** the privacy and cookie pages
render their no-cookies wording in both languages. That coupling is
deliberate: it makes it impossible to ship a policy claiming the site sets no
cookies while it is setting them.

Never add analytics by pasting Google's snippet. It calls `gtag('config')`
immediately and would set cookies before the visitor is asked, which is what
UK PECR and EU ePrivacy actually prohibit.

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
