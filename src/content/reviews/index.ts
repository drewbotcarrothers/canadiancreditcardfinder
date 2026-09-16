import type { CreditCard } from '../../lib/types';
import {
    getHubBySlug,
    getMatchingHubsForCard,
    type HubDefinition,
} from '../../lib/hubs';
import type { CardEditorialReview } from './types';

import americanExpressAeroplanCard from './american-express-aeroplan-card';
import americanExpressAeroplanReserveCard from './american-express-aeroplan-reserve-card';
import americanExpressCobaltCard from './american-express-cobalt-card';
import americanExpressGoldRewardsCard from './american-express-gold-rewards-card';
import bmoCashbackWorldEliteMastercard from './bmo-cashback-world-elite-mastercard';
import rogersRedWorldEliteMastercard from './rogers-red-world-elite-mastercard';
import scotiabankPassportVisaInfiniteCard from './scotiabank-passport-visa-infinite-card';
import tdAeroplanVisaInfiniteCard from './td-aeroplan-visa-infinite-card';
import tdAeroplanVisaInfinitePrivilegeCreditCard from './td-aeroplan-visa-infinite-privilege-credit-card';
import thePlatinumCard from './the-platinum-card';

const REVIEW_LIST: CardEditorialReview[] = [
    americanExpressCobaltCard,
    americanExpressGoldRewardsCard,
    thePlatinumCard,
    americanExpressAeroplanCard,
    americanExpressAeroplanReserveCard,
    tdAeroplanVisaInfiniteCard,
    tdAeroplanVisaInfinitePrivilegeCreditCard,
    scotiabankPassportVisaInfiniteCard,
    rogersRedWorldEliteMastercard,
    bmoCashbackWorldEliteMastercard,
];

const reviewsBySlug = new Map(REVIEW_LIST.map((review) => [review.slug, review]));

for (const review of REVIEW_LIST) {
    if (review.faqs.length < 3 || review.faqs.length > 5) {
        throw new Error(`${review.slug} must have 3–5 FAQ items`);
    }
    if (review.relatedCardSlugs.includes(review.slug)) {
        throw new Error(`${review.slug} cannot list itself as a related card`);
    }
}

export function getCardEditorialReview(slug: string): CardEditorialReview | null {
    return reviewsBySlug.get(slug) ?? null;
}

export function getReviewHubs(card: CreditCard, review: CardEditorialReview): HubDefinition[] {
    const hubs = new Map<string, HubDefinition>();

    for (const hub of getMatchingHubsForCard(card)) {
        hubs.set(hub.slug, hub);
    }

    for (const slug of review.extraHubSlugs ?? []) {
        hubs.set(slug, getHubBySlug(slug));
    }

    return [...hubs.values()];
}

export type { CardEditorialReview, ReviewFaq } from './types';
