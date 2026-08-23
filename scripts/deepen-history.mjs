/**
 * Fetch the rest of the history before the sitemap is built.
 *
 * Vercel clones shallow. That is fine for compiling the site, but
 * scripts/git-lastmod.mjs dates each URL from the last commit touching its own
 * source file, and a truncated history cannot answer that — git reports the
 * boundary commit as having added every file that existed at that point, so
 * pages older than the cut-off resolve to it.
 *
 * The guard in git-lastmod.mjs turns that into "no lastmod" rather than a
 * false one, which is the safe failure. This is what turns the safe failure
 * back into the right answer where the environment allows it.
 *
 * Called from buildGitLastmodMap(), NOT from an npm lifecycle hook. A
 * `prebuild` script only runs when the build is invoked as `npm run build`;
 * if the build command is `astro build` the hook never fires and the fetch
 * silently never happens. astro.config.mjs is evaluated on every build however
 * it is started, so hanging this off the map build makes it unconditional.
 *
 * Deliberately incapable of failing the build. A sitemap without lastmod is a
 * minor loss; a deploy blocked because a fetch was refused is not acceptable
 * for something this peripheral. Every failure path leaves the clone as it was
 * and lets git-lastmod.mjs degrade.
 */

import { execFileSync } from 'node:child_process';

function git(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    // A hung fetch must not hang the deploy.
    timeout: 60_000,
  });
}

/** @returns {boolean} whether history is complete afterwards */
export function deepenHistory() {
  let shallow;
  try {
    shallow = git(['rev-parse', '--is-shallow-repository']).trim() === 'true';
  } catch {
    // No git at all — a tarball build, say. git-lastmod.mjs handles this.
    console.log('[deepen-history] git unavailable — leaving history alone');
    return false;
  }

  if (!shallow) {
    console.log('[deepen-history] clone is already complete');
    return true;
  }

  try {
    git(['fetch', '--unshallow']);
    console.log('[deepen-history] unshallowed — per-page lastmod dates available');
    return true;
  } catch (err) {
    // Most likely no credentials in the build sandbox, or the remote refusing.
    const detail = String(err?.stderr || err?.message || '').trim().split('\n')[0];
    console.warn(`[deepen-history] could not unshallow (${detail || 'unknown'})`);
    console.warn('[deepen-history] sitemap will omit lastmod rather than guess');
    return false;
  }
}

// Still runnable directly (`node scripts/deepen-history.mjs`) for debugging.
if (import.meta.url === `file://${process.argv[1]}`) deepenHistory();
