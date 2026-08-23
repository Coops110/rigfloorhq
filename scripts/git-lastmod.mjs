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
import { deepenHistory } from './deepen-history.mjs';

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
  // Try to complete the clone first — see deepen-history.mjs for why this is
  // called here rather than from an npm `prebuild` hook. Never throws.
  deepenHistory();

  let log;
  try {
    // %x00 writes a NUL byte, which cannot occur in a path, so it reliably
    // marks the header lines apart from the --name-only file lines. %H rides
    // along so a boundary commit can be recognised — see below.
    log = git("git log --pretty=format:'%x00%cI %H' --name-only --no-renames");
  } catch {
    console.warn('[sitemap] git history unavailable — building without lastmod');
    return null;
  }

  let shallow = false;
  try {
    shallow = git('git rev-parse --is-shallow-repository').trim() === 'true';
  } catch { /* older git without the flag; not worth failing over */ }

  // A shallow clone does NOT simply truncate history. Git presents the
  // boundary commit — the oldest one present, which has had its parents cut
  // away — as though it added every file that existed at that point. So
  // --name-only attributes the entire tree to it, and every page older than
  // the cut-off silently inherits its date.
  //
  // This was live. Vercel clones at depth 1, so the boundary commit is HEAD
  // and all 150 tracked files resolved to it: every one of the 84 URLs shipped
  // with the date of the newest commit, rolling forward on each deploy. That
  // is precisely the "every page claims it changed on every build" failure
  // this file exists to avoid, and the build's "84/84 have lastmod (100%)"
  // report hid it — a full count says nothing about whether the dates are real.
  //
  // Boundary commits are the parentless ones. In a complete clone that is the
  // true initial commit, whose file list is honest, so this only applies when
  // the clone is actually shallow.
  const grafted = new Set();
  if (shallow) {
    try {
      for (const sha of git('git rev-list --max-parents=0 HEAD').trim().split('\n')) {
        if (sha) grafted.add(sha.trim());
      }
    } catch { /* fall through: without the SHAs we cannot filter, see below */ }
    console.warn(
      grafted.size
        ? '[sitemap] shallow clone — files known only to the boundary commit will get no lastmod'
        : '[sitemap] shallow clone and boundary commit unknown — building without lastmod'
    );
    if (!grafted.size) return null;
  }

  const map = new Map();
  let date = null;
  let skip = false;
  for (const line of log.split('\n')) {
    if (line.charCodeAt(0) === 0) {
      const [iso, sha] = line.slice(1).trim().split(/\s+/);
      date = iso;
      // Its file list is an artefact of the clone depth, not a real change.
      skip = grafted.has(sha);
      continue;
    }
    if (skip) continue;
    const file = line.trim();
    if (!file || !date) continue;
    if (!map.has(file)) map.set(file, date);
  }
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
