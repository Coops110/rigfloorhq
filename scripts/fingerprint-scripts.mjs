/**
 * Content-hash fingerprinting for the hand-written scripts in public/scripts/.
 *
 * Why: those files are served from a stable URL (/scripts/nav.js), so they
 * could only ever be cached with max-age=0 + revalidation — every repeat
 * visit paid a round trip per script to learn nothing had changed. They
 * cannot simply be moved into Astro's bundler: they are classic scripts that
 * rely on globals and on `is:inline` staying out of the module graph, and
 * the CSP/inline-script guard (check-no-inline-scripts.mjs) is built around
 * them being plain external files.
 *
 * What: after the build, rewrite every `src="/scripts/<file>.js"` in dist/
 * HTML to `src="/scripts/<file>.js?v=<10 hex of sha256(file)>"`. vercel.json
 * serves /scripts/* as `immutable` for a year ONLY when that `v` query is
 * present (a `has` condition), so:
 *   - a changed file gets a new hash, so a new URL, so no stale cache;
 *   - a bare /scripts/x.js request (an old cached HTML page, a hand-typed
 *     URL, anything that bypasses this rewrite) still gets the short default
 *     policy, so nothing can be pinned in a browser forever by accident.
 *
 * Runs on the HTML in dist/ rather than on page sources deliberately: editing
 * 68 page files to wrap their script tags would move every one of their
 * sitemap <lastmod> dates (scripts/git-lastmod.mjs) for a change that is not
 * content. Page sources keep writing plain `/scripts/x.js`.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';

function walk(dir, test, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, test, out);
    else if (entry.isFile() && test(entry.name)) out.push(full);
  }
  return out;
}

export function fingerprintScripts(outDir, logger = console) {
  const scriptsDir = join(outDir, 'scripts');
  if (!existsSync(scriptsDir)) {
    logger.warn('no dist/scripts directory; nothing to fingerprint');
    return;
  }

  const hashes = new Map();
  for (const file of walk(scriptsDir, (n) => n.endsWith('.js'))) {
    const urlPath = '/' + relative(outDir, file).split(sep).join('/');
    const hash = createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 10);
    hashes.set(urlPath, hash);
  }

  const re = /(<script\b[^>]*\ssrc=")(\/scripts\/[^"?#]+\.js)(")/g;
  let pages = 0;
  let refs = 0;
  const missing = new Set();
  for (const file of walk(outDir, (n) => n.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    let changed = false;
    const next = html.replace(re, (all, pre, src, post) => {
      const hash = hashes.get(src);
      if (!hash) {
        missing.add(src);
        return all;
      }
      changed = true;
      refs++;
      return `${pre}${src}?v=${hash}${post}`;
    });
    if (changed) {
      writeFileSync(file, next);
      pages++;
    }
  }

  // A reference to a script that is not in the build is a real bug (a 404 in
  // production), so fail loudly rather than shipping it.
  if (missing.size) {
    throw new Error(`fingerprint-scripts: referenced but not built: ${[...missing].join(', ')}`);
  }
  logger.info(`fingerprinted ${refs} /scripts/ reference(s) to ${hashes.size} file(s) across ${pages} page(s)`);
}
