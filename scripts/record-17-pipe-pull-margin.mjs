// Records the pipe pull margin calculator screen-recording segment for
// video 17, timed to land on the same beats as the pre-generated body
// narration (social/tiktok/17-pipe-pull-margin-cues.json). Copy-adapted
// from record-16-bullheading.mjs -- hook line plays as its own audio clip
// under the static frame1 bookend, so this recording's narration timeline
// starts at t=0 with the body script only.
//
// Run: node scripts/record-17-pipe-pull-margin.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec17');
const CUES_PATH = path.join(REPO, 'social', 'tiktok', '17-pipe-pull-margin-cues.json');
const BASE_URL = 'http://localhost:4321';

const cues = JSON.parse(readFileSync(CUES_PATH, 'utf8'));
const [line1End, line2End, line3End] = cues.lines.map((l) => l.end);
console.log('Narration cues (s):', line1End, line2End, line3End);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

  await page.goto(`${BASE_URL}/calculators/pipe-pull-margin`, { waitUntil: 'load' });
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

  // ---- line 1: "how much pipe comes out, wet or dry, before hydrostatic
  // pressure drops by a target amount" -- re-type the target pressure drop
  // and mud weight so the viewer sees the exact inputs behind the hook. ----
  await waitUntil(line1End - 4);
  await page.locator('#dp').fill('');
  await page.locator('#dp').pressSequentially('75', { delay: 100 });
  console.log('typed target pressure drop @', elapsed().toFixed(2));

  await waitUntil(line1End - 1.5);
  await page.locator('#mw').fill('');
  await page.locator('#mw').pressSequentially('10', { delay: 100 });
  console.log('typed mud weight @', elapsed().toFixed(2));

  // ---- line 2: "enter the target pressure drop, mud weight, annulus
  // capacity, and drill pipe capacity and displacement" -- finish the
  // capacity/displacement inputs named in this line. ----
  await waitUntil(line1End + 0.4);
  await page.locator('#acap').fill('');
  await page.locator('#acap').pressSequentially('0.0774', { delay: 70 });
  console.log('typed annulus capacity @', elapsed().toFixed(2));

  await waitUntil(line2End - 4);
  await page.locator('#dpcap').fill('');
  await page.locator('#dpcap').pressSequentially('0.01776', { delay: 60 });
  console.log('typed drill pipe capacity @', elapsed().toFixed(2));

  await waitUntil(line2End - 1.5);
  await page.locator('#dpdisp').fill('');
  await page.locator('#dpdisp').pressSequentially('0.0075', { delay: 70 });
  console.log('typed drill pipe displacement @', elapsed().toFixed(2));

  // ---- line 3: "four hundred forty-two feet... dry pipe... eighteen
  // hundred thirty feet" -- hold on both headline outputs as the payoff
  // numbers land. ----
  await waitUntil(line2End + 0.4);
  await page.locator('#out-dry').scrollIntoViewIfNeeded();
  console.log('holding on wet/dry outputs @', elapsed().toFixed(2));

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
