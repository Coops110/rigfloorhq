/**
 * Guards the CSP `script-src` policy in vercel.json, which no longer allows
 * 'unsafe-inline'. Scans the full built dist/ output for any inline
 * EXECUTABLE <script> tag — one with no src attribute — that is not one of
 * the small, explicitly-known, sitewide-identical scripts already allowed
 * into the CSP via a sha256 hash (see ALLOWED_INLINE_SCRIPT_HASHES below,
 * which must stay in sync with the script-src line in vercel.json).
 *
 * Why this exists: every calculator used to carry its own inline <script>
 * with calculator-specific logic. A hash-based CSP allowlist for that would
 * need 20+ entries and would silently break production the moment anyone
 * edited a calculator's script without remembering to recompute its hash.
 * All of those scripts (plus the mobile-nav toggle, the cookie consent
 * banner, the tool image gallery, the diagram embed-code copy button, and
 * the well-control quiz) have been externalized to public/scripts/ and are
 * referenced via <script src="...">, which 'self' already covers with no
 * hash needed. This script is what makes that fact permanent: if anyone
 * (human or AI) ever adds a new inline <script> to any page — a calculator
 * or otherwise — without externalizing it, this fails the build instead of
 * silently shipping a CSP violation that breaks the script in production.
 *
 * <script type="application/ld+json"> and <script type="application/json">
 * are data blocks, not executable code — CSP's script-src does not govern
 * them, so they are deliberately ignored here.
 *
 * Must run against a real dist/ build (see package.json's postbuild chain).
 * Exits non-zero and prints every offending file/line if it finds anything
 * unexpected, so the deploy actually fails rather than warns.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');

// Keep this in sync with the script-src line in vercel.json. Every entry is
// one of the 3 small, sitewide-identical, define:vars-dependent scripts in
// src/layouts/BaseLayout.astro (GA consent-mode bootstrap, the gtag.js
// idle-loader, and the +/- number-input stepper) — all three are byte
// identical on every page, which is what makes hashing them cheap to
// maintain instead of externalizing them.
const ALLOWED_INLINE_SCRIPT_HASHES = new Set([
  'sha256-vsqpZLGrisMaElu7SUdUsEb5tPqyySOafGzvqcwi90Y=',
  'sha256-zBXAj3xYmIuhWuiClzeJz6vHUg8jVKrYqRwyFVhe+PY=',
  'sha256-CAy8X8yXpAkXCoBVIuNiRbwuK1h4jVQqlQJ3CH3XO+g=',
]);

// Non-executable data blocks — CSP script-src does not apply to these types,
// so an inline one here is never a violation regardless of content.
const NON_EXECUTABLE_SCRIPT_TYPES = /^(application\/ld\+json|application\/json)$/i;

function collectHtmlFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectHtmlFiles(full, out);
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function lineNumberAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) {
    if (text.charCodeAt(i) === 10) line++;
  }
  return line;
}

function sha256Base64(text) {
  return 'sha256-' + createHash('sha256').update(text, 'utf8').digest('base64');
}

function getAttr(attrString, name) {
  const re = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i');
  const m = attrString.match(re);
  if (!m) return null;
  return m[2] !== undefined ? m[2] : m[3];
}

export function scanDist(distDir = DIST_DIR) {
  if (!existsSync(distDir) || !statSync(distDir).isDirectory()) {
    throw new Error(`dist/ not found at ${distDir} — did the build run before this check?`);
  }

  const htmlFiles = collectHtmlFiles(distDir);
  if (!htmlFiles.length) {
    throw new Error(`no .html files found under ${distDir} — build produced nothing to check`);
  }

  const scriptTagRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  // Inline event-handler attributes (onclick=, onsubmit=, etc.) are just as
  // much "inline executable script" as a <script> body with no src — CSP's
  // script-src blocks both the same way — but the loop above never looks at
  // ordinary tags, so onclick="window.print()" on a <button> slipped past
  // this check entirely until a live CSP console error caught it (2026-10-23:
  // the Footer cookie-settings button, the kill-sheet print button, and the
  // newsletter form's onsubmit all had this and had been silently broken in
  // production). This regex catches any tag carrying an onXxx= attribute.
  const inlineHandlerRe = /<[a-zA-Z][^>]*\son[a-zA-Z]+\s*=\s*("[^"]*"|'[^']*')[^>]*>/g;
  const violations = [];
  let scannedScriptTags = 0;

  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    let match;
    while ((match = scriptTagRe.exec(html)) !== null) {
      const [fullTag, attrs, body] = match;
      scannedScriptTags++;

      if (/\ssrc\s*=/i.test(attrs)) continue; // external — not inline, always fine

      const type = getAttr(attrs, 'type');
      if (type && NON_EXECUTABLE_SCRIPT_TYPES.test(type)) continue; // data block, not code

      const hash = sha256Base64(body);
      if (ALLOWED_INLINE_SCRIPT_HASHES.has(hash)) continue; // known, hashed sitewide exception

      violations.push({
        file: relative(process.cwd(), file),
        line: lineNumberAt(html, match.index),
        hash,
        preview: body.trim().slice(0, 100).replace(/\s+/g, ' '),
      });
    }
    while ((match = inlineHandlerRe.exec(html)) !== null) {
      violations.push({
        file: relative(process.cwd(), file),
        line: lineNumberAt(html, match.index),
        hash: null,
        preview: match[0].trim().slice(0, 100).replace(/\s+/g, ' '),
      });
    }
  }

  return { htmlFileCount: htmlFiles.length, scannedScriptTags, violations };
}

function main() {
  let result;
  try {
    result = scanDist();
  } catch (err) {
    console.error(`[check-no-inline-scripts] ERROR: ${err.message}`);
    process.exit(1);
  }

  const { htmlFileCount, scannedScriptTags, violations } = result;

  if (violations.length) {
    console.error(
      `[check-no-inline-scripts] FAILED: found ${violations.length} inline <script> tag(s) ` +
        `not covered by CSP's script-src (no src=, not a known hashed exception, not a data block).`
    );
    console.error(
      `[check-no-inline-scripts] This means script-src 'unsafe-inline' would silently need to come ` +
        `back, or the script must be moved to an external file under public/scripts/ and referenced ` +
        `via <script src="...">. See src/pages/calculators/README.md.`
    );
    for (const v of violations) {
      console.error(`  - ${v.file}:${v.line}${v.hash ? `  [${v.hash}]` : ''}`);
      console.error(`      ${v.preview}`);
    }
    process.exit(1);
  }

  console.log(
    `[check-no-inline-scripts] OK: scanned ${scannedScriptTags} <script> tag(s) across ${htmlFileCount} ` +
      `HTML file(s) in dist/ — no unexpected inline executable scripts found.`
  );
  process.exit(0);
}

// Only run as a CLI when invoked directly (not when imported, e.g. by tests).
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
