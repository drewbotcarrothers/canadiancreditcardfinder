import type { CreditCard } from './types';
import type { GuideEntry } from './guides';
import {
    getHubBySlug,
    isCashBackCard,
    isGroceryCard,
    isLowInterestCard,
    isNoAnnualFeeCard,
    isPremiumCard,
    isRewardsCard,
    isStudentCard,
    isTravelCard,
    isUsDollarCard,
    type HubDefinition,
    type HubSlug,
} from './hubs';
import { issuerNameToSlug } from './issuers';

const MAX_GUIDES = 3;

interface GuideRule {
    /** Guide ids in priority order. Missing ids are skipped so a renamed guide never breaks a build. */
    guides: string[];
    /** The /best/ list that owns this card's main use, shown next to the guides. */
    hub?: HubSlug;
    matches: (card: CreditCard, text: string) => boolean;
    /** Only used to top up a short list (fewer than this many guides picked so far). */
    onlyIfFewerThan?: number;
}

const cardText = (card: CreditCard) =>
    `${card.creditCardName} ${card.rewardsProgram} ${card.features} ${card.featuresDetailed}`;

/**
 * Most specific rules first. The first rule that matches also supplies the hub link.
 * Matching uses the card's own name, category, fee and feature text only.
 */
const RULES: GuideRule[] = [
    {
        matches: (card) => isUsDollarCard(card),
        guides: ['best-us-dollar-credit-cards-canada', 'foreign-transaction-fees-canada'],
        hub: 'us-dollar',
    },
    {
        matches: (card) => isStudentCard(card),
        guides: ['best-student-credit-cards-canada', 'credit-cards-low-income-no-minimum-canada'],
        hub: 'students',
    },
    {
        matches: (card) => isLowInterestCard(card),
        guides: ['low-interest-vs-rewards-credit-cards-canada', 'balance-transfers-explained-canada'],
        hub: 'low-interest',
    },
    { matches: (card) => /costco/i.test(card.creditCardName), guides: ['costco-credit-card-canada'], hub: 'groceries' },
    { matches: (card) => /pc\s*optimum/i.test(card.rewardsProgram), guides: ['pc-optimum-explained'], hub: 'groceries' },
    { matches: (card) => /aeroplan/i.test(`${card.creditCardName} ${card.rewardsProgram}`), guides: ['aeroplan-for-beginners-canada'] },
    { matches: (card) => /scene\+/i.test(`${card.creditCardName} ${card.rewardsProgram}`), guides: ['scene-plus-explained'] },
    {
        matches: (card) => /\b(cobalt|gold rewards)\b/i.test(card.creditCardName) && issuerNameToSlug(card.issuer) === 'american-express',
        guides: ['amex-cobalt-vs-gold-rewards'],
        hub: 'rewards',
    },
    {
        matches: (card) => isTravelCard(card),
        guides: ['how-to-choose-travel-credit-card-canada', 'credit-card-travel-insurance-explained-canada'],
        hub: 'travel',
    },
    {
        matches: (_card, text) => /no foreign (transaction|exchange|currency)|no fx fee/i.test(text),
        guides: ['foreign-transaction-fees-canada'],
        hub: 'travel',
    },
    {
        matches: (card) => isPremiumCard(card),
        guides: ['are-premium-credit-cards-worth-it-canada'],
        hub: 'premium',
    },
    {
        matches: (card) => /visa\s*infinite|world\s*elite/i.test(card.creditCardName),
        guides: ['visa-infinite-world-elite-income-requirements-canada'],
    },
    {
        matches: (card) => isCashBackCard(card),
        guides: ['best-cash-back-credit-cards-canada', 'cash-back-vs-points-credit-cards-canada'],
        hub: 'cash-back',
    },
    {
        matches: (card) => isRewardsCard(card),
        guides: ['credit-card-points-value-canada', 'cash-back-vs-points-credit-cards-canada'],
        hub: 'rewards',
    },
    { matches: (card) => isGroceryCard(card), guides: ['best-grocery-credit-cards-canada'], hub: 'groceries' },
    { matches: (card) => isNoAnnualFeeCard(card), guides: ['best-no-annual-fee-credit-cards-canada'], hub: 'no-annual-fee' },
    {
        matches: (card) => ['rbc', 'td', 'scotiabank'].includes(issuerNameToSlug(card.issuer)),
        guides: ['rbc-vs-td-vs-scotiabank-credit-cards'],
    },
    { matches: (card) => issuerNameToSlug(card.issuer) === 'american-express', guides: ['amex-acceptance-canada'] },
    {
        matches: () => true,
        guides: ['cash-back-vs-points-credit-cards-canada', 'welcome-bonus-eligibility-rules-canada'],
        onlyIfFewerThan: 2,
    },
];

export interface CardRelatedGuides {
    guides: GuideEntry[];
    hub: HubDefinition | null;
}

/** Picks 2–3 guides for a card page from the card's category, program and feature text. */
export function getRelatedGuidesForCard(card: CreditCard, allGuides: GuideEntry[]): CardRelatedGuides {
    const byId = new Map(allGuides.map((guide) => [guide.id, guide]));
    const text = cardText(card);
    const picked: GuideEntry[] = [];
    let hub: HubSlug | undefined;

    for (const rule of RULES) {
        if (picked.length >= MAX_GUIDES) break;
        if (rule.onlyIfFewerThan !== undefined && picked.length >= rule.onlyIfFewerThan) continue;
        if (!rule.matches(card, text)) continue;
        if (!hub && rule.hub) hub = rule.hub;
        for (const id of rule.guides) {
            const guide = byId.get(id);
            if (guide && !picked.includes(guide) && picked.length < MAX_GUIDES) {
                picked.push(guide);
            }
        }
    }

    return { guides: picked, hub: hub ? getHubBySlug(hub) : null };
}
