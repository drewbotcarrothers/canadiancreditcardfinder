import type { CreditCard } from './types';
import { parseBonusValue } from './utils';

export interface WelcomeFeeEstimate {
    headlineFee: number;
    ongoingFee: number | null;
    feeUsedForMath: number;
    bonusEstimate: number | null;
    net: number | null;
}

const ONGOING_FEE_IN_DETAIL =
    /\$(\d[\d,]*(?:\.\d{2})?)\s*(?:annual fee|per year|\/\s*year)/i;

/**
 * Prefer a higher “annual fee / per year” figure from the detail field when the
 * headline Annual_Fee column looks like a first-year or discounted price.
 */
export function ongoingFeeFromDetail(detail: string): number | null {
    if (!detail) {
        return null;
    }

    const match = detail.match(ONGOING_FEE_IN_DETAIL);
    if (!match) {
        return null;
    }

    const amount = parseFloat(match[1].replace(/,/g, ''));
    return Number.isFinite(amount) ? amount : null;
}

export function estimateWelcomeFeeMath(card: CreditCard): WelcomeFeeEstimate {
    const headlineFee = Number.isFinite(card.annualFee) ? card.annualFee : 0;
    const parsedOngoing = ongoingFeeFromDetail(card.annualFeeDetail);
    const ongoingFee =
        parsedOngoing !== null && parsedOngoing > headlineFee + 1 ? parsedOngoing : null;
    const feeUsedForMath = ongoingFee ?? headlineFee;

    const parsedBonus = card.welcomeBonusValue ? parseBonusValue(card.welcomeBonusValue) : 0;
    const bonusEstimate = parsedBonus > 0 ? parsedBonus : null;
    const net = bonusEstimate !== null ? bonusEstimate - feeUsedForMath : null;

    return {
        headlineFee,
        ongoingFee,
        feeUsedForMath,
        bonusEstimate,
        net,
    };
}
