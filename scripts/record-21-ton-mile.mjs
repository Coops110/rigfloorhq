// Records the ton-mile calculator screen-recording segment for video 21,
// timed to land on the same beats as the pre-generated body narration
// (social/tiktok/21-ton-mile-cues.json). The page's own default inputs
// already produce the hook's real number (45.4 drilling ton-miles over the
// 8,000-8,500 ft interval), so this retypes the two depth fields that drive
// it plus the casing depth, and holds on the drilling/coring/short-trip and
// setting-casing outputs as each gets named. Hook line plays as its own
// audio clip under the static frame1 bookend, so this recording's
// narration timeline starts at t=0 with the body script only.
//
// Run: node scripts/record-21-ton-mile.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec21');
const CUES_PATH = path.join(REPO, 'social', 'tiktok', '21-ton-mile-cues.json');
const BASE_URL = 'http://localhost:4321';

const cues = JSON.parse(readFileSync(CUES_PATH, 'utf8'));
const [line1End, line2End, line3End] = cues.lines.map((l) => l.end);
console.log('Narration cues (s):', line1End, line2End, line3End);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Types character-by-character for the visual effect, then verifies the
// field actually holds the intended value and self-heals with a direct
// .fill() if not -- hard-fails rather than silently shipping a video with a
// wrong input. Added 2026-10-09 after the exact same keystroke-drop bug hit
// two of the prior batch's recording scripts and wasn't caught until a
// frame-decode check was run against the finished mp4.
async function typeField(page, selector, value, { delay = 90 } = {}) {
  const loc = page.locator(selector);
  await loc.fill('');
  await loc.pressSequentially(String(value), { delay });
  let actual = await loc.inputValue();
  if (actual !== String(value)) {
    console.warn(`  !! ${selector}: typed "${value}" but field holds "${actual}" -- retrying with direct fill`);
    await loc.fill(String(value));
    actual = await loc.inputValue();
    if (actual !== String(value)) {
      throw new Error(`${selector} still wrong after retry: expected "${value}", got "${actual}"`);
    }
  }
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    recordVideo: { dir: OUT_DIR, size: { width: 1080, height: 1920 } },
  });
  const page = await context.newPage();

  const t0 = Date.now();
  const elapsed = () => (Date.now() - t0) / 1000;
  const waitUntil = async (targetS) => {
    const remain = targetS * 1000 - (Date.now() - t0);
    if (remain > 0) await sleep(remain);
  };

  await page.goto(`${BASE_URL}/calculators/ton-mile`, { waitUntil: 'load' });
  await sleep(600);

  try {
    const acceptBtn = page.locator('#consent-accept');
    if (await acceptBtn.isVisible({ timeout: 1500 })) {
      await acceptBtn.click();
    }
  } catch { /* banner didn't show -- fine */ }

  const LEAD_IN = 1.5;
  await waitUntil(LEAD_IN);
  console.log('start @', elapsed().toFixed(2));

  // ---- line 1: "a ton-mile is one ton of load, moved one mile" -- retype
  // the two round-trip depths that drive the hook number. ----
  await waitUntil(line1End - 6);
  await typeField(page, '#deptha', '8000', { delay: 90 });
  console.log('typed depth A @', elapsed().toFixed(2));

  await waitUntil(line1End - 3);
  await typeField(page, '#depthb', '8500', { delay: 90 });
  console.log('typed depth B @', elapsed().toFixed(2));

  // ---- line 2: "API RP 9B tracks cumulative ton-miles against the line's
  // rated service life" -- hold on the round-trip ton-mile outputs. ----
  await waitUntil(line1End + 0.4);
  await page.locator('#out-rttmb').scrollIntoViewIfNeeded();
  console.log('holding on round-trip TM @', elapsed().toFixed(2));

  // ---- line 3: "a drilling trip costs three times... coring costs two
  // times... setting casing isn't a round trip at all" -- show drilling/
  // coring/short-trip, then scroll to the separate casing section. ----
  await waitUntil(line2End + 0.4);
  await page.locator('#out-drilling').scrollIntoViewIfNeeded();
  console.log('holding on drilling/coring/short-trip @', elapsed().toFixed(2));

  await waitUntil(line3End - 3);
  await page.locator('#csgdepth').scrollIntoViewIfNeeded();
  await page.locator('#csgdepth').fill('');
  await page.locator('#csgdepth').pressSequentially('8500', { delay: 80 });
  console.log('typed casing depth, holding on casing TM @', elapsed().toFixed(2));

  await waitUntil(line3End + 2.0);
  console.log('stop @', elapsed().toFixed(2));

  await context.close();
  await browser.close();
  console.log('done -- video written to', OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
