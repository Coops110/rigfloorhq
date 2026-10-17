// Generates one real 1200x630 PNG per page into public/og/ before `astro
// build` runs, replacing the single shared og-default.png on every pillar,
// calculator, equipment, and blog page (SEO audit finding: one og:image for
// the whole site). Pattern lifted from calmbrainco-site's
// scripts/generate-og-images.mjs — hand-built SVG rendered through
// @resvg/resvg-js, not an AI image generator and not a headless-Chrome
// screenshot pipeline, because a template guarantees fast/deterministic/
// text-accurate output and an AI generator does not.
//
// Font note, same finding as calmbrainco: @resvg/resvg-js's bundled
// fontdb/ttf-parser cannot load this site's woff2 files (tried both the
// static per-weight files and loadSystemFonts fallback with the family name
// set — the brand face silently fails to resolve and the renderer falls
// back to its default, i.e. no visible text). So this renders with two real
// OS-installed fonts that are the closest visual cousins available locally:
// Bahnschrift (Windows 10/11 built-in condensed grotesque — same category as
// Barlow Condensed, used for the headline) and Consolas (monospace, stands
// in for IBM Plex Mono on the eyebrow/meta labels). Colors are the site's
// real tokens, copied from src/styles/global.css, not invented.
//
// Filename convention is load-bearing: BaseLayout.astro derives the expected
// image filename directly from the URL path (leading/trailing slashes
// stripped, internal slashes turned into hyphens) and only uses it if the
// file exists on disk. So `/calculators/annular-velocity` must produce
// `calculators-annular-velocity.png` here, `/es/blog/foo` must produce
// `es-blog-foo.png`, etc. Keep this script's slug logic and BaseLayout's in
// sync — see BaseLayout.astro's ogImage resolution for the matching half.
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public', 'og');

// Real brand tokens, copied verbatim from src/styles/global.css — do not
// invent new colors here.
const COLORS = {
  ink: '#0e0f11',
  steel: '#1c2130',
  iron: '#2a3347',
  rust: '#c94a1f',
  ember: '#f07038',
  amber: '#e8a020',
  fog: '#8892a4',
  mist: '#d1d8e4',
  white: '#ffffff',
};

const HEADLINE_FONT = 'Bahnschrift';
const MONO_FONT = 'Consolas';

const EYEBROW = {
  en: {
    pillars: 'PILLAR GUIDE', calculators: 'CALCULATOR', equipment: 'EQUIPMENT', blog: 'BLOG',
    careers: 'CAREERS', drilling: 'DRILLING', safety: 'SAFETY', welding: 'WELDING',
    glossary: 'GLOSSARY', quiz: 'QUIZ', home: 'OIL & GAS FIELD REFERENCE',
  },
  es: {
    pillars: 'GUÍA PILAR', calculators: 'CALCULADORA', equipment: 'EQUIPO', blog: 'BLOG',
    careers: 'CARRERAS', drilling: 'PERFORACIÓN', safety: 'SEGURIDAD', welding: 'SOLDADURA',
    glossary: 'GLOSARIO', quiz: 'CUESTIONARIO', home: 'REFERENCIA DE PETRÓLEO Y GAS',
  },
};
const EYEBROW_HUB = {
  en: {
    pillars: 'PILLAR GUIDES', calculators: 'CALCULATORS', equipment: 'EQUIPMENT', blog: 'BLOG',
    careers: 'CAREERS', drilling: 'DRILLING', safety: 'SAFETY', welding: 'WELDING', glossary: 'GLOSSARY',
  },
  es: {
    pillars: 'GUÍAS PILAR', calculators: 'CALCULADORAS', equipment: 'EQUIPO', blog: 'BLOG',
    careers: 'CARRERAS', drilling: 'PERFORACIÓN', safety: 'SEGURIDAD', welding: 'SOLDADURA', glossary: 'GLOSARIO',
  },
};

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Greedy character-count wrap — good enough for a title card, not a real
// text-measurement layout engine. Deliberately conservative (fewer chars per
// line than the font could actually fit) so a long title overflows into an
// extra line rather than running off the card edge.
function wrap(text, maxCharsPerLine, maxLines) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
    if (lines.length === maxLines - 1 && current.length > maxCharsPerLine) {
      // Even the current line alone is too long for the slot it would get —
      // hard-cut it so render never overflows the card.
      current = current.slice(0, maxCharsPerLine - 1).trimEnd() + '…';
      break;
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    const last = lines[maxLines - 1];
    if (last.length > maxCharsPerLine - 1) {
      lines[maxLines - 1] = last.slice(0, maxCharsPerLine - 1).trimEnd() + '…';
    }
  }
  return lines;
}

function card({ eyebrow, title }) {
  const W = 1200;
  const H = 630;
  const lines = wrap(title, 28, 4);
  const fontSizeByLines = { 1: 68, 2: 60, 3: 50, 4: 42 };
  const titleFontSize = fontSizeByLines[lines.length] || 42;
  const lineHeight = titleFontSize * 1.14;
  const titleBlockHeight = lines.length * lineHeight;
  // Vertical center of the title block sits a little above the card's
  // midpoint so there's still room for the eyebrow above and the footer
  // rule below on a 4-line title.
  const centerY = 330;
  const titleStartY = centerY - titleBlockHeight / 2 + titleFontSize * 0.82;

  const titleTspans = lines
    .map((line, i) => `<tspan x="90" y="${titleStartY + i * lineHeight}">${escapeXml(line)}</tspan>`)
    .join('');

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${COLORS.ink}" />
  <!-- right-edge steel panel, echoes the site's alternating section bands -->
  <rect x="${W - 260}" y="0" width="260" height="${H}" fill="${COLORS.steel}" />
  <rect x="${W - 264}" y="0" width="4" height="${H}" fill="${COLORS.iron}" />
  <!-- top accent rule -->
  <rect x="0" y="0" width="${W}" height="6" fill="${COLORS.rust}" />
  <!-- bottom accent rule -->
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="${COLORS.rust}" />

  <!-- wordmark -->
  <rect x="90" y="64" width="20" height="20" fill="${COLORS.rust}" />
  <text x="124" y="80" font-family="${MONO_FONT}" font-size="26" font-weight="700" letter-spacing="2" fill="${COLORS.white}">RIGFLOORHQ</text>

  <!-- eyebrow -->
  <text x="90" y="150" font-family="${MONO_FONT}" font-size="24" font-weight="700" letter-spacing="3" fill="${COLORS.ember}">${escapeXml(eyebrow.toUpperCase())}</text>

  <!-- title -->
  <text font-family="${HEADLINE_FONT}" font-size="${titleFontSize}" font-weight="700" fill="${COLORS.white}">${titleTspans}</text>

  <!-- footer caption -->
  <text x="90" y="${H - 54}" font-family="${MONO_FONT}" font-size="20" fill="${COLORS.mist}">rigfloorhq.com</text>
</svg>`;
}

let rendered = 0;
let failed = 0;

async function renderCard(slug, opts) {
  try {
    const svg = card(opts);
    const resvg = new Resvg(svg, {
      font: { loadSystemFonts: true, defaultFontFamily: HEADLINE_FONT },
      background: COLORS.ink,
    });
    const rawPng = resvg.render().asPng();
    // Recompress: resvg's own PNG encoder is not size-tuned. A flat-color
    // industrial card compresses hard with a real optimizer — this keeps
    // every generated image well under typical og:image budgets.
    const optimized = await sharp(rawPng)
      .png({ compressionLevel: 9, palette: true, effort: 10 })
      .toBuffer();
    const finalPng = optimized.length < rawPng.length ? optimized : rawPng;
    await writeFile(path.join(outDir, `${slug}.png`), finalPng);
    rendered++;
    return finalPng.length;
  } catch (e) {
    failed++;
    console.error(`FAIL ${slug}: ${e.message}`);
    return 0;
  }
}

function extractAstroTitle(source) {
  const m = source.match(/title="((?:[^"\\]|\\.)*)"/);
  return m ? m[1] : null;
}

function extractMdTitle(source) {
  const m = source.match(/^title:\s*"((?:[^"\\]|\\.)*)"/m);
  return m ? m[1] : null;
}

async function processAstroDir(dirRel, category, lang) {
  const dir = path.join(root, 'src', 'pages', ...(lang === 'es' ? ['es'] : []), dirRel);
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    console.warn(`skip (not found): ${dir}`);
    return [];
  }
  const results = [];
  for (const file of entries) {
    if (!file.endsWith('.astro')) continue;
    const source = await readFile(path.join(dir, file), 'utf-8');
    const title = extractAstroTitle(source);
    if (!title) {
      console.warn(`no literal title="..." found, skipping: ${path.join(dir, file)}`);
      continue;
    }
    const isIndex = file === 'index.astro';
    const base = isIndex ? category : `${category}-${file.replace(/\.astro$/, '')}`;
    const slug = lang === 'es' ? `es-${base}` : base;
    const eyebrowSet = isIndex ? EYEBROW_HUB : EYEBROW;
    const size = await renderCard(slug, { eyebrow: eyebrowSet[lang][category], title });
    results.push({ slug, title, size });
  }
  return results;
}

async function processBlog(lang) {
  const contentDir = path.join(root, 'src', 'content', lang === 'es' ? 'blog-es' : 'blog');
  let files;
  try {
    files = (await readdir(contentDir)).filter((f) => f.endsWith('.md'));
  } catch {
    console.warn(`skip (not found): ${contentDir}`);
    return [];
  }
  const results = [];
  for (const file of files) {
    const raw = await readFile(path.join(contentDir, file), 'utf-8');
    const title = extractMdTitle(raw);
    if (!title) {
      console.warn(`no title: found in frontmatter, skipping: ${path.join(contentDir, file)}`);
      continue;
    }
    const id = file.replace(/\.md$/, '');
    const base = `blog-${id}`;
    const slug = lang === 'es' ? `es-${base}` : base;
    const size = await renderCard(slug, { eyebrow: EYEBROW[lang].blog, title });
    results.push({ slug, title, size });
  }
  // Blog hub page.
  const hubSource = await readFile(
    path.join(root, 'src', 'pages', ...(lang === 'es' ? ['es'] : []), 'blog', 'index.astro'),
    'utf-8'
  );
  const hubTitle = extractAstroTitle(hubSource);
  if (hubTitle) {
    const hubSlug = lang === 'es' ? 'es-blog' : 'blog';
    const size = await renderCard(hubSlug, { eyebrow: EYEBROW_HUB[lang].blog, title: hubTitle });
    results.push({ slug: hubSlug, title: hubTitle, size });
  }
  return results;
}

// A top-level page that is a single .astro file rather than a directory —
// the home page and the well-control quiz. `slug` must match BaseLayout's
// path-derived name: / -> home, /es -> es, /well-control-quiz ->
// well-control-quiz, /es/well-control-quiz -> es-well-control-quiz.
async function processSinglePage(fileRel, category, lang, slugEn, slugEs) {
  const file = path.join(root, 'src', 'pages', ...(lang === 'es' ? ['es'] : []), fileRel);
  let source;
  try {
    source = await readFile(file, 'utf-8');
  } catch {
    console.warn(`skip (not found): ${file}`);
    return [];
  }
  const title = extractAstroTitle(source);
  if (!title) {
    console.warn(`no literal title="..." found, skipping: ${file}`);
    return [];
  }
  const slug = lang === 'es' ? slugEs : slugEn;
  const size = await renderCard(slug, { eyebrow: EYEBROW[lang][category], title });
  return [{ slug, title, size }];
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const all = [];
  for (const lang of ['en', 'es']) {
    all.push(...(await processAstroDir('pillars', 'pillars', lang)));
    all.push(...(await processAstroDir('calculators', 'calculators', lang)));
    all.push(...(await processAstroDir('equipment', 'equipment', lang)));
    all.push(...(await processAstroDir('careers', 'careers', lang)));
    all.push(...(await processAstroDir('drilling', 'drilling', lang)));
    all.push(...(await processAstroDir('safety', 'safety', lang)));
    all.push(...(await processAstroDir('welding', 'welding', lang)));
    all.push(...(await processAstroDir('glossary', 'glossary', lang)));
    all.push(...(await processSinglePage('index.astro', 'home', lang, 'home', 'es')));
    all.push(...(await processSinglePage('well-control-quiz.astro', 'quiz', lang, 'well-control-quiz', 'es-well-control-quiz')));
    all.push(...(await processBlog(lang)));
  }

  console.log(`\n--- OG image generation summary ---`);
  console.log(`Rendered: ${rendered}, Failed: ${failed}`);
  const oversized = all.filter((r) => r.size > 150 * 1024);
  if (oversized.length) {
    console.log(`Oversized (>150KB): ${oversized.map((r) => `${r.slug} (${Math.round(r.size / 1024)}KB)`).join(', ')}`);
  }
  const avgSize = all.length ? Math.round(all.reduce((a, r) => a + r.size, 0) / all.length / 1024) : 0;
  console.log(`Average size: ${avgSize}KB across ${all.length} images`);
}

await main();
