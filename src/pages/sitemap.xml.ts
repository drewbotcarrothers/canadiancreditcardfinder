import type { APIRoute } from 'astro';
import { getCards } from '../lib/data';
import { getGuides, guidePath } from '../lib/guides';
import { getStackPersonas, stackPath } from '../lib/stacks';
import { HUBS } from '../lib/hubs';
import { getIssuerHubSlugs } from '../lib/issuers';
import { isIndexableIssuer } from '../lib/issuerGuides';
import { lastModified, latestDate, reviewSourceFile } from '../lib/contentDates';

// Per-page <lastmod> from the git history of each page's own source files. Falls back to the
// build time only when git history is unavailable (e.g. a shallow deploy clone).
const buildTime = new Date();
const dateOf = (...files: (string | null)[]) =>
    (latestDate(...files.map((file) => (file ? lastModified(file) : null))) ?? buildTime).toISOString();

export const GET: APIRoute = async ({ site }) => {
    const [cards, guides, personas] = await Promise.all([getCards(), getGuides(), Promise.resolve(getStackPersonas())]);
    const baseUrl = (site?.origin || 'https://canadiancreditcardfinder.com').replace(/\/$/, '');

    const urls = [
        { loc: `${baseUrl}/`, lastmod: buildTime.toISOString(), changefreq: 'daily', priority: '1.0' },
        { loc: `${baseUrl}/finder/`, lastmod: dateOf('src/pages/finder.astro', 'src/components/FinderContent.tsx'), changefreq: 'weekly', priority: '0.9' },
        { loc: `${baseUrl}/guides/`, lastmod: dateOf('src/pages/guides/index.astro', ...guides.map((g) => `src/content/guides/${g.id}.md`)), changefreq: 'weekly', priority: '0.9' },
        { loc: `${baseUrl}/stacks/`, lastmod: dateOf('src/pages/stacks/index.astro', 'src/lib/stacks.ts'), changefreq: 'weekly', priority: '0.9' },
        ...personas.map((persona) => ({
            loc: `${baseUrl}${stackPath(persona.slug)}`,
            lastmod: dateOf('src/lib/stacks.ts'),
            changefreq: 'weekly',
            priority: '0.8',
        })),
        ...HUBS.map((hub) => ({
            loc: `${baseUrl}/best/${hub.slug}/`,
            lastmod: dateOf('src/lib/hubs.ts', 'src/pages/best/[useCase].astro'),
            changefreq: 'weekly',
            priority: '0.9',
        })),
        ...['mastercard', 'visa'].map((slug) => ({
            loc: `${baseUrl}/best/${slug}/`,
            lastmod: dateOf('src/lib/networkPages.ts', 'src/lib/networkAndOffers.ts', 'src/components/NetworkBestPage.astro'),
            changefreq: 'weekly',
            priority: '0.9',
        })),
        // Rebuilt from current welcome offers on every build, so its lastmod is the build time.
        { loc: `${baseUrl}/credit-card-offers/`, lastmod: buildTime.toISOString(), changefreq: 'daily', priority: '0.9' },
        // Bank pages with editorial content are indexable. Other issuer hubs and /compare/ stay noindex and out of the sitemap.
        ...getIssuerHubSlugs()
            .filter(isIndexableIssuer)
            .map((slug) => ({
                loc: `${baseUrl}/issuer/${slug}/`,
                lastmod: dateOf('src/lib/issuers.ts', 'src/lib/issuerGuides.ts', 'src/pages/issuer/[issuer].astro'),
                changefreq: 'weekly',
                priority: '0.8',
            })),
        ...guides.map((guide) => ({
            loc: `${baseUrl}${guidePath(guide)}`,
            lastmod: (latestDate(lastModified(`src/content/guides/${guide.id}.md`), guide.data.updatedAt) ?? guide.data.publishedAt ?? buildTime).toISOString(),
            changefreq: 'weekly',
            priority: '0.8',
        })),
        ...cards.map((card) => ({
            loc: `${baseUrl}/card/${card.slug}/`,
            lastmod: dateOf(reviewSourceFile(card.slug), 'src/lib/publishedCardFacts.ts'),
            changefreq: 'weekly',
            priority: '0.8',
        })),
        { loc: `${baseUrl}/about/`, lastmod: dateOf('src/pages/about/index.astro'), changefreq: 'monthly', priority: '0.5' },
        { loc: `${baseUrl}/contact/`, lastmod: dateOf('src/pages/contact/index.astro'), changefreq: 'yearly', priority: '0.3' },
        { loc: `${baseUrl}/editorial-policy/`, lastmod: dateOf('src/pages/editorial-policy/index.astro'), changefreq: 'monthly', priority: '0.5' },
        { loc: `${baseUrl}/advertising-disclosure/`, lastmod: dateOf('src/pages/advertising-disclosure/index.astro'), changefreq: 'yearly', priority: '0.3' },
        { loc: `${baseUrl}/privacy/`, lastmod: dateOf('src/pages/privacy/index.astro'), changefreq: 'yearly', priority: '0.3' },
        { loc: `${baseUrl}/terms/`, lastmod: dateOf('src/pages/terms/index.astro'), changefreq: 'yearly', priority: '0.3' },
    ];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
        (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
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
