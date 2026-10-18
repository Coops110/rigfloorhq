// One-off script: renders a YouTube profile picture (800x800) and channel
// banner (2048x1152, content centered in the 1235x338 safe area) for the new
// RigFloorHQ YouTube channel. Same render method as generate-og-images.mjs
// (SVG -> @resvg/resvg-js -> PNG via sharp) and the same real brand tokens
// and logo geometry (public/favicon.svg, public/logo.svg) — nothing invented.
// Not part of the build pipeline; run once, output goes to Downloads, not
// public/.
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const COLORS = {
  ink: '#0e0f11',
  steel: '#1c2130',
  rust: '#c94a1f',
  ember: '#f07038',
  amber: '#f0ac2e',
  fog: '#8892a4',
  white: '#ffffff',
};

const downloads = path.join(os.homedir(), 'Downloads');

async function render(svg, width, height, outFile) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: true, defaultFontFamily: 'Bahnschrift' },
  });
  const pngData = resvg.render();
  const buffer = await sharp(pngData.asPng()).resize(width, height, { fit: 'fill' }).png().toBuffer();
  await writeFile(path.join(downloads, outFile), buffer);
  console.log('wrote', outFile, `${width}x${height}`);
}

// ── Profile picture (800x800) — same square "R" mark as favicon.svg/logo-512.png ──
const profileSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="${COLORS.ink}"/>
  <text x="50" y="68" font-family="Bahnschrift" font-weight="900" font-size="60" fill="${COLORS.rust}" text-anchor="middle">R</text>
</svg>`;

// ── Channel banner (2048x1152) — derrick mark + wordmark + tagline, centered
//    in the ~1235x338 safe area that survives every device crop. ──
const cx = 1024, cy = 576;
const iconScale = 1.7; // logo.svg icon is ~100x150 native; scale up for a 2048-wide canvas
const iconW = 100 * iconScale, iconH = 150 * iconScale;
const iconX = cx - 470, iconY = cy - iconH / 2;
const textX = iconX + iconW + 50;

const bannerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="1152" viewBox="0 0 2048 1152">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.amber}"/>
      <stop offset="100%" stop-color="${COLORS.rust}"/>
    </linearGradient>
  </defs>
  <rect width="2048" height="1152" fill="${COLORS.ink}"/>
  <g transform="translate(${iconX}, ${iconY}) scale(${iconScale})">
    <path d="M 50 5 L 100 135 L 75 135 L 50 65 L 25 135 L 0 135 Z"
          fill="none" stroke="url(#grad)" stroke-width="13" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="50" cy="5" r="10" fill="${COLORS.amber}"/>
  </g>
  <text x="${textX}" y="${cy - 10}" font-family="Bahnschrift" font-weight="900" font-size="130" letter-spacing="-3">
    <tspan fill="${COLORS.white}">Rig</tspan><tspan fill="${COLORS.rust}">Floor</tspan><tspan fill="${COLORS.amber}">HQ</tspan>
  </text>
  <text x="${textX + 4}" y="${cy + 55}" font-family="Consolas" font-weight="700" font-size="30" fill="${COLORS.fog}" letter-spacing="5">FIELD REFERENCE &amp; TOOLS</text>
</svg>`;

await render(profileSvg, 800, 800, 'rigfloorhq-youtube-profile-picture.png');
await render(bannerSvg, 2048, 1152, 'rigfloorhq-youtube-banner.png');
