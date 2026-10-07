import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One file per position. Frontmatter = facts; body = the bullets/summary we refine together.
const positions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/positions' }),
  schema: z.object({
    lab: z.string(),
    org: z.string(),
    role: z.string(),
    advisor: z.string().optional(),
    start: z.string().optional(),
    end: z.string().default('Present'),
    order: z.number(),
    tags: z.array(z.string()).default([]),
    // true until the bullets have been written by Arnav and refined
    draft: z.boolean().default(true),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
  }),
});

export const collections = { positions };
