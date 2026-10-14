// Records the MAASP calculator screen-recording segment for video 23 (the
// 2026-10-14 queue-gap fill), timed to land on the same beats as the
// pre-generated body narration (social/tiktok/23-maasp-cues.json). The
// page's own default inputs already produce the hook's real number
// (860 psi margin at 9.1 ppg), so this script holds on the output for the
// intro line, walks through the four input fields as line 2 names them,
// then retypes the current-mud-weight field from 9.1 to 10.5 (the LOT/FIT
// test's own mud weight) during the payoff line so the viewer watches
// MAASP live-collapse from 860 to 415 psi on screen, matching the spoken
// number. Hook line plays as its own audio clip under the static frame1
// bookend, so this recording's narration timeline starts at t=0 with the
// body script only.
//
// Run: node scripts/record-23-maasp.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const PLAYWRIGHT_PKG =
  'C:/Users/ccoop/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
const { chromium } = await import(pathToFileURL(PLAYWRIGHT_PKG).href);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const OUT_DIR = path.join(REPO, 'social', 'tiktok', '_rec23');
const CUES_PATH = path.join(REPO, 'social', 'tiktok', '23-maasp-cues.json');
const BASE_URL = 'http://localhost:4321';

const cues = JSON.parse(readFileSync(CUES_PATH, 'utf8'));
const [line1End, line2End, line3End] = cues.lines.map((l) => l.end);
console.log('Narration cues (s):', line1End, line2End, line3End);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Types character-by-character for the visual effect, then verifies the
// field actually holds the intended value and self-heals with a direct
// .fill() if not -- hard-fails rather than silently shipping a video with a
// wrong input. Same helper as record-21-ton-mile.mjs / record-22-drill-pipe-
// tally.mjs, added 2026-10-09 after a keystroke-drop bug shipped two broken
// videos silently -- never skip this when retyping a live field.
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

  await page.goto(`${BASE_URL}/calculators/maasp`, { waitUntil: 'load' });
  await sleep(600);

  try {
    const acceptBtn = page.locator('#consent-accept');
    if (await acceptBtn.isVisible({ timeout: 1500 })) {
      await acceptBtn.click();
    }
  } catch { /* banner didn't show -- fine */ }

  const LEAD_IN = 1.5;
  await waitUntil(LEAD_IN);
  await page.locator('#maasp-output').scrollIntoViewIfNeeded();
  console.log('start, holding on output (860 psi default) @', elapsed().toFixed(2));

  // ---- line 1: "This is MAASP... found straight from your LOT or FIT
  // test." -- hold on the live output box showing the default 860 psi /
  // 1.4 ppg margin, no field changes yet. ----
  await waitUntil(line1End + 0.3);

  // ---- line 2: "Enter the test pressure, the test's own mud weight,
  // today's mud weight, and shoe TVD..." -- walk through the four input
  // fields in the exact order they're named. ----
  const inputWindow = line2End - line1End;
  const step = inputWindow / 4;

  await waitUntil(line1End + step * 0.5);
  await page.locator('#maasp-lp').scrollIntoViewIfNeeded();
  await page.locator('#maasp-lp').focus();
  console.log('focus LOT/FIT pressure @', elapsed().toFixed(2));

  await waitUntil(line1End + step * 1.5);
  await page.locator('#maasp-lmw').scrollIntoViewIfNeeded();
  await page.locator('#maasp-lmw').focus();
  console.log('focus LOT/FIT mud weight @', elapsed().toFixed(2));

  await waitUntil(line1End + step * 2.5);
  await page.locator('#maasp-mw').scrollIntoViewIfNeeded();
  await page.locator('#maasp-mw').focus();
  console.log('focus current mud weight @', elapsed().toFixed(2));

  await waitUntil(line1End + step * 3.5);
  await page.locator('#maasp-tvd').scrollIntoViewIfNeeded();
  await page.locator('#maasp-tvd').focus();
  console.log('focus shoe TVD @', elapsed().toFixed(2));

  // ---- line 3: "At nine point one ppg, this well has eight hundred sixty
  // psi of margin. Weight the mud up to the test's ten point five, and
  // that margin disappears -- MAASP drops straight to four fifteen." ----
  await waitUntil(line2End + 0.4);
  await page.locator('#maasp-output').scrollIntoViewIfNeeded();
  console.log('back on output, still 860 psi @', elapsed().toFixed(2));

  await waitUntil(line3End - 5);
  await page.locator('#maasp-mw').scrollIntoViewIfNeeded();
  console.log('scrolled to current-MW field for the retype @', elapsed().toFixed(2));

  await waitUntil(line3End - 4);
  await typeField(page, '#maasp-mw', '10.5', { delay: 110 });
  console.log('retyped current MW to 10.5 (matches LOT/FIT MW) @', elapsed().toFixed(2));

  await waitUntil(line3End - 2.5);
  await page.locator('#maasp-output').scrollIntoViewIfNeeded();
  console.log('holding on collapsed output (415 psi) @', elapsed().toFixed(2));

  await waitUntil(line3End + 1.5);
  console.log('stop @', elapsed().toFixed(2));

  await context.close();
  await browser.close();
  console.log('done -- video written to', OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
