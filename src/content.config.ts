import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const guides = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
    schema: z.object({
        title: z.string(),
        /** Optional <title> override (~60 characters) when the H1 is longer than search results show. */
        metaTitle: z.string().optional(),
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
        /** Optional "Just want the list?" callout pointing at the /best/ hub that owns the list intent. */
        listHub: z
            .object({
                href: z.string(),
                label: z.string(),
            })
            .optional(),
        relatedCardSlugs: z.array(z.string()).min(2).max(4),
    }),
});

export const collections = { guides };
