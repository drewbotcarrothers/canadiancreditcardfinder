import type { CreditCard } from './types';
import {
    isCashBackCard,
    isLowInterestCard,
    isNoAnnualFeeCard,
    isPremiumCard,
    isRewardsCard,
    isStudentCard,
    isTravelCard,
    isUsDollarCard,
} from './hubs';
import { estimateWelcomeFeeMath } from './reviewMath';
import { parseBonusValue } from './utils';

/**
 * Rules for the data-built pages that are not /best/[useCase] hubs:
 * /best/mastercard/, /best/visa/ and /credit-card-offers/.
 * Everything here is derived from the card records at build time, so the pages
 * refresh on every build. Copy strings must stay public-facing.
 */

export type CardNetwork = 'Mastercard' | 'Visa' | 'American Express';

/** Cards whose names do not include the network. Checked against the issuer pages. */
const NETWORK_BY_SLUG: Record<string, CardNetwork> = {
    'tangerine-money-back-credit-card': 'Mastercard',
    'the-platinum-card': 'American Express',
};

export function cardNetwork(card: CreditCard): CardNetwork | null {
    const known = NETWORK_BY_SLUG[card.slug];
    if (known) return known;
    const name = card.creditCardName;
    if (/american express|\bamex\b/i.test(name) || /^american express$/i.test(card.issuer.trim())) {
        return 'American Express';
    }
    if (/master\s*card/i.test(name)) return 'Mastercard';
    if (/\bvisa\b/i.test(name)) return 'Visa';
    return null;
}

export function cardsOnNetwork(cards: CreditCard[], network: CardNetwork): CreditCard[] {
    return cards.filter((card) => cardNetwork(card) === network);
}

// ---------------------------------------------------------------------------
// Welcome offers
// ---------------------------------------------------------------------------

const NO_OFFER = /^(n\/?a|none|-|\$0(\.00)?)$|no (standard )?welcome (offer|bonus)|no listed welcome|there is (currently|generally) no/i;

const MONTHS =
    'January|February|March|April|May|June|July|August|September|October|November|December';
const DEADLINE = new RegExp(
    `(?:apply|open your account|account (?:must be )?opened|applications? (?:must be )?received)[^.]{0,40}?\\bby\\s+((?:${MONTHS})\\s+\\d{1,2},\\s+\\d{4})`,
    'i'
);

/** Headline welcome offer text, or '' when the card has none listed. */
export function welcomeOfferText(card: CreditCard): string {
    const text = (card.welcomeBonus || '').trim();
    if (!text || NO_OFFER.test(text)) return '';
    return text;
}

/** "Apply by" deadline written into the offer text, if any. */
export function offerDeadline(card: CreditCard): Date | null {
    const haystack = `${card.welcomeBonus} ${card.welcomeBonusDetailed}`;
    const match = haystack.match(DEADLINE);
    if (!match) return null;
    // End of that day in Toronto, so an offer is still shown on its last day.
    const date = new Date(`${match[1]} 23:59:59 GMT-0500`);
    return Number.isNaN(date.getTime()) ? null : date;
}

/** Issuer-advertised dollar value of the welcome offer (0 when it is points-only or a rate offer). */
export function offerDollarValue(card: CreditCard): number {
    const valueText = (card.welcomeBonusValue || '').trim();
    // Points-only values ("50,000 Avios") have no dollar figure; don't read the point count as dollars.
    if (!valueText || NO_OFFER.test(valueText) || !valueText.includes('$')) return 0;
    return parseBonusValue(valueText);
}

export interface CurrentOffer {
    card: CreditCard;
    offer: string;
    value: number;
    valueText: string;
    deadline: Date | null;
}

/**
 * Cards with a welcome offer that has not passed its stated deadline, highest
 * advertised dollar value first. Offers without a dollar value go last, by name.
 */
export function getCurrentOffers(cards: CreditCard[], now: Date): CurrentOffer[] {
    const offers: CurrentOffer[] = [];
    for (const card of cards) {
        const offer = welcomeOfferText(card);
        if (!offer) continue;
        const deadline = offerDeadline(card);
        if (deadline && deadline.getTime() < now.getTime()) continue;
        const valueText = (card.welcomeBonusValue || '').trim();
        offers.push({
            card,
            offer,
            value: offerDollarValue(card),
            valueText: valueText && !NO_OFFER.test(valueText) ? valueText : '',
            deadline,
        });
    }
    return offers.sort(
        (a, b) =>
            b.value - a.value ||
            a.card.annualFee - b.card.annualFee ||
            a.card.creditCardName.localeCompare(b.card.creditCardName)
    );
}

// ---------------------------------------------------------------------------
// Network picks (/best/mastercard/, /best/visa/)
// ---------------------------------------------------------------------------

export interface NetworkPickGroup {
    id: string;
    /** Short category name for the at-a-glance table. */
    label: string;
    heading: string;
    blurb: string;
    /** How the cards in this group are ordered, in plain words for readers. */
    rankedBy: string;
    cards: CreditCard[];
}

/** First-year value: advertised welcome value minus the ongoing annual fee. */
export function firstYearNet(card: CreditCard): number {
    return offerDollarValue(card) - estimateWelcomeFeeMath(card).feeUsedForMath;
}

function byFirstYearValue(a: CreditCard, b: CreditCard): number {
    return (
        firstYearNet(b) - firstYearNet(a) ||
        a.annualFee - b.annualFee ||
        a.creditCardName.localeCompare(b.creditCardName)
    );
}

function byPurchaseRate(a: CreditCard, b: CreditCard): number {
    const rate = (card: CreditCard) =>
        card.purchaseInterestRate > 0 ? card.purchaseInterestRate : Number.POSITIVE_INFINITY;
    return rate(a) - rate(b) || a.annualFee - b.annualFee || a.creditCardName.localeCompare(b.creditCardName);
}

const PICKS_PER_GROUP = 3;

export function getNetworkPickGroups(cards: CreditCard[], network: CardNetwork): NetworkPickGroup[] {
    const pool = cardsOnNetwork(cards, network);
    const adult = pool.filter((card) => !isStudentCard(card));
    const valueRank = 'First-year value: the welcome offer the issuer advertises, minus the annual fee.';

    const groups: NetworkPickGroup[] = [
        {
            id: 'no-annual-fee',
            label: 'No annual fee',
            heading: `Best no annual fee ${network} cards`,
            blurb: `${network} cards that list a $0 annual fee, so anything they earn is yours to keep.`,
            rankedBy: valueRank,
            cards: adult.filter(isNoAnnualFeeCard).sort(byFirstYearValue),
        },
        {
            id: 'cash-back',
            label: 'Cash back',
            heading: `Best cash back ${network} cards`,
            blurb: `${network} cards that pay rewards as cash back or statement credits.`,
            rankedBy: valueRank,
            cards: adult.filter(isCashBackCard).sort(byFirstYearValue),
        },
        {
            id: 'travel',
            label: 'Travel and points',
            heading: `Best travel and points ${network} cards`,
            blurb: `${network} cards that earn airline, hotel or flexible points.`,
            rankedBy: valueRank,
            cards: adult
                .filter((card) => isTravelCard(card) || (isRewardsCard(card) && !isCashBackCard(card)))
                .filter((card) => !isUsDollarCard(card) && !isLowInterestCard(card))
                .sort(byFirstYearValue),
        },
        {
            id: 'premium',
            label: 'Premium',
            heading: `Best premium ${network} cards`,
            blurb: `${network} cards with an annual fee of $120 or more, where the perks and insurance have to earn the fee back.`,
            rankedBy: valueRank,
            cards: adult.filter(isPremiumCard).sort(byFirstYearValue),
        },
        {
            id: 'low-interest',
            label: 'Low interest',
            heading: `Best low interest ${network} cards`,
            blurb: `${network} cards built around a lower purchase rate, for anyone who sometimes carries a balance.`,
            rankedBy: 'Lowest listed purchase interest rate, then lowest annual fee.',
            cards: adult.filter(isLowInterestCard).sort(byPurchaseRate),
        },
        {
            id: 'students',
            label: 'Students',
            heading: `Best student ${network} cards`,
            blurb: `Student versions of ${network} cards.`,
            rankedBy: valueRank,
            cards: pool.filter(isStudentCard).sort(byFirstYearValue),
        },
        {
            id: 'us-dollar',
            label: 'U.S. dollar',
            heading: `U.S. dollar ${network} cards`,
            blurb: `${network} cards billed in U.S. dollars, for people who spend or earn in USD.`,
            rankedBy: 'Lowest annual fee.',
            cards: pool
                .filter(isUsDollarCard)
                .sort((a, b) => a.annualFee - b.annualFee || a.creditCardName.localeCompare(b.creditCardName)),
        },
    ];

    return groups
        .map((group) => ({ ...group, cards: group.cards.slice(0, PICKS_PER_GROUP) }))
        .filter((group) => group.cards.length > 0);
}

/**
 * First sentence of the card's feature summary, or '' when the text doesn't read as a clean
 * sentence (some issuer copy arrives as fragments). Pages fall back to the review link.
 */
export function earnSummary(card: CreditCard, max = 220): string {
    const joined = (card.features || '')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !/^\d+$/.test(line))
        .join(' ')
        .replace(/\s+/g, ' ')
        .replace(/\s+([.,;:])/g, '$1')
        .trim();
    if (!joined) return '';
    const match = joined.match(/^.+?[.!?](?=\s|$)/);
    const sentence = (match ? match[0] : joined).replace(/[;,:\s]+$/, '');
    if (sentence.length < 30 || sentence.length > max) return '';
    if (!/%|per \$1|for every|points?|cash back|¢/i.test(sentence)) return '';
    return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
}
