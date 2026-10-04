import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { HUB_SLUGS } from './lib/hubs';

const guides = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        excerpt: z.string(),
        primaryKeyword: z.string(),
        publishedAt: z.coerce.date(),
        updatedAt: z.coerce.date().optional(),
        sortOrder: z.number(),
        hubLinks: z.array(
            z.object({
                href: z.string(),
                label: z.string(),
            })
        ),
        relatedCardSlugs: z.array(z.string()).min(2).max(4),
        /** Render the full live card list for this hub on the guide (used when a /best/ hub was merged into the guide). */
        hubCardList: z.enum(HUB_SLUGS).optional(),
    }),
});

export const collections = { guides };
