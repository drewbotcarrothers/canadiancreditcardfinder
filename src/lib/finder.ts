import type { CreditCard } from './types';
import {
    isCashBackCard,
    isGroceryCard,
    isLowInterestCard,
    isNoAnnualFeeCard,
    isPremiumCard,
    isRewardsCard,
    isStudentCard,
    isTravelCard,
    isUsDollarCard,
    type HubSlug,
} from './hubs';
import { issuerNameToSlug } from './issuers';
import { parseBonusValue } from './utils';

/**
 * Finder decision tree
 *
 * 1. goal — always
 * 2. fee — always
 * 3. spend — cash-back, travel, and everyday-rewards paths only
 * 4. travelProgram — travel path only (skipped for cash-back and others)
 * 5. issuer — always; “no preference” is a real answer
 *
 * Scoring applies the goal family and fee cap as the main filters, then ranks
 * remaining cards. Issuer and a specific travel program are soft filters:
 * they drop first if the pool is empty. Spend is a ranking boost, not a cut.
 */

export const FINDER_QUESTION_IDS = ['goal', 'fee', 'spend', 'travelProgram', 'issuer'] as const;

export type FinderQuestionId = (typeof FINDER_QUESTION_IDS)[number];

export type FinderGoal = 'cash-back' | 'travel' | 'rewards' | 'student' | 'low-interest';
export type FinderFeeComfort = 'none' | 'moderate' | 'premium';
export type FinderSpend = 'groceries' | 'gas' | 'dining' | 'travel' | 'general';
export type FinderTravelProgram = 'flexible' | 'aeroplan' | 'westjet' | 'hotel' | 'none';
export type FinderIssuerPref = 'amex' | 'big5' | 'none';

export interface FinderAnswers {
    goal?: FinderGoal;
    fee?: FinderFeeComfort;
    spend?: FinderSpend;
    travelProgram?: FinderTravelProgram;
    issuer?: FinderIssuerPref;
}

export interface FinderChoice<T extends string = string> {
    value: T;
    label: string;
    description: string;
}

export interface FinderQuestion {
    id: FinderQuestionId;
    title: string;
    subtitle?: string;
    choices: FinderChoice[];
}

export interface RankedFinderCard {
    card: CreditCard;
    score: number;
    reason: string;
}

export interface FinderRecommendation {
    best: RankedFinderCard | null;
    alternatives: RankedFinderCard[];
    relaxed: string[];
    fallbackHubs: HubSlug[];
}

const MODERATE_FEE_CAP = 150;
const BIG_FIVE_SLUGS = new Set(['rbc', 'td', 'cibc', 'scotiabank', 'bmo']);

const AEROPLAN = /aeroplan/i;
const WESTJET = /westjet/i;
const HOTEL_PROGRAM = /marriott|bonvoy/i;
const GAS_TRANSIT =
    /\bgas\b|\bpetrol\b|\besso\b|petro-?points|\btransit\b|ride[\s-]?share|\bfuel\b/i;
const DINING = /\bdining\b|\brestaurants?\b|\bbars?\b|\bcaf[eé]s?\b|food delivery/i;
const TRAVEL_SPEND = /\btravel\b|\bairlines?\b|\bflights?\b|\bhotels?\b/i;

export const FINDER_QUESTIONS: Record<FinderQuestionId, FinderQuestion> = {
    goal: {
        id: 'goal',
        title: 'What do you want most from a credit card?',
        subtitle: 'Pick the goal that matters most. You can change this later.',
        choices: [
            {
                value: 'cash-back',
                label: 'Cash back',
                description: 'Statement credits on everyday spending',
            },
            {
                value: 'travel',
                label: 'Travel points',
                description: 'Airline, hotel, or flexible travel rewards',
            },
            {
                value: 'rewards',
                label: 'Everyday rewards',
                description: 'Points you can redeem for travel or purchases',
            },
            {
                value: 'student',
                label: 'Student card',
                description: 'Student versions of cash-back, travel, and rewards cards',
            },
            {
                value: 'low-interest',
                label: 'Low interest',
                description: 'A lower purchase rate if you carry a balance',
            },
        ],
    },
    fee: {
        id: 'fee',
        title: 'How do you feel about an annual fee?',
        subtitle: 'We will stay inside this range when the catalog allows it.',
        choices: [
            {
                value: 'none',
                label: '$0 only',
                description: 'No annual fee listed in our current data',
            },
            {
                value: 'moderate',
                label: 'Up to about $150',
                description: 'Includes no-fee cards and mid-range annual fees',
            },
            {
                value: 'premium',
                label: 'Fine with premium ($150+)',
                description: 'Higher-fee cards if the rewards or perks may be worth it',
            },
        ],
    },
    spend: {
        id: 'spend',
        title: 'Where do you spend the most?',
        subtitle: 'We will favour cards whose features mention this category.',
        choices: [
            {
                value: 'groceries',
                label: 'Groceries',
                description: 'Supermarkets and grocery-store programs',
            },
            {
                value: 'gas',
                label: 'Gas and transit',
                description: 'Fuel, transit, and ride share',
            },
            {
                value: 'dining',
                label: 'Dining',
                description: 'Restaurants, bars, cafés, and food delivery',
            },
            {
                value: 'travel',
                label: 'Travel',
                description: 'Flights, hotels, and travel purchases',
            },
            {
                value: 'general',
                label: 'General spending',
                description: 'No standout category — keep it flexible',
            },
        ],
    },
    travelProgram: {
        id: 'travelProgram',
        title: 'Do you prefer a travel program?',
        subtitle: 'Skip this if you want points you can use on more than one airline.',
        choices: [
            {
                value: 'flexible',
                label: 'Flexible points',
                description: 'Book travel without locking into one airline',
            },
            {
                value: 'aeroplan',
                label: 'Aeroplan',
                description: 'Air Canada and Aeroplan cobrand cards',
            },
            {
                value: 'westjet',
                label: 'WestJet',
                description: 'WestJet Dollars cobrand cards',
            },
            {
                value: 'hotel',
                label: 'Hotel',
                description: 'Hotel programs such as Marriott Bonvoy',
            },
            {
                value: 'none',
                label: 'No preference',
                description: 'Show strong travel cards across programs',
            },
        ],
    },
    issuer: {
        id: 'issuer',
        title: 'Prefer a specific bank?',
        subtitle: 'This is optional. American Express is accepted at fewer merchants than Visa or Mastercard.',
        choices: [
            {
                value: 'amex',
                label: 'American Express',
                description: 'Amex-issued cards. Confirm the places you shop take Amex.',
            },
            {
                value: 'big5',
                label: 'Big Five banks',
                description: 'RBC, TD, CIBC, Scotiabank, or BMO',
            },
            {
                value: 'none',
                label: 'No preference',
                description: 'Include every issuer in our catalog',
            },
        ],
    },
};

export function needsSpendQuestion(goal: FinderGoal | undefined): boolean {
    return goal === 'cash-back' || goal === 'travel' || goal === 'rewards';
}

export function needsTravelProgramQuestion(goal: FinderGoal | undefined): boolean {
    return goal === 'travel';
}

export function getQuestionPath(answers: FinderAnswers): FinderQuestionId[] {
    const path: FinderQuestionId[] = ['goal', 'fee'];

    if (needsSpendQuestion(answers.goal)) {
        path.push('spend');
    }

    if (needsTravelProgramQuestion(answers.goal)) {
        path.push('travelProgram');
    }

    path.push('issuer');
    return path;
}

export function getNextQuestionId(answers: FinderAnswers): FinderQuestionId | null {
    const path = getQuestionPath(answers);
    return path.find((id) => answers[id] == null) ?? null;
}

export function isFinderComplete(answers: FinderAnswers): boolean {
    return getNextQuestionId(answers) == null && answers.goal != null && answers.fee != null && answers.issuer != null;
}

export function applyFinderAnswer(
    answers: FinderAnswers,
    questionId: FinderQuestionId,
    value: string,
): FinderAnswers {
    const next: FinderAnswers = { ...answers };

    switch (questionId) {
        case 'goal':
            next.goal = value as FinderGoal;
            if (!needsSpendQuestion(next.goal)) {
                delete next.spend;
            }
            if (!needsTravelProgramQuestion(next.goal)) {
                delete next.travelProgram;
            }
            break;
        case 'fee':
            next.fee = value as FinderFeeComfort;
            break;
        case 'spend':
            next.spend = value as FinderSpend;
            break;
        case 'travelProgram':
            next.travelProgram = value as FinderTravelProgram;
            break;
        case 'issuer':
            next.issuer = value as FinderIssuerPref;
            break;
    }

    return next;
}

export function retractLastFinderAnswer(answers: FinderAnswers): FinderAnswers {
    const path = getQuestionPath(answers);
    const answered = path.filter((id) => answers[id] != null);
    const last = answered[answered.length - 1];
    if (!last) {
        return {};
    }

    const next = { ...answers };
    delete next[last];
    return next;
}

function featureHaystack(card: CreditCard): string {
    return `${card.features} ${card.featuresDetailed} ${card.rewardsProgram} ${card.creditCardName}`;
}

function programHaystack(card: CreditCard): string {
    return `${card.creditCardName} ${card.rewardsProgram}`;
}

export function isAmexIssuedCard(card: CreditCard): boolean {
    return issuerNameToSlug(card.issuer) === 'american-express';
}

export function isBigFiveIssuedCard(card: CreditCard): boolean {
    return BIG_FIVE_SLUGS.has(issuerNameToSlug(card.issuer));
}

export function isAeroplanCard(card: CreditCard): boolean {
    return AEROPLAN.test(programHaystack(card));
}

export function isWestJetCard(card: CreditCard): boolean {
    return WESTJET.test(programHaystack(card));
}

export function isHotelProgramCard(card: CreditCard): boolean {
    return HOTEL_PROGRAM.test(programHaystack(card));
}

export function isFlexibleTravelCard(card: CreditCard): boolean {
    return isTravelCard(card) && !isAeroplanCard(card) && !isWestJetCard(card) && !isHotelProgramCard(card);
}

export function isGasTransitCard(card: CreditCard): boolean {
    return GAS_TRANSIT.test(featureHaystack(card));
}

export function isDiningCard(card: CreditCard): boolean {
    return DINING.test(featureHaystack(card));
}

export function isTravelSpendCard(card: CreditCard): boolean {
    return isTravelCard(card) || TRAVEL_SPEND.test(featureHaystack(card));
}

function matchesGoal(card: CreditCard, goal: FinderGoal): boolean {
    switch (goal) {
        case 'cash-back':
            return isCashBackCard(card);
        case 'travel':
            return isTravelCard(card);
        case 'rewards':
            return isRewardsCard(card);
        case 'student':
            return isStudentCard(card);
        case 'low-interest':
            return isLowInterestCard(card);
    }
}

function matchesFeeCap(card: CreditCard, fee: FinderFeeComfort | undefined, relaxedFee: boolean): boolean {
    if (relaxedFee || !fee || fee === 'premium') {
        return true;
    }

    if (!Number.isFinite(card.annualFee)) {
        return false;
    }

    if (fee === 'none') {
        return card.annualFee === 0;
    }

    return card.annualFee <= MODERATE_FEE_CAP;
}

function matchesIssuer(card: CreditCard, issuer: FinderIssuerPref | undefined, enforce: boolean): boolean {
    if (!enforce || !issuer || issuer === 'none') {
        return true;
    }

    if (issuer === 'amex') {
        return isAmexIssuedCard(card);
    }

    return isBigFiveIssuedCard(card);
}

function matchesTravelProgram(
    card: CreditCard,
    program: FinderTravelProgram | undefined,
    enforce: boolean,
): boolean {
    if (!enforce || !program || program === 'none') {
        return true;
    }

    switch (program) {
        case 'aeroplan':
            return isAeroplanCard(card);
        case 'westjet':
            return isWestJetCard(card);
        case 'hotel':
            return isHotelProgramCard(card);
        case 'flexible':
            return isFlexibleTravelCard(card);
    }
}

function matchesSpend(card: CreditCard, spend: FinderSpend | undefined): boolean {
    if (!spend || spend === 'general') {
        return false;
    }

    switch (spend) {
        case 'groceries':
            return isGroceryCard(card);
        case 'gas':
            return isGasTransitCard(card);
        case 'dining':
            return isDiningCard(card);
        case 'travel':
            return isTravelSpendCard(card);
    }
}

interface FilterFlags {
    goal: boolean;
    fee: boolean;
    issuer: boolean;
    program: boolean;
    studentStrict: boolean;
    excludeUs: boolean;
}

function defaultFlags(): FilterFlags {
    return {
        goal: true,
        fee: true,
        issuer: true,
        program: true,
        studentStrict: true,
        excludeUs: true,
    };
}

function passesFilters(card: CreditCard, answers: FinderAnswers, flags: FilterFlags): boolean {
    if (!card.creditCardName) {
        return false;
    }

    if (flags.excludeUs && isUsDollarCard(card)) {
        return false;
    }

    if (flags.goal && answers.goal && !matchesGoal(card, answers.goal)) {
        return false;
    }

    if (flags.studentStrict && answers.goal === 'student' && !isStudentCard(card)) {
        return false;
    }

    if (!matchesFeeCap(card, answers.fee, !flags.fee)) {
        return false;
    }

    if (!matchesIssuer(card, answers.issuer, flags.issuer)) {
        return false;
    }

    if (answers.goal === 'travel' && !matchesTravelProgram(card, answers.travelProgram, flags.program)) {
        return false;
    }

    return true;
}

function scoreCard(card: CreditCard, answers: FinderAnswers): number {
    let score = 0;

    if (answers.goal && matchesGoal(card, answers.goal)) {
        score += 100;
    }

    if (answers.fee === 'none' && isNoAnnualFeeCard(card)) {
        score += 35;
    } else if (answers.fee === 'moderate' && Number.isFinite(card.annualFee) && card.annualFee <= MODERATE_FEE_CAP) {
        score += 25;
        if (card.annualFee > 0) {
            score += 4;
        }
    } else if (answers.fee === 'premium') {
        if (isPremiumCard(card)) {
            score += 30;
        } else if (Number.isFinite(card.annualFee) && card.annualFee >= MODERATE_FEE_CAP) {
            score += 18;
        }
    }

    if (matchesSpend(card, answers.spend)) {
        score += 35;
    }

    if (answers.goal === 'travel') {
        if (answers.travelProgram === 'aeroplan' && isAeroplanCard(card)) {
            score += 40;
        } else if (answers.travelProgram === 'westjet' && isWestJetCard(card)) {
            score += 40;
        } else if (answers.travelProgram === 'hotel' && isHotelProgramCard(card)) {
            score += 40;
        } else if (answers.travelProgram === 'flexible' && isFlexibleTravelCard(card)) {
            score += 32;
        }
    }

    if (answers.issuer === 'amex' && isAmexIssuedCard(card)) {
        score += 25;
    } else if (answers.issuer === 'big5' && isBigFiveIssuedCard(card)) {
        score += 25;
    }

    if (answers.goal === 'low-interest' && Number.isFinite(card.purchaseInterestRate) && card.purchaseInterestRate > 0) {
        score += Math.max(0, 22 - card.purchaseInterestRate);
    }

    if (answers.goal !== 'student' && isStudentCard(card)) {
        score -= 12;
    }

    const bonus = parseBonusValue(card.welcomeBonusValue);
    if (bonus > 0) {
        score += Math.min(22, bonus / 20);
    }

    if (answers.goal === 'travel' && answers.fee === 'premium' && isPremiumCard(card)) {
        score += 8;
    }

    return score;
}

function buildReason(card: CreditCard, answers: FinderAnswers): string {
    const parts: string[] = [];

    if (answers.goal === 'cash-back' && isCashBackCard(card)) {
        parts.push('Listed as a cash-back card in our catalog.');
    } else if (answers.goal === 'travel' && isTravelCard(card)) {
        parts.push('Listed as a travel card in our catalog.');
    } else if (answers.goal === 'rewards' && isRewardsCard(card)) {
        parts.push('Listed as a rewards card in our catalog.');
    } else if (answers.goal === 'student' && isStudentCard(card)) {
        parts.push('Student is listed in the card name or category.');
    } else if (answers.goal === 'low-interest' && isLowInterestCard(card)) {
        parts.push('Listed as a low-interest card in our catalog.');
    }

    if (Number.isFinite(card.annualFee)) {
        if (answers.fee === 'none' && card.annualFee === 0) {
            parts.push(`Annual fee is ${card.annualFeeDisplay}.`);
        } else if (answers.fee === 'moderate' && card.annualFee <= MODERATE_FEE_CAP) {
            parts.push(`Annual fee is ${card.annualFeeDisplay}, within the range you chose.`);
        } else if (answers.fee === 'premium' && isPremiumCard(card)) {
            parts.push(`Annual fee is ${card.annualFeeDisplay}, in the premium range.`);
        } else {
            parts.push(`Annual fee is ${card.annualFeeDisplay}.`);
        }
    }

    if (answers.spend === 'groceries' && isGroceryCard(card)) {
        parts.push('Grocery or supermarket earning appears in the name, program, or features.');
    } else if (answers.spend === 'gas' && isGasTransitCard(card)) {
        parts.push('Gas, transit, or ride-share earning appears in the listed features.');
    } else if (answers.spend === 'dining' && isDiningCard(card)) {
        parts.push('Dining or food-delivery earning appears in the listed features.');
    } else if (answers.spend === 'travel' && isTravelSpendCard(card)) {
        parts.push('Travel earning appears in the category or listed features.');
    }

    if (answers.travelProgram === 'aeroplan' && isAeroplanCard(card) && card.rewardsProgram) {
        parts.push(`Rewards program: ${card.rewardsProgram}.`);
    } else if (answers.travelProgram === 'westjet' && isWestJetCard(card) && card.rewardsProgram) {
        parts.push(`Rewards program: ${card.rewardsProgram}.`);
    } else if (answers.travelProgram === 'hotel' && isHotelProgramCard(card) && card.rewardsProgram) {
        parts.push(`Rewards program: ${card.rewardsProgram}.`);
    } else if (answers.travelProgram === 'flexible' && isFlexibleTravelCard(card)) {
        parts.push('A travel card that is not tied to Aeroplan, WestJet, or a hotel program in our data.');
    }

    if (answers.issuer === 'amex' && isAmexIssuedCard(card)) {
        parts.push(`Issued by ${card.issuer}.`);
    } else if (answers.issuer === 'big5' && isBigFiveIssuedCard(card)) {
        parts.push(`Issued by ${card.issuer}.`);
    }

    if (answers.goal === 'low-interest' && card.purchaseInterestRateDisplay) {
        parts.push(`Purchase rate listed as ${card.purchaseInterestRateDisplay}.`);
    }

    if (parts.length === 0) {
        return `A close fit from ${card.issuer} based on the answers you gave.`;
    }

    return parts.join(' ');
}

export function getFallbackHubs(answers: FinderAnswers): HubSlug[] {
    const hubs: HubSlug[] = [];

    switch (answers.goal) {
        case 'cash-back':
            hubs.push('cash-back', 'no-annual-fee');
            break;
        case 'travel':
            hubs.push('travel', 'premium');
            break;
        case 'rewards':
            hubs.push('rewards', 'travel');
            break;
        case 'student':
            hubs.push('students', 'no-annual-fee');
            break;
        case 'low-interest':
            hubs.push('low-interest', 'no-annual-fee');
            break;
        default:
            hubs.push('cash-back', 'travel', 'no-annual-fee');
    }

    if (answers.spend === 'groceries' && !hubs.includes('groceries')) {
        hubs.splice(1, 0, 'groceries');
    }

    if (answers.fee === 'none' && !hubs.includes('no-annual-fee')) {
        hubs.push('no-annual-fee');
    }

    if (answers.fee === 'premium' && !hubs.includes('premium')) {
        hubs.push('premium');
    }

    return [...new Set(hubs)].slice(0, 4);
}

function rankPool(cards: CreditCard[], answers: FinderAnswers): RankedFinderCard[] {
    return cards
        .map((card) => ({
            card,
            score: scoreCard(card, answers),
            reason: buildReason(card, answers),
        }))
        .sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }

            const bonusDelta = parseBonusValue(b.card.welcomeBonusValue) - parseBonusValue(a.card.welcomeBonusValue);
            if (bonusDelta !== 0) {
                return bonusDelta;
            }

            if (a.card.annualFee !== b.card.annualFee) {
                return a.card.annualFee - b.card.annualFee;
            }

            return a.card.creditCardName.localeCompare(b.card.creditCardName);
        });
}

export function recommendCards(cards: CreditCard[], answers: FinderAnswers): FinderRecommendation {
    const fallbackHubs = getFallbackHubs(answers);
    const relaxed: string[] = [];

    const hasIssuerFilter = answers.issuer === 'amex' || answers.issuer === 'big5';
    const hasProgramFilter =
        answers.goal === 'travel' &&
        (answers.travelProgram === 'aeroplan' ||
            answers.travelProgram === 'westjet' ||
            answers.travelProgram === 'hotel' ||
            answers.travelProgram === 'flexible');
    const hasFeeCap = answers.fee === 'none' || answers.fee === 'moderate';

    const attempts: { flags: FilterFlags; note?: string }[] = [
        { flags: defaultFlags() },
        {
            flags: { ...defaultFlags(), issuer: false },
            note: hasIssuerFilter
                ? 'No cards matched your bank preference, so we included other issuers.'
                : undefined,
        },
        {
            flags: { ...defaultFlags(), issuer: false, program: false },
            note: hasProgramFilter
                ? 'No cards matched that travel program in your fee range, so we included other travel cards.'
                : undefined,
        },
        {
            flags: { ...defaultFlags(), issuer: false, program: false, fee: false },
            note: hasFeeCap
                ? 'Few cards met your annual-fee cap for this goal, so we included a wider fee range.'
                : undefined,
        },
    ];

    let pool: CreditCard[] = [];

    for (const attempt of attempts) {
        const nextPool = cards.filter((card) => passesFilters(card, answers, attempt.flags));
        if (attempt.note && nextPool.length > 0 && pool.length === 0) {
            relaxed.push(attempt.note);
        }
        pool = nextPool;
        if (pool.length > 0) {
            break;
        }
    }

    if (pool.length === 0 && answers.goal === 'student') {
        pool = cards.filter((card) => isNoAnnualFeeCard(card) && !isUsDollarCard(card));
        if (pool.length > 0) {
            relaxed.push('Few student cards matched, so we included no-annual-fee cards beyond student products.');
        }
    }

    if (pool.length === 0) {
        return { best: null, alternatives: [], relaxed, fallbackHubs };
    }

    const ranked = rankPool(pool, answers);
    return {
        best: ranked[0] ?? null,
        alternatives: ranked.slice(1, 5),
        relaxed,
        fallbackHubs,
    };
}

export function summarizeAnswers(answers: FinderAnswers): { label: string; value: string }[] {
    const summary: { label: string; value: string }[] = [];
    const path = getQuestionPath(answers);

    for (const id of path) {
        const value = answers[id];
        if (!value) {
            continue;
        }

        const question = FINDER_QUESTIONS[id];
        const choice = question.choices.find((item) => item.value === value);
        summary.push({
            label: question.title,
            value: choice?.label ?? value,
        });
    }

    return summary;
}
