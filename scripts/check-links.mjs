/**
 * Internal link checker, run against dist/ after a build.
 *
 * CLAUDE.md has required this before every commit since a page shipped with
 * links pointing at a slug that was never built. Until now it had no
 * implementation, so each session improvised one — which meant the rule was
 * only as good as whatever ad-hoc grep got written that day.
 *
 * Checks the built HTML, not the source. Astro rewrites nothing about href
 * values, but a link's target is a *file*, and only the build knows which
 * files exist. Checking src/ would confirm the string and miss the 404.
 *
 * Exits non-zero if anything is broken, so it can gate a commit.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, posix, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Anchored to the repo root rather than the cwd, so running this from anywhere
// checks the real dist/ instead of reporting a missing build.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const VERCEL = join(ROOT, 'vercel.json');
const SITE = 'https://rigfloorhq.com';

/** Schemes that are never a file in dist/, plus bare fragments. */
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/**
 * Paths that vercel.json redirects. A redirect only fires when no real file
 * matches, so its source deliberately has no file in dist/ — treating that as
 * a broken link would report the one rule the site relies on as a defect.
 */
function redirectSources() {
  if (!existsSync(VERCEL)) return new Set();
  const { redirects = [] } = JSON.parse(readFileSync(VERCEL, 'utf8'));
  return new Set(redirects.map((r) => r.source.replace(/\/$/, '')));
}

/**
 * Every href/src in a document, plus the absolute same-origin URLs that live
 * in metadata — canonical, og:url and hreflang all point at pages that have to
 * exist, and a canonical aimed at a 404 is worse than a broken body link.
 */
function extractLinks(html) {
  const links = [];
  for (const m of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']*)["']/gi)) {
    links.push(m[1].trim());
  }
  // og:url is the one URL that lives in a content attribute. Matching content
  // generally would sweep in every meta description on the page.
  for (const m of html.matchAll(/<meta[^>]*\bproperty\s*=\s*["']og:url["'][^>]*>/gi)) {
    const value = m[0].match(/\bcontent\s*=\s*["']([^"']*)["']/i);
    if (value) links.push(value[1].trim());
  }
  return links;
}

/**
 * Resolve a link to a file in dist/, or return null if nothing matches.
 *
 * The site is trailingSlash: 'never' with format: 'directory', so /welding is
 * served by dist/welding/index.html. Assets resolve to themselves.
 */
function resolveTarget(link, fromFile) {
  let url = link;
  if (url.startsWith(SITE)) url = url.slice(SITE.length) || '/';
  else if (EXTERNAL.test(url)) return 'skip';

  // Query and fragment are not part of the file lookup. Fragments themselves
  // are deliberately not validated: accordion toggles and JS-built targets
  // produce ids that are not in the static HTML.
  url = url.split('#')[0].split('?')[0];
  if (url === '') return 'skip';

  let pathname;
  if (url.startsWith('/')) {
    pathname = url;
  } else {
    // Relative to the directory of the page containing it.
    const dir = posix.dirname('/' + relative(DIST, fromFile).split(/[\\/]/).join('/'));
    pathname = posix.resolve(dir, url);
  }

  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    decoded = pathname;
  }
  const clean = decoded.replace(/\/+$/, '') || '/';

  const candidates = [
    join(DIST, clean),
    join(DIST, clean + '.html'),
    join(DIST, clean, 'index.html'),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

if (!existsSync(DIST)) {
  console.error('[check-links] no dist/ — run `npm run build` first, or there is nothing to check against.');
  process.exit(1);
}

const redirects = redirectSources();
const pages = walk(DIST).filter((f) => f.endsWith('.html'));
const broken = [];
let checked = 0;

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const link of extractLinks(html)) {
    const resolved = resolveTarget(link, page);
    if (resolved === 'skip') continue;
    checked++;
    if (resolved) continue;
    if (redirects.has(link.replace(SITE, '').replace(/\/$/, ''))) continue;
    broken.push({ page: relative(DIST, page), link });
  }
}

console.log(`[check-links] ${checked} internal links across ${pages.length} pages`);

if (broken.length === 0) {
  console.log('[check-links] 0 broken');
  process.exit(0);
}

// Group by target: one missing page usually breaks the same link on many
// pages, and a list of 40 identical lines hides how many distinct faults
// there actually are.
const byTarget = new Map();
for (const { page, link } of broken) {
  if (!byTarget.has(link)) byTarget.set(link, []);
  byTarget.get(link).push(page);
}

console.error(`[check-links] ${broken.length} broken across ${byTarget.size} distinct target(s):\n`);
for (const [link, sources] of [...byTarget].sort((a, b) => b[1].length - a[1].length)) {
  console.error(`  ${link}`);
  console.error(`    linked from ${sources.length} page(s): ${sources.slice(0, 5).join(', ')}${sources.length > 5 ? ', …' : ''}`);
}
process.exit(1);
