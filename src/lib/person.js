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
 * A reviewedBy reference to Jabin, inlined rather than a bare @id. A bare
 * {"@id": ...} pointing at a Person defined only on a different URL is a
 * dangling reference from the point of view of the page it's on -- each
 * HTML document's JSON-LD is parsed on its own, so an @id with no matching
 * node in that same document doesn't resolve. Inlining name/url/jobTitle
 * here keeps every citing page self-contained while the @id stays the same
 * stable identifier everywhere, so it's still unambiguously the same real
 * person; the full bio/credentials record still lives only on
 * src/pages/about/jabin-travis.astro.
 *
 * Callers must also add their own `lastReviewed` property as a sibling of
 * `reviewedBy` on the WebPage/Article node (not here -- it belongs to the
 * content being reviewed, not to the reviewer), set to the real date
 * reviewedBy was actually added for that specific page (check git blame),
 * never today's date or a deploy timestamp.
 */
export function reviewedByJabin() {
  return {
    '@type': 'Person',
    '@id': JABIN_PERSON_ID,
    name: 'Jabin Travis',
    url: `${siteUrl}/about/jabin-travis`,
    jobTitle: 'Drilling Operations Supervisor',
  };
}

// Chris Cooper, RigFloorHQ's founder and the site's real author entity —
// same pattern as JABIN_PERSON_ID above. Full bio lives on
// src/pages/about/chris-cooper.astro; everywhere else references this @id.
// No `sameAs` yet: unlike Jabin's credentials, Chris hasn't supplied a real
// LinkedIn/GitHub profile to link, so none is fabricated here. Add one only
// once he gives a real URL.
export const CHRIS_PERSON_ID = `${siteUrl}/about/chris-cooper#person`;

/** Author reference to Chris Cooper, inlined for the same reason reviewedByJabin() is. */
export function authorChrisCooper() {
  return {
    '@type': 'Person',
    '@id': CHRIS_PERSON_ID,
    name: 'Chris Cooper',
    url: `${siteUrl}/about/chris-cooper`,
    jobTitle: 'Founder',
  };
}
