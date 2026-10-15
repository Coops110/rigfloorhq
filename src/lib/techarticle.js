// TechArticle JSON-LD builder for equipment reference pages.
//
// datePublished and dateModified both come from the page's own git lastmod —
// the last commit that touched its source file (see scripts/git-lastmod.mjs,
// the same map the sitemap's <lastmod> is built from). That's the only real
// per-page date this site tracks; there's no separate "originally published"
// timestamp recorded anywhere, so inventing a different value for
// datePublished would be a false signal, not a more accurate one. A page
// whose file has no resolvable git history gets neither field rather than a
// guessed date.
import { buildGitLastmodMap } from '../../scripts/git-lastmod.mjs';

const siteUrl = 'https://rigfloorhq.com';

// Computed once per build process. Every page importing this module gets the
// same cached Map back (module resolution is cached by resolved path), so
// `git log` runs once for the whole build rather than once per page.
const lastmodMap = buildGitLastmodMap();

/**
 * @param {Object} opts
 * @param {string} opts.sourcePath repo-relative path to the page's own source
 *   file, e.g. 'src/pages/equipment/bop.astro'
 * @param {string} opts.path site-relative URL path, e.g. '/equipment/bop'
 * @param {string} opts.headline
 * @param {string} opts.description
 * @param {'en'|'es'} [opts.lang]
 */
export function techArticleSchema({ sourcePath, path, headline, description, lang = 'en' }) {
  const date = lastmodMap ? lastmodMap.get(sourcePath) : undefined;
  const url = `${siteUrl}${path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(date ? { datePublished: date, dateModified: date } : {}),
    inLanguage: lang,
    author: { '@id': `${siteUrl}/#organization` },
    publisher: { '@id': `${siteUrl}/#organization` },
  };
}
