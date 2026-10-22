// One-off generator for public/favicon.ico. Browsers auto-probe /favicon.ico
// regardless of the <link> tag in <head> (see BaseLayout.astro's comment),
// and until now that file didn't exist, so every browser's automatic probe
//404'd. A valid single-image ICO container can just hold PNG bytes directly
// (supported by every modern browser since ICO's spec allows a PNG-format
// image entry) — no need for a real multi-resolution BMP-based ICO.
//
// Run with: node scripts/generate-favicon.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

const pngBuffer = await sharp(path.join(process.cwd(), 'public', 'logo-512.png'))
  .resize(32, 32)
  .png()
  .toBuffer();

// Minimal ICO container: 6-byte header, one 16-byte directory entry, then
// the raw PNG bytes as the image data.
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: 1 = icon
header.writeUInt16LE(1, 4); // image count

const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0); // width (0 = 256, but 32 fits in a byte)
entry.writeUInt8(32, 1); // height
entry.writeUInt8(0, 2); // color palette
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // color planes
entry.writeUInt16LE(32, 6); // bits per pixel
entry.writeUInt32LE(pngBuffer.length, 8); // image data size
entry.writeUInt32LE(header.length + entry.length, 12); // offset to image data

const ico = Buffer.concat([header, entry, pngBuffer]);
const outPath = path.join(process.cwd(), 'public', 'favicon.ico');
writeFileSync(outPath, ico);
console.log(`Wrote ${outPath} (${ico.length} bytes)`);
