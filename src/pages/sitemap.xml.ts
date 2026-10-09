import type { APIRoute } from 'astro';
import { getCards } from '../lib/data';
import { getGuides, guidePath } from '../lib/guides';
import { getStackPersonas, stackPath } from '../lib/stacks';
import { HUBS } from '../lib/hubs';

export const GET: APIRoute = async ({ site }) => {
    const [cards, guides, personas] = await Promise.all([getCards(), getGuides(), Promise.resolve(getStackPersonas())]);
    const baseUrl = (site?.origin || 'https://canadiancreditcardfinder.com').replace(/\/$/, '');
    const lastModified = new Date().toISOString();

    const urls = [
        { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0' },
        { loc: `${baseUrl}/finder/`, changefreq: 'weekly', priority: '0.9' },
        { loc: `${baseUrl}/guides/`, changefreq: 'weekly', priority: '0.9' },
        { loc: `${baseUrl}/stacks/`, changefreq: 'weekly', priority: '0.9' },
        ...personas.map((persona) => ({
            loc: `${baseUrl}${stackPath(persona.slug)}`,
            changefreq: 'weekly',
            priority: '0.8',
        })),
        ...HUBS.map((hub) => ({
            loc: `${baseUrl}/best/${hub.slug}/`,
            changefreq: 'weekly',
            priority: '0.9',
        })),
        // Issuer hubs and /compare/ are noindex (thin listing / empty-state tool screens), so they stay out of the sitemap.
        ...guides.map((guide) => ({
            loc: `${baseUrl}${guidePath(guide)}`,
            changefreq: 'weekly',
            priority: '0.8',
        })),
        ...cards.map((card) => ({
            loc: `${baseUrl}/card/${card.slug}/`,
            changefreq: 'weekly',
            priority: '0.8',
        })),
        { loc: `${baseUrl}/about/`, changefreq: 'monthly', priority: '0.5' },
        { loc: `${baseUrl}/contact/`, changefreq: 'yearly', priority: '0.3' },
        { loc: `${baseUrl}/privacy/`, changefreq: 'yearly', priority: '0.3' },
        { loc: `${baseUrl}/terms/`, changefreq: 'yearly', priority: '0.3' },
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
