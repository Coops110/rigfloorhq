// Records the mud-weight-window calculator screen-recording segment for
// TikTok video 08, timed to land on the same beats as the pre-generated
// narration (social/tiktok/08-mud-weight-window-cues.json), so the finished
// overlay in make-calc-assemble.py lines up instead of just floating on top.
//
// Loads the `playwright` package from its npx cache location directly
// (no local devDependency in this repo) and drives the *system* Chrome via
// channel: 'chrome' rather than downloading Playwright's own Chromium,
// since only `playwright install ffmpeg` had been run here previously.
//
// Records against the LOCAL dev server (http://localhost:4321) -- never the
// live site, to avoid polluting real GA4 analytics with a bot session.
//
// Run: node scripts/record-08-mud-weight-window.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec08');
const CUES_PATH = path.join(REPO, 'social', 'tiktok', '08-mud-weight-window-cues.json');
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

  await page.goto(`${BASE_URL}/calculators/mud-weight-window`, { waitUntil: 'load' });
  await sleep(600);

  // Dismiss the cookie banner if it appears (region-dependent) so it doesn't
  // sit over the calculator for the whole recording, matching 06/07.
  try {
    const acceptBtn = page.locator('#consent-accept');
    if (await acceptBtn.isVisible({ timeout: 1500 })) {
      await acceptBtn.click();
    }
  } catch { /* banner didn't show -- fine */ }

  // ---- lead-in: recording starts, narration (in the assembled video) will
  // start at LEAD_IN seconds from here. ----
  const LEAD_IN = 2.0;
  await waitUntil(LEAD_IN);
  console.log('start fill @', elapsed().toFixed(2));

  // Wide, comfortable window: TVD 12000, current MW 12.0 ppg, pore 9.2,
  // frac 15.0 -- matches "set pore and fracture pressure, show the window".
  await page.locator('#mww-tvd').pressSequentially('12000', { delay: 90 });
  await sleep(200);
  await page.locator('#mww-current').pressSequentially('12.0', { delay: 90 });
  await sleep(200);
  await page.locator('#mww-pp').pressSequentially('9.2', { delay: 90 });
  await sleep(200);
  await page.locator('#mww-fg').pressSequentially('15.0', { delay: 90 });

  // Hold on the filled-but-not-calculated form briefly (natural pause),
  // then calculate so the wide/safe result lands as line 1 narration ends.
  await waitUntil(line1End - 0.3);
  await page.locator('#calc-mww-btn').click();
  console.log('first calculate @', elapsed().toFixed(2));

  // ---- line 2: "Now watch what happens as that gap closes." -- narrow the
  // window while this plays. ----
  await waitUntil(line1End + 0.6);
  await page.locator('#mww-pp').fill('');
  await page.locator('#mww-pp').pressSequentially('11.8', { delay: 90 });
  await sleep(200);
  await page.locator('#mww-fg').fill('');
  await page.locator('#mww-fg').pressSequentially('12.3', { delay: 90 });

  // Calculate again right around where line 2 hands off to line 3, so the
  // narrow/caution result is on screen for "this is the window you're
  // actually drilling inside... almost nothing left."
  await waitUntil(line2End - 0.2);
  await page.locator('#calc-mww-btn').click();
  console.log('second calculate @', elapsed().toFixed(2));

  // Hold on the narrow result through the end of narration plus a couple
  // seconds of silent tail so the caution badge has time to register.
  await waitUntil(line3End + 2.5);
  console.log('stop @', elapsed().toFixed(2));

  await context.close();
  await browser.close();
  console.log('done -- video written to', OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
