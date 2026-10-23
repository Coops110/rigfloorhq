/**
 * Sitemap <lastmod> dates derived from git history.
 *
 * The obvious implementation — file mtime — is wrong here. Vercel clones the
 * repo fresh for every deploy, so every file gets the same mtime at checkout
 * time, and every page would claim it changed on every build. Google discounts
 * sitemaps that behave that way, which leaves the site worse off than sending
 * no lastmod at all. The last commit that touched a file is the only honest
 * answer available at build time.
 *
 * Deliberately scoped to a page's OWN source file. Editing BaseLayout, Nav,
 * Footer or global.css does not touch any page's lastmod, which is the point:
 * a font swap or a heading-level fix is not a content change, and stamping all
 * 83 URLs as modified would recreate exactly the problem this avoids.
 *
 * Within-file scoping (added 2026-10-21): "this file was in the commit" is
 * still too coarse on its own. A sitewide pass (e.g. "build 8 new pages")
 * genuinely rewrites some files and, as a real side effect, makes a 2-line
 * incidental touch to a handful of unrelated ones (an added anchor ID, a
 * stray-reference cleanup). Both get the same commit timestamp under plain
 * --name-only, which is exactly the "57 URLs including untouched pages share
 * one deploy-shaped date" pattern a 2026-10-20 audit flagged as looking like
 * fake-freshness stamping. --numstat gives the real insertions+deletions for
 * that file in that specific commit, so a per-file size threshold
 * (SIGNIFICANT_CHANGE_LINES) separates "this page actually changed" from
 * "this file was incidentally in a commit about something else" at the
 * correct granularity — per file, not per commit. A file with no edit ever
 * reaching the threshold still gets the newest commit's date rather than
 * none at all; cumulative small edits are still real history, just not
 * individually a reason to claim "updated today."
 */

// INSERTIONS (not insertions+deletions) a single commit must make to one
// file before that commit counts as a real content update to that file for
// dateModified/lastmod purposes. Insertions-only, not total churn, because a
// sitewide dead-schema-removal pass is almost pure deletion (one real
// instance: 116 files, 7 insertions, 1261 deletions sitewide) -- removing old
// cruft is not "this page has fresh content," and a line-count-of-churn
// threshold alone would wrongly call a 30-line deletion significant. New
// prose, a new card, a new cited-sources block, or a rewritten paragraph are
// all insertion-heavy; a stray-reference fix, an anchor ID, a schema
// property or an href repoint are 1-4 insertions. Deliberately not applied
// to datePublished below -- a file's first commit is definitionally its real
// creation and is never the thing being filtered out here.
const SIGNIFICANT_INSERTIONS = 6;

import { execSync } from 'node:child_process';

function git(command) {
  return execSync(command, {
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  });
}

/**
 * One pass over history, newest commit first, recording the first (therefore
 * most recent) commit date seen for each path. One subprocess rather than 83.
 *
 * Returns null if git is unavailable or the history cannot be read, which the
 * caller treats as "emit no lastmod" rather than guessing.
 */
export function buildGitLastmodMap() {
  const dates = buildGitDatesMap();
  if (!dates) return null;
  const map = new Map();
  for (const [file, { modified }] of dates) map.set(file, modified);
  return map;
}

/**
 * The same single `git log` pass, keeping both ends of each file's history:
 * `modified` is the newest commit touching the path (exactly what the sitemap
 * uses as <lastmod>), `published` the oldest. Schema datePublished and
 * dateModified are built from this (src/lib/techarticle.js), so the on-page
 * dateModified always equals the sitemap lastmod for the same source file.
 *
 * `published` is null in a shallow clone: the oldest commit *visible* there is
 * only the fetch-depth cut-off, not the file's first commit, so reporting it
 * would claim a page is newer than it is. --no-renames means a renamed file's
 * history starts at the rename, which can only make datePublished later than
 * the truth, never earlier.
 *
 * Cached per process: astro.config.mjs and every page importing
 * techarticle.js share one subprocess.
 */
let cachedDates;
export function buildGitDatesMap() {
  if (cachedDates !== undefined) return cachedDates;
  let log;
  try {
    // %x00 writes a NUL byte, which cannot occur in a path, marking each
    // commit's date line apart from its --numstat file lines. --numstat
    // (instead of --name-only) adds per-file insertions/deletions counts,
    // needed for the significance threshold below.
    log = git('git log --numstat --pretty=format:%x00%cI --no-renames');
  } catch {
    console.warn('[sitemap] git history unavailable — building without lastmod');
    cachedDates = null;
    return null;
  }

  let shallow = false;
  try {
    shallow = git('git rev-parse --is-shallow-repository').trim() === 'true';
  } catch { /* older git without the flag; not worth failing over */ }
  if (shallow) {
    // A shallow clone still yields correct dates for whatever it contains;
    // files whose last edit predates the cut-off simply get no lastmod, which
    // is the safe direction to be wrong in.
    console.warn('[sitemap] shallow clone — pages older than the fetch depth will have no lastmod, and schema datePublished is omitted');
  }

  // newestAny / oldestAny: unfiltered, same semantics as the old modified/
  // published. newestSignificant: newest commit where this file's own
  // numstat line met SIGNIFICANT_CHANGE_LINES, tracked separately so a run
  // of small incidental touches can't suppress an earlier real update.
  const map = new Map();
  let date = null;
  for (const line of log.split('\n')) {
    if (line.charCodeAt(0) === 0) {
      date = line.slice(1).trim();
      continue;
    }
    if (!line.trim() || !date) continue;
    // Numstat line: "insertions\tdeletions\tpath". Binary files report "-"
    // for both counts -- treated as always significant, since there's no
    // line count to threshold against and a binary asset swap is a real
    // change to the file regardless.
    const m = line.match(/^(\d+|-)\t(\d+|-)\t(.+)$/);
    if (!m) continue;
    const [, insRaw, delRaw, file] = m;
    const significant = insRaw === '-' || delRaw === '-'
      ? true
      : Number(insRaw) >= SIGNIFICANT_INSERTIONS;

    let entry = map.get(file);
    if (!entry) {
      entry = { newestAny: date, oldestAny: shallow ? null : date, newestSignificant: significant ? date : null };
      map.set(file, entry);
    } else {
      if (!shallow) entry.oldestAny = date;
      if (significant && !entry.newestSignificant) entry.newestSignificant = date;
    }
  }

  const out = new Map();
  for (const [file, entry] of map) {
    // The creation commit always reads as "significant" by insertion count
    // (it adds the whole file), but it is the file's datePublished, never a
    // modification. Without this guard, a file whose every post-publish edit
    // stayed under the threshold would have newestSignificant silently fall
    // all the way back to the creation commit, wrongly reporting
    // modified === published even when newestAny shows a real later commit.
    const newestSignificant = entry.newestSignificant !== entry.oldestAny ? entry.newestSignificant : null;
    out.set(file, {
      modified: newestSignificant || entry.newestAny,
      published: entry.oldestAny,
    });
  }
  cachedDates = out;
  return out;
}

/**
 * Source files that could back a given URL path, best match first.
 *
 * Blog posts are checked before the routes that render them: the content lives
 * in src/content, and [slug].astro is chrome shared by every post. A typo fix
 * in one post should not move the lastmod of all twelve.
 */
export function sourceCandidates(pathname) {
  const p = pathname.replace(/^\/+|\/+$/g, '');
  if (p === '') return ['src/pages/index.astro'];

  const candidates = [];
  const en = p.match(/^blog\/(.+)$/);
  const es = p.match(/^es\/blog\/(.+)$/);
  if (en) candidates.push(`src/content/blog/${en[1]}.md`);
  if (es) candidates.push(`src/content/blog-es/${es[1]}.md`);
  candidates.push(`src/pages/${p}.astro`, `src/pages/${p}/index.astro`);
  return candidates;
}
