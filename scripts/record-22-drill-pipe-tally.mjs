// Records the drill pipe tally calculator screen-recording segment for
// video 22, timed to land on the same beats as the pre-generated body
// narration (social/tiktok/22-drill-pipe-tally-cues.json). Retypes joint
// length and joint count to reproduce the hook's real 624 ft total, then
// holds on the capacity/displacement outputs and the running tally table as
// each gets named. Hook line plays as its own audio clip under the static
// frame1 bookend, so this recording's narration timeline starts at t=0
// with the body script only.
//
// Run: node scripts/record-22-drill-pipe-tally.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec22');
const CUES_PATH = path.join(REPO, 'social', 'tiktok', '22-drill-pipe-tally-cues.json');
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

  await page.goto(`${BASE_URL}/calculators/drill-pipe-tally`, { waitUntil: 'load' });
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

  // ---- line 1: "a tally is a physical measurement, joint by joint" --
  // retype OD/ID to show the pipe spec going in. ----
  await waitUntil(line1End - 5);
  await typeField(page, '#dp-od', '5', { delay: 100 });
  console.log('typed pipe OD @', elapsed().toFixed(2));

  await waitUntil(line1End - 2.5);
  await typeField(page, '#dp-id', '4.276', { delay: 90 });
  console.log('typed pipe ID @', elapsed().toFixed(2));

  // ---- line 2: "twenty joints at thirty-one point two feet average comes
  // out to six hundred twenty-four feet" -- retype the two fields that
  // literally produce the hook's number. ----
  await waitUntil(line1End + 0.4);
  await page.locator('#joint-len').scrollIntoViewIfNeeded();
  await typeField(page, '#joint-len', '31.2', { delay: 90 });
  console.log('typed joint length @', elapsed().toFixed(2));

  await waitUntil(line2End - 3);
  await typeField(page, '#joint-count', '20', { delay: 100 });
  console.log('typed joint count, holding on total length @', elapsed().toFixed(2));

  // ---- line 3: "capacity... displacement... compare displacement against
  // what the trip tank actually shows" -- hold on the capacity/displacement
  // outputs, then the running tally table underneath them. ----
  await waitUntil(line2End + 0.4);
  await page.locator('#out-total-disp').scrollIntoViewIfNeeded();
  console.log('holding on capacity/displacement @', elapsed().toFixed(2));

  await waitUntil(line3End - 3);
  await page.locator('#tally-body').scrollIntoViewIfNeeded();
  console.log('holding on running tally table @', elapsed().toFixed(2));

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
