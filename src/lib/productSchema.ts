import type { CreditCard } from './types';
import { cardImageSrc } from './cardImage';

/** Google Merchant listings: keep Product.description short plain text. */
export const PRODUCT_DESCRIPTION_MAX_LENGTH = 300;

const HTML_ENTITIES: Record<string, string> = {
    '&amp;': '&',
    '&nbsp;': ' ',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&lt;': '',
    '&gt;': '',
};

/**
 * Turn editorial/sheet text into schema-safe plain text:
 * no HTML, no markdown links/emphasis, no `%%` placeholders and no
 * internal "verify ..." working notes, collapsed whitespace.
 */
export function sanitizeSchemaText(input: string | null | undefined): string {
    let text = String(input ?? '');
    text = text.replace(/<[^>]*>/g, ' ');
    text = text.replace(/&[a-z#0-9]+;/gi, (m) => HTML_ENTITIES[m.toLowerCase()] ?? ' ');
    text = text.replace(/[<>]/g, ' ');
    // Markdown links [label](url) -> label; drop emphasis/code markers.
    text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
    text = text.replace(/[*_`#]+/g, '');
    // Working notes: %%...%% blocks, then any stray %% markers.
    text = text.replace(/%%[^%]*%%/g, ' ').replace(/%%/g, ' ');
    // Drop bracketed/parenthesised or whole sentences that are "verify" notes.
    text = text.replace(/[([][^)\]]*\bverify\b[^)\]]*[)\]]/gi, ' ');
    text = text
        .split(/(?<=[.!?])\s+/)
        .filter((sentence) => !/\bverify\b/i.test(sentence))
        .join(' ');
    text = text.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
    text = text.replace(/^[,.;:\s-]+/, '').trim();
    return text;
}

export function truncateSchemaText(text: string, max = PRODUCT_DESCRIPTION_MAX_LENGTH): string {
    if (text.length <= max) return text;
    const slice = text.slice(0, max - 1);
    const cut = slice.lastIndexOf(' ');
    const base = (cut > max * 0.6 ? slice.slice(0, cut) : slice).replace(/[\s,;:.-]+$/, '');
    return `${base}…`;
}

function clause(value: string | null | undefined): string {
    return sanitizeSchemaText(value).replace(/[.;\s]+$/, '');
}

/** Data-driven fallback, e.g. "Card by Issuer: $0 annual fee, 2% cash back rewards, 19.95% purchase rate." */
export function buildCardDataDescription(card: CreditCard): string {
    const name = clause(card.creditCardName) || 'Credit card';
    const issuer = clause(card.issuer);
    const fee = clause(card.annualFeeDisplay) || (Number.isFinite(card.annualFee) ? `$${card.annualFee}` : '');
    const rewards = clause(card.rewardsProgram) || clause(card.category);
    const rate = clause(card.purchaseInterestRateDisplay);

    const parts: string[] = [];
    if (fee) parts.push(`${fee} annual fee`);
    if (rewards) parts.push(/rewards?$/i.test(rewards) ? rewards : `${rewards} rewards`);
    if (rate) parts.push(`${rate} purchase rate`);

    const head = issuer ? `${name} by ${issuer}` : name;
    return parts.length > 0 ? `${head}: ${parts.join(', ')}.` : `${head} credit card for Canadians.`;
}

/**
 * Non-empty plain-text Product.description (<= 300 chars).
 * Prefers the editorial meta description, falls back to card data.
 */
export function buildCardProductDescription(card: CreditCard, preferred?: string | null): string {
    const fromPreferred = sanitizeSchemaText(preferred);
    const text = fromPreferred.length >= 40 ? fromPreferred : buildCardDataDescription(card);
    const final = truncateSchemaText(text);
    return final || `${card.creditCardName || 'Credit card'} credit card for Canadians.`;
}

/** Product JSON-LD for a card; every object has name, description, image, brand and offers. */
export function buildCardProductJsonLd(
    card: CreditCard,
    site: URL | string | undefined,
    preferredDescription?: string | null,
) {
    const base = site ?? 'https://canadiancreditcardfinder.com';
    const url = new URL(`/card/${card.slug}/`, base).href;
    const image = new URL(cardImageSrc(card.imageFile), base).href;
    const price = Number.isFinite(card.annualFee) ? card.annualFee : 0;

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: sanitizeSchemaText(card.creditCardName) || card.creditCardName,
        description: buildCardProductDescription(card, preferredDescription),
        image,
        url,
        brand: {
            '@type': 'Brand',
            name: sanitizeSchemaText(card.issuer) || card.issuer,
        },
        category: 'Credit Card',
        offers: {
            '@type': 'Offer',
            url,
            price: price.toString(),
            priceCurrency: 'CAD',
            availability: 'https://schema.org/InStock',
        },
    };
}
