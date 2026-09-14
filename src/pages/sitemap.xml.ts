import type { APIRoute } from 'astro';
import { getCards } from '../lib/data';

export const GET: APIRoute = async ({ site }) => {
    const cards = await getCards();
    const baseUrl = (site?.origin || 'https://canadiancreditcardfinder.com').replace(/\/$/, '');
    const lastModified = new Date().toISOString();

    const urls = [
        { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0' },
        { loc: `${baseUrl}/compare/`, changefreq: 'weekly', priority: '0.9' },
        ...cards.map((card) => ({
            loc: `${baseUrl}/card/${card.slug}/`,
            changefreq: 'weekly',
            priority: '0.8',
        })),
    ];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
        (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n')}
</urlset>
`;

    return new Response(body, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
};
