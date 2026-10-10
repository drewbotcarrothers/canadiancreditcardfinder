import type { CreditCard } from './types';

/**
 * Catalog cells for these cards still carry stale feature lines and interest
 * rates. Issuer pages checked 2026-10-10 are applied here so public pages
 * show the published figures. Do not add internal source language to the strings.
 */
interface CardFactPatch {
    annualFeeDetail?: string;
    rewardsProgram?: string;
    features?: string;
    featuresDetailed?: string;
    insurance?: string;
    cardEligibility?: string;
    omitPurchaseRate?: boolean;
    omitCashAdvanceRate?: boolean;
}

const PATCHES: Record<string, CardFactPatch> = {
    'brim-world-elite-mastercard': {
        annualFeeDetail: '$89 per year',
        rewardsProgram: 'Brim points',
        features:
            'Earn 1 Brim point per $1. Annual fee $89. Foreign transaction fee 1.5%. Mastercard Travel Pass lounge access costs US$32 per person per visit.',
        featuresDetailed:
            'Brim World Elite Mastercard from Brim Financial. Earn 1 Brim point per $1. Annual fee $89. Foreign transactions are charged 1.5%. Mastercard Travel Pass lounge access costs US$32 per person per visit. Coverage includes trip cancellation and trip interruption, out-of-province emergency medical up to $5 million (15 days under age 65, 3 days at age 65 and older), mobile device coverage up to $1,500, and rental car collision damage waiver for up to 48 days on vehicles with an MSRP up to $85,000. Travel insurance is unavailable to new Quebec applicants.',
        insurance:
            'Trip cancellation and trip interruption. Out-of-province emergency medical up to $5 million (15 days under age 65, 3 days at age 65 and older). Mobile device coverage up to $1,500. Rental car collision damage waiver for up to 48 days on vehicles with an MSRP up to $85,000. Travel insurance is unavailable to new Quebec applicants.',
        omitPurchaseRate: true,
        omitCashAdvanceRate: true,
    },
    'brim-mastercard': {
        annualFeeDetail: 'No annual fee',
        rewardsProgram: 'Brim points',
        features:
            '$0 annual fee. Earn 1 Brim point per $2. Foreign transaction fee 1.5%. Includes free global Wi-Fi.',
        featuresDetailed:
            'Brim Mastercard from Brim Financial. $0 annual fee. Earn 1 Brim point per $2. Foreign transactions are charged 1.5%. Includes free global Wi-Fi.',
        omitPurchaseRate: true,
        omitCashAdvanceRate: true,
    },
    'triangle-world-elite-mastercard': {
        features:
            '4% CT Money at Canadian Tire family stores; 7¢/L on premium fuel and 5¢/L on other fuel at Gas+ and Petro-Canada; 3% groceries on the first $12,000/year (excludes Costco and Walmart); 1% elsewhere.',
        featuresDetailed:
            'Triangle World Elite Mastercard from Canadian Tire Bank. No annual fee. Earn 4% Canadian Tire Money at Canadian Tire family stores, 7¢/L CT Money on premium fuel and 5¢/L on other fuel at Gas+ and Petro-Canada, 3% on groceries for the first $12,000 a year (Costco and Walmart are excluded), and 1% on other purchases. Insurance is 90-day purchase security, extended warranty, and rental car collision damage waiver. Income requirement is $80,000 personal or $150,000 household.',
        insurance:
            'Purchase security for 90 days, extended warranty, and rental car collision damage waiver.',
        cardEligibility:
            'Canadian resident, age of majority, with $80,000 personal income or $150,000 household income.',
        omitCashAdvanceRate: true,
    },
    'triangle-mastercard': {
        omitCashAdvanceRate: true,
    },
};

function withoutRate(card: CreditCard, field: 'purchase' | 'cashAdvance'): CreditCard {
    if (field === 'purchase') {
        return { ...card, purchaseInterestRate: 0, purchaseInterestRateDisplay: '' };
    }
    return { ...card, cashAdvanceInterestRate: 0, cashAdvanceInterestRateDisplay: '' };
}

export function applyPublishedCardFacts(card: CreditCard): CreditCard {
    const patch = PATCHES[card.slug];
    if (!patch) return card;

    let next: CreditCard = { ...card };
    if (patch.annualFeeDetail !== undefined) next.annualFeeDetail = patch.annualFeeDetail;
    if (patch.rewardsProgram !== undefined) next.rewardsProgram = patch.rewardsProgram;
    if (patch.features !== undefined) next.features = patch.features;
    if (patch.featuresDetailed !== undefined) next.featuresDetailed = patch.featuresDetailed;
    if (patch.insurance !== undefined) next.insurance = patch.insurance;
    if (patch.cardEligibility !== undefined) next.cardEligibility = patch.cardEligibility;
    if (patch.omitPurchaseRate) next = withoutRate(next, 'purchase');
    if (patch.omitCashAdvanceRate) next = withoutRate(next, 'cashAdvance');
    return next;
}
