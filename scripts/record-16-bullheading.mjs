// Records the bullheading calculator screen-recording segment for video 16,
// timed to land on the same beats as the pre-generated body narration
// (social/tiktok/16-bullheading-cues.json). Copy-adapted from
// record-15-riser-margin.mjs -- hook line plays as its own audio clip under
// the static frame1 bookend, so this recording's narration timeline starts
// at t=0 with the body script only.
//
// Run: node scripts/record-16-bullheading.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec16');
const CUES_PATH = path.join(REPO, 'social', 'tiktok', '16-bullheading-cues.json');
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

  await page.goto(`${BASE_URL}/calculators/bullheading`, { waitUntil: 'load' });
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

  // ---- line 1: "bullheading pumps kill fluid straight down the tubing...
  // forcing the well's contents back into the formation" -- re-type the
  // well inputs that set up the job. ----
  await waitUntil(line1End - 6);
  await page.locator('#fp').fill('');
  await page.locator('#fp').pressSequentially('5500', { delay: 90 });
  console.log('typed formation pressure @', elapsed().toFixed(2));

  await waitUntil(line1End - 3.5);
  await page.locator('#sitp').fill('');
  await page.locator('#sitp').pressSequentially('800', { delay: 100 });
  console.log('typed SITP @', elapsed().toFixed(2));

  await waitUntil(line1End - 1);
  await page.locator('#tvd').fill('');
  await page.locator('#tvd').pressSequentially('9000', { delay: 90 });
  console.log('typed TVD @', elapsed().toFixed(2));

  // ---- line 2: "enter formation pressure, shut-in pressure, TVD, and
  // fluid weight, and it checks two surface-pressure ceilings" -- finish
  // the remaining well inputs named in this line. ----
  await waitUntil(line1End + 0.4);
  await page.locator('#omw').fill('');
  await page.locator('#omw').pressSequentially('9.0', { delay: 100 });
  console.log('typed original fluid weight @', elapsed().toFixed(2));

  await waitUntil(line2End - 2);
  await page.locator('#fg').scrollIntoViewIfNeeded();
  await page.locator('#fg').fill('');
  await page.locator('#fg').pressSequentially('0.75', { delay: 100 });
  console.log('typed fracture gradient @', elapsed().toFixed(2));

  // ---- line 3: "the final ceiling is the tighter one... cross it, and
  // you fracture the formation at surface" -- hold on the two headline
  // surface-pressure ceiling outputs as the payoff line lands. ----
  await waitUntil(line2End + 0.4);
  await page.locator('#out-mfsp').scrollIntoViewIfNeeded();
  console.log('holding on surface pressure ceilings @', elapsed().toFixed(2));

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
