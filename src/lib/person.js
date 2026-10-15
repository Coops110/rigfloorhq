// Shared Person schema for Jabin Travis, RigFloorHQ's technical reviewer.
// Mirrors the house pattern already used for the
// Organization @id in BaseLayout.astro and for TechArticle in techarticle.js:
// one stable identifier, referenced by @id from every page that needs it,
// rather than a fresh Person object re-typed (and able to drift) on each
// page that mentions him.
//
// The full Person record this @id resolves to lives on the dedicated profile
// page, src/pages/about/jabin-travis.astro. That page is the only place his
// name, jobTitle, credentials and bio are typed out in full; everywhere else
// just references this @id.
//
// Same @id is used on both the English and Spanish profile pages: it is the
// same real person regardless of which language is rendering the page, which
// matches how the Organization @id in BaseLayout.astro is not localized
// either. Only the page content and URL differ between languages, not the
// identity being described.
const siteUrl = 'https://rigfloorhq.com';

export const JABIN_PERSON_ID = `${siteUrl}/about/jabin-travis#person`;

/**
 * A reviewedBy reference pointing at Jabin's stable Person @id. Use as a
 * sibling field next to author/publisher in a page's existing JSON-LD,
 * same @id-reference pattern this site already uses for the Organization,
 * e.g. `author: { "@id": \`${siteUrl}/#organization\` }` in techarticle.js.
 */
export function reviewedByJabin() {
  return { '@id': JABIN_PERSON_ID };
}
