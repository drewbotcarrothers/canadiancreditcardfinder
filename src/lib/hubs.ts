import type { CreditCard } from './types';

export const HUB_SLUGS = ['travel', 'cash-back', 'no-annual-fee'] as const;

export type HubSlug = (typeof HUB_SLUGS)[number];

export interface HubDefinition {
    slug: HubSlug;
    title: string;
    h1: string;
    description: string;
    intro: string;
    navLabel: string;
    teaser: string;
}

const KNOWN_CATEGORY = /^(rewards|cash\s*back|cashback|travel|low\s*interest|student|us)$/i;
const TRAVEL_CATEGORY = /travel/i;
const TRAVEL_PROGRAM =
    /aeroplan|aventura|avion|westjet|marriott|bonvoy|passport|viporter|odyssey|air\s*miles/i;
const CASH_BACK_CATEGORY = /cash[\s-]?back|cashback|money[\s-]?back/i;

export const HUBS: HubDefinition[] = [
    {
        slug: 'travel',
        title: 'Best Travel Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best Travel Credit Cards in Canada (2026)',
        description:
            'Compare the best travel credit cards in Canada for 2026. See fees, welcome bonuses, and Aeroplan, WestJet, and hotel rewards with full card reviews.',
        intro:
            'Choosing a travel credit card in Canada usually comes down to how you fly and how you redeem points. Airline-branded cards can be a strong fit if you already use that program, while hotel and flexible rewards cards may suit mixed travel. Weigh the annual fee against welcome bonuses, travel insurance, and lounge or companion benefits before you apply. The cards below come from our current Canadian card data and are categorized as travel — or, when the category is missing, matched by a well-known travel rewards program.',
        navLabel: 'Travel',
        teaser: 'Airline, hotel, and flexible travel rewards',
    },
    {
        slug: 'cash-back',
        title: 'Best Cash Back Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best Cash Back Credit Cards in Canada (2026)',
        description:
            'Compare the best cash back credit cards in Canada for 2026. See no-fee and premium cash-back cards, welcome bonuses, and full reviews.',
        intro:
            'Cash back credit cards return a percentage of what you spend, typically as a statement credit. They are often the simplest rewards option in Canada if you would rather not track points or airline programs. Compare bonus categories such as groceries and gas, how cash back is redeemed, and whether a higher annual fee is worth the extra earning rate. This list includes cards in our data whose category is cash back.',
        navLabel: 'Cash Back',
        teaser: 'Statement credits on everyday spending',
    },
    {
        slug: 'no-annual-fee',
        title: 'Best No Annual Fee Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best No Annual Fee Credit Cards in Canada (2026)',
        description:
            'Compare the best no annual fee credit cards in Canada for 2026. Browse $0-fee cash back, travel, and rewards cards with current fees and bonuses.',
        intro:
            'No annual fee credit cards charge $0 per year to keep the account open. That can make them a practical everyday card, a student option, or a complement to a premium travel card. Compare earning rates, welcome bonuses, and purchase interest rates — a $0 fee does not automatically mean the best overall value. The cards below currently show a $0 annual fee in our data.',
        navLabel: 'No Annual Fee',
        teaser: 'Cards that currently list a $0 annual fee',
    },
];

const hubsBySlug = Object.fromEntries(HUBS.map((hub) => [hub.slug, hub])) as Record<
    HubSlug,
    HubDefinition
>;

export function isHubSlug(value: string): value is HubSlug {
    return (HUB_SLUGS as readonly string[]).includes(value);
}

export function getHubSlugs(): HubSlug[] {
    return [...HUB_SLUGS];
}

export function getHubBySlug(slug: HubSlug): HubDefinition {
    return hubsBySlug[slug];
}

function isMessyCategory(category: string): boolean {
    const trimmed = category.trim();
    return !trimmed || !KNOWN_CATEGORY.test(trimmed);
}

export function isTravelCard(card: CreditCard): boolean {
    if (TRAVEL_CATEGORY.test(card.category)) {
        return true;
    }

    if (isMessyCategory(card.category)) {
        return TRAVEL_PROGRAM.test(`${card.creditCardName} ${card.rewardsProgram}`);
    }

    return false;
}

export function isCashBackCard(card: CreditCard): boolean {
    if (CASH_BACK_CATEGORY.test(card.category)) {
        return true;
    }

    if (isMessyCategory(card.category)) {
        return CASH_BACK_CATEGORY.test(`${card.creditCardName} ${card.rewardsProgram}`);
    }

    return false;
}

export function isNoAnnualFeeCard(card: CreditCard): boolean {
    return Number.isFinite(card.annualFee) && card.annualFee === 0;
}

export function filterCardsForHub(cards: CreditCard[], slug: HubSlug): CreditCard[] {
    switch (slug) {
        case 'travel':
            return cards.filter(isTravelCard);
        case 'cash-back':
            return cards.filter(isCashBackCard);
        case 'no-annual-fee':
            return cards.filter(isNoAnnualFeeCard);
    }
}
