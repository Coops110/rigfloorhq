import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.string(),
  modifiedDate: z.string().optional(),
  author: z.string().default('RigFloorHQ Team'),
  // True when the post's content (not just its author byline) has been
  // checked for technical accuracy by Jabin Travis, RigFloorHQ's working-
  // driller reviewer. Drives the reviewedBy field in this post's JSON-LD,
  // see src/lib/person.js. Separate from `author` because a post can be
  // written by "RigFloorHQ Team" and still be reviewed by Jabin, or (as
  // with his own firsthand posts) authored by him directly, in which case
  // this flag is unnecessary: he's already the author entity.
  reviewedByJabin: z.boolean().default(false),
  // Real date reviewedByJabin was set true for this post (check git blame),
  // not today's date or a deploy timestamp. Emitted as lastReviewed
  // alongside reviewedBy in this post's JSON-LD.
  reviewedDate: z.string().optional(),
  category: z.string().default('Industry'),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  // Keeps a post published and linkable but out of the index. For posts that
  // exist for readers who are already here — announcements, housekeeping —
  // rather than to answer a search. Also drops the URL from the sitemap.
  noindex: z.boolean().default(false),
  // Social share image for this post. Falls back to /og-default.png when unset
  // or when set to an SVG, because social scrapers do not render SVG previews.
  // Must be a real file in public/ — a broken og:image is worse than none,
  // since some scrapers abandon the preview entirely rather than falling back.
  image: z.string().optional(),
  // Question and answer pairs, rendered as the visible FAQ section on the
  // post. No longer emitted as FAQPage structured data — Google retired the
  // FAQ rich-result feature on 2026-05-07, so that markup was removed site-wide.
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  // Diagrams in this post that other sites may republish. Each one renders an
  // embed block with a copy-paste snippet crediting back to the post.
  // Declared explicitly rather than parsed out of the body, so an image is
  // only offered for reuse when that is intended.
  diagrams: z.array(z.object({
    src: z.string(),
    alt: z.string(),
    title: z.string(),
  })).default([]),
  // Keys into src/lib/citations.js's CITATIONS map, rendered as a visible
  // Sources & Standards block (src/components/SourcesStandards.astro) —
  // the same citation-gap fix already shipped on the well-control, H2S,
  // pillar and pressure-calculator pages. Optional and per-post on purpose:
  // only posts that actually discuss a named standard get the block: a
  // math-derivation post like "why 0.052 never changes" cites nothing.
  sources: z.array(z.string()).default([]),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: blogSchema,
});

const blogEs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog-es' }),
  schema: blogSchema,
});

export const collections = { blog, blogEs };
