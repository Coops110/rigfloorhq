/**
 * Pings IndexNow's bulk endpoint with every URL in the real built sitemap,
 * on every deploy.
 *
 * A one-time manual bulk submission was done in September via a one-off
 * script run against the sitemap at that time. It was never wired into the
 * deploy pipeline, so every page shipped since then has waited on normal
 * crawl discovery instead of getting pinged. This closes that gap by
 * running automatically as a postbuild step (see package.json) so it fires
 * on every `npm run build`, including the one Vercel runs on every git push.
 *
 * Deliberately resubmits the full sitemap every time rather than diffing
 * against the last run — IndexNow's bulk endpoint does not penalize
 * resubmitting unchanged URLs, so a real diffing mechanism would be
 * complexity with no upside here.
 *
 * Reads the sitemap from the already-built dist/ output (sitemap-index.xml
 * and whatever sitemap files it references) rather than hard-coding a
 * filename, since @astrojs/sitemap's output shape is an implementation
 * detail, not a contract.
 *
 * Must never fail the production build. Any error — missing dist/, a
 * missing/malformed sitemap, a network failure or timeout hitting IndexNow —
 * is caught, logged as a warning, and the process exits 0.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://rigfloorhq.com';
const HOST = 'rigfloorhq.com';
const INDEXNOW_KEY = '856f6ffed6e774e2835880dbd3248cd6';
const KEY_LOCATION = `${SITE}/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const FETCH_TIMEOUT_MS = 15000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');

function extractTagValues(xml, tag) {
  const re = new RegExp(`<${tag}>([^<]*)<\\/${tag}>`, 'g');
  const values = [];
  let m;
  while ((m = re.exec(xml)) !== null) {
    values.push(m[1].trim());
  }
  return values;
}

// Maps a sitemap <loc> URL (e.g. https://rigfloorhq.com/sitemap-0.xml) back
// to its file in dist/ — the sitemap index references the live site origin,
// not the local build path.
function sitemapUrlToDistPath(url) {
  if (!url.startsWith(SITE)) return null;
  const relative = url.slice(SITE.length).replace(/^\/+/, '');
  return join(DIST_DIR, relative);
}

function collectSitemapUrls() {
  const indexPath = join(DIST_DIR, 'sitemap-index.xml');
  if (!existsSync(indexPath)) {
    throw new Error(`sitemap index not found at ${indexPath} — did the build run?`);
  }

  const indexXml = readFileSync(indexPath, 'utf8');
  const childSitemapUrls = extractTagValues(indexXml, 'loc');
  if (!childSitemapUrls.length) {
    throw new Error(`${indexPath} contained no <sitemap><loc> entries`);
  }

  const pageUrls = [];
  for (const sitemapUrl of childSitemapUrls) {
    const localPath = sitemapUrlToDistPath(sitemapUrl);
    if (!localPath || !existsSync(localPath)) {
      throw new Error(`referenced sitemap ${sitemapUrl} has no matching file in dist/ (expected ${localPath})`);
    }
    const sitemapXml = readFileSync(localPath, 'utf8');
    pageUrls.push(...extractTagValues(sitemapXml, 'loc'));
  }

  // Dedupe, just in case a URL is ever listed in more than one child sitemap.
  return [...new Set(pageUrls)];
}

async function submitToIndexNow(urlList) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList,
      }),
      signal: controller.signal,
    });
    const bodyText = await response.text().catch(() => '');
    return { status: response.status, bodyText };
  } finally {
    clearTimeout(timeout);
  }
}

export async function pingIndexNow(logger = console) {
  const urlList = collectSitemapUrls();
  logger.log(`[indexnow-ping] submitting ${urlList.length} URLs from dist/sitemap-index.xml to ${INDEXNOW_ENDPOINT}`);
  const { status, bodyText } = await submitToIndexNow(urlList);
  logger.log(`[indexnow-ping] IndexNow responded ${status}${bodyText ? ` — ${bodyText}` : ''}`);
  return { status, count: urlList.length };
}

async function main() {
  try {
    await pingIndexNow(console);
  } catch (err) {
    // A flaky third-party ping must never take down a real deploy.
    console.warn(`[indexnow-ping] WARNING: IndexNow submission failed, continuing build. ${err?.message || err}`);
  }
  process.exit(0);
}

main();
