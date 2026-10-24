/**
 * Generates llms.txt from the actual build output, not a hand-maintained
 * list. The hand-written version this replaced listed 25 of 279 URLs, 2 of
 * the calculator pages and 0 of the 57 equipment pages, and its summary
 * line ("34 interactive drilling calculators") was itself wrong — it drifted
 * the moment a page was added or removed, exactly like the sitemap lastmod
 * problem this repo already fixed once with git-derived dates.
 *
 * Runs in an astro:build:done hook (see astro.config.mjs), after every page
 * is written to dist/, so it reads real <title>/<meta description>/
 * <link rel=canonical> tags and real robots meta — never source guesses.
 * noindex pages (404, /links, the noindex blog post) are excluded the same
 * way they are from the sitemap.
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://rigfloorhq.com';

function walkHtml(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walkHtml(p, out);
    else if (entry.endsWith('.html')) out.push(p);
  }
  return out;
}

// HTML escapes its text content, but this file is plain Markdown — decode
// the handful of entities BaseLayout's titles/descriptions can ever contain.
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractPage(filePath) {
  const html = readFileSync(filePath, 'utf8');
  const titleM = html.match(/<title>([^<]*)<\/title>/);
  const descM = html.match(/<meta name="description" content="([^"]*)"/);
  const canonM = html.match(/<link rel="canonical" href="([^"]*)"/);
  const robotsM = html.match(/<meta name="robots" content="([^"]*)"/);
  if (!titleM || !canonM) return null;
  const robots = robotsM ? robotsM[1] : 'index, follow';
  if (robots.includes('noindex')) return null;
  let title = decodeEntities(titleM[1].trim());
  // Drop the " | RigFloorHQ" suffix BaseLayout appends — the section heading
  // in this file already carries the brand context.
  title = title.replace(/\s*\|\s*RigFloorHQ\s*$/, '');
  const url = canonM[1];
  const path = url.replace(SITE, '') || '/';
  const description = descM ? decodeEntities(descM[1].trim()) : '';
  return { path, url, title, description };
}

function section(title, pages) {
  if (!pages.length) return '';
  const lines = pages
    .slice()
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((p) => `- [${p.title}](${p.url}): ${p.description}`);
  return `## ${title}\n\n${lines.join('\n')}\n`;
}

export function generateLlmsTxt(outDir, logger) {
  const files = walkHtml(outDir).filter((f) => !f.endsWith('404.html'));
  const pages = [];
  for (const f of files) {
    const page = extractPage(f);
    if (page) pages.push(page);
  }

  const en = pages.filter((p) => !p.path.startsWith('/es'));
  const es = pages.filter((p) => p.path.startsWith('/es'));

  const home = en.find((p) => p.path === '/');
  // Trailing slash on each prefix deliberately excludes the section's own
  // hub page (e.g. bare "/equipment") from its own count — `startsWith`
  // without it was counting every hub as one of its own child pages, the
  // off-by-one the 2026-10-15 audit caught (claimed 35/57, real 34/56).
  const careers = en.filter((p) => p.path.startsWith('/careers/'));
  const equipment = en.filter((p) => p.path.startsWith('/equipment/'));
  const drilling = en.filter((p) => p.path.startsWith('/drilling/'));
  const calculators = en.filter((p) => p.path.startsWith('/calculators/'));
  const welding = en.filter((p) => p.path.startsWith('/welding/'));
  const safety = en.filter((p) => p.path.startsWith('/safety/'));
  const pillars = en.filter((p) => p.path.startsWith('/pillars/'));
  const glossary = en.filter((p) => p.path === '/glossary');
  const quiz = en.filter((p) => p.path === '/well-control-quiz' || p.path.startsWith('/well-control-quiz/'));
  const about = en.filter((p) => p.path === '/about' || p.path.startsWith('/about/'));
  const blog = en.filter((p) => p.path.startsWith('/blog/'));

  const esBlog = es.filter((p) => p.path.startsWith('/es/blog/'));
  const enBlogCount = blog.length;
  const esBlogCount = esBlog.length;

  // formulas-cheat-sheet is a reference sheet, not an interactive calculator
  // (its WebApplication schema was removed for the same reason) — it still
  // belongs in the Calculators listing below, just not in this count, which
  // is why the live site said "35 calculators" when the real figure is 34
  // (the 2026-10-20 audit's finding).
  const calcCount = calculators.filter((p) => p.path !== '/calculators/formulas-cheat-sheet').length;
  const equipCount = equipment.length;

  const header = `# RigFloorHQ

> RigFloorHQ is a free technical and career reference for the oil and gas drilling industry, covering rig operations, well control, drilling equipment, career progression, welding, and safety. Content is written for rig floor crews, engineers, and supervisors. The site has ${calcCount} interactive drilling calculators (well control and pressure, torque and drag, volumetrics, tubular design, and unit conversions) using formulas taught in IWCF/IADC well control certification, and ${equipCount} equipment reference pages. The site is available in English and Spanish (/es), with ${esBlogCount} of ${enBlogCount} English blog posts translated.
`;

  const coreReference = `## Core Reference

- [Home](${home ? home.url : SITE + '/'}): Site overview, career paths, and links into every section.
- [Careers](${SITE}/careers): Rig job roles and hierarchy, from roustabout to company man.
- [Equipment](${SITE}/equipment): Rig types, drill string components, and blowout preventers — ${equipCount} pages.
- [Drilling Operations](${SITE}/drilling): How a well is drilled, well control, mud weight, casing design, directional drilling.
- [Calculators](${SITE}/calculators): ${calcCount} interactive drilling calculators.
- [Welding](${SITE}/welding): Rig welding processes, certifications, and underwater welding.
- [Safety](${SITE}/safety): Rig floor hazards, PPE requirements, and H2S safety.
- [Glossary](${SITE}/glossary): A-Z reference of oilfield terminology.
- [Pillar Guides](${SITE}/pillars): In-depth supervisor- and engineer-level reference guides.
- [Blog](${SITE}/blog): Field notes on well control, careers, and drilling operations — ${enBlogCount} posts.
`;

  const sections = [
    header,
    coreReference,
    section('Pillar Guides', pillars),
    section('Careers', careers),
    section('Equipment', equipment),
    section('Drilling Operations', drilling),
    section('Calculators', calculators),
    section('Welding', welding),
    section('Safety', safety),
    section('Reference', [...glossary, ...quiz, ...about]),
    section('Blog', blog),
  ];

  if (es.length) {
    const esHubs = es.filter((p) =>
      ['/es', '/es/careers', '/es/equipment', '/es/drilling', '/es/calculators', '/es/welding', '/es/safety', '/es/blog'].includes(p.path)
    );
    sections.push(
      `## Spanish (Español)\n\n` +
        `RigFloorHQ has a Spanish section at [/es](${SITE}/es) — ${es.length} of ${pages.length} total pages, including ${esBlogCount} of ${enBlogCount} blog posts. Hub pages:\n\n` +
        esHubs
          .slice()
          .sort((a, b) => a.path.localeCompare(b.path))
          .map((p) => `- [${p.title}](${p.url})`)
          .join('\n') +
        '\n'
    );
  }

  sections.push(
    `## Notes\n\nAll calculator formulas and safety figures are cross-checked against published industry references. Content is for educational and reference purposes; well control decisions should always follow company-approved procedure and certified supervisor guidance. This file is generated at build time from the live sitemap (${pages.length} indexable pages) — see scripts/generate-llms-txt.mjs.\n`
  );

  const out = sections.filter(Boolean).join('\n');
  writeFileSync(join(outDir, 'llms.txt'), out, 'utf8');
  if (logger) logger.info(`llms.txt generated: ${pages.length} pages (${en.length} EN, ${es.length} ES)`);
  else console.log(`[llms.txt] generated: ${pages.length} pages (${en.length} EN, ${es.length} ES)`);
}

// ── llms-full.txt + per-page .md alternates ──────────────────────────────
// Flagged missing by the 2026-10-24 audit's AI Search Readiness section.
// Both are generated from the same real build output llms.txt already reads
// (real <main> content, not a re-typed summary), so neither can drift from
// the actual published page the way a hand-maintained version would.

// Strips the <main>...</main> HTML down to clean, structured plain text:
// headings become Markdown '#'-style lines, block-level tags become
// paragraph breaks, everything else (nav chrome inside main, if any, scripts,
// styles, SVGs) is dropped. Not a full HTML-to-Markdown renderer, but real
// extracted content, not a placeholder.
function extractMainText(html) {
  const mainM = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (!mainM) return '';
  let m = mainM[1];
  m = m.replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ');
  m = m.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n\n# ${stripTags(t)}\n\n`);
  m = m.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n\n## ${stripTags(t)}\n\n`);
  m = m.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n\n### ${stripTags(t)}\n\n`);
  m = m.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `\n- ${stripTags(t)}`);
  m = m.replace(/<\/(p|div|section|tr|details)>/gi, '\n\n');
  m = m.replace(/<br\s*\/?>/gi, '\n');
  m = stripTags(m);
  m = decodeEntities(m);
  m = m.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return m;
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, ' ');
}

export function generateLlmsFullTxt(outDir, logger) {
  const files = walkHtml(outDir).filter((f) => !f.endsWith('404.html'));
  const entries = [];
  for (const f of files) {
    const html = readFileSync(f, 'utf8');
    const page = extractPage(f);
    if (!page) continue;
    const body = extractMainText(html);
    if (!body) continue;
    entries.push({ ...page, body });

    // Per-page Markdown alternate at the same path with a .md extension
    // (e.g. /equipment/bop/ -> /equipment/bop.md), linked from nowhere yet
    // but discoverable the same way *.md crawling conventions expect.
    const mdPath = page.path.replace(/\/$/, '') || '/index';
    const mdFile = join(outDir, `${mdPath}.md`);
    const mdContent = `# ${page.title}\n\n${page.description}\n\n${body}\n`;
    try {
      writeFileSync(mdFile, mdContent, 'utf8');
    } catch {
      // Directory for this path doesn't exist in dist/ (shouldn't happen for
      // a real page) -- skip rather than fail the whole build over one page.
    }
  }

  entries.sort((a, b) => a.path.localeCompare(b.path));
  const out = entries
    .map((e) => `---\n\nURL: ${e.url}\nTitle: ${e.title}\n\n${e.body}\n`)
    .join('\n');
  const header = `# RigFloorHQ — Full Content\n\nComplete text content of every indexable page on rigfloorhq.com, generated at build time from the real rendered output (not a hand-maintained summary). See /llms.txt for a shorter, linked index instead.\n\n`;
  writeFileSync(join(outDir, 'llms-full.txt'), header + out, 'utf8');
  if (logger) logger.info(`llms-full.txt generated: ${entries.length} pages`);
  else console.log(`[llms-full.txt] generated: ${entries.length} pages`);
}
