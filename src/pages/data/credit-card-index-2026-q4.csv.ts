import type { APIRoute } from 'astro';
import { buildCardIndex, cardIndexToCsv } from '../../lib/cardIndex';
import { getCards } from '../../lib/data';

export const GET: APIRoute = async ({ site }) => {
    const index = buildCardIndex(await getCards(), site ?? 'https://canadiancreditcardfinder.com');
    return new Response(cardIndexToCsv(index.rows), {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="credit-card-index-2026-q4.csv"',
        },
    });
};
