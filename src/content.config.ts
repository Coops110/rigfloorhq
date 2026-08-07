import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.string(),
  modifiedDate: z.string().optional(),
  author: z.string().default('RigFloorHQ Team'),
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
  // Question and answer pairs, rendered as FAQPage structured data. These must
  // match questions actually answered in the body — marking up content that is
  // not on the page is a structured data violation, not a shortcut.
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
