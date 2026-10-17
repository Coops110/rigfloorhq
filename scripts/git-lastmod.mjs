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
 */

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
    // %x00 writes a NUL byte, which cannot occur in a path, so it reliably
    // marks the date lines apart from the --name-only file lines.
    log = git('git log --pretty=format:%x00%cI --name-only --no-renames');
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

  const map = new Map();
  let date = null;
  for (const line of log.split('\n')) {
    if (line.charCodeAt(0) === 0) {
      date = line.slice(1).trim();
      continue;
    }
    const file = line.trim();
    if (!file || !date) continue;
    const entry = map.get(file);
    // Newest commit first: the first sighting is the last modification, and
    // every later sighting is older, so it keeps overwriting `published`.
    if (!entry) map.set(file, { modified: date, published: shallow ? null : date });
    else if (!shallow) entry.published = date;
  }
  cachedDates = map;
  return map;
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
