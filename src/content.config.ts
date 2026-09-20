import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
    }),
});

export const collections = { guides };
