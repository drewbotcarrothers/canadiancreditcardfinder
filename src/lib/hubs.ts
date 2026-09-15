import type { CreditCard } from './types';

export const HUB_SLUGS = [
    'travel',
    'cash-back',
    'no-annual-fee',
    'students',
    'rewards',
    'groceries',
    'low-interest',
    'us-dollar',
] as const;

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
const STUDENT_CATEGORY = /student/i;
const REWARDS_CATEGORY = /rewards/i;
const LOW_INTEREST_CATEGORY = /low\s*interest|low\s*rate/i;
const LOW_INTEREST_NAME = /low\s*(interest|rate)|preferred\s*rate|rateadvantage/i;
const US_CATEGORY = /^us$/i;
const US_DOLLAR_NAME = /u\.?s\.?\s*dollar/i;
const GROCERY_WORD = /grocer(?:y|ies)/i;
const GROCERY_BANNER = /\bsobeys\b|\bsafeway\b|\bfreshco\b|\bfoodland\b|\bpc\s*optimum\b/i;
const GROCERY_FOCUSED_NAME =
    /\bcostco\b|\btriangle\b|\btangerine money-back\b|\bpc\s+(mastercard|world)|pc financial/i;

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
    {
        slug: 'students',
        title: 'Best Student Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best Student Credit Cards in Canada (2026)',
        description:
            'Compare the best student credit cards in Canada for 2026. See no-fee and student versions of cash back, travel, and rewards cards with current fees.',
        intro:
            'Student credit cards in Canada are usually built for thinner credit files and often carry no annual fee. Many are student versions of cash-back or travel cards, with similar earn rates and lower or waived fees. Compare how you qualify, whether the card reports to the credit bureau, and if you can keep the product after graduation. The cards below currently list Student as the category, or include student in the card name.',
        navLabel: 'Students',
        teaser: 'Student versions of cash back, travel, and rewards cards',
    },
    {
        slug: 'rewards',
        title: 'Best Rewards Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best Rewards Credit Cards in Canada (2026)',
        description:
            'Compare the best rewards credit cards in Canada for 2026. See points cards, welcome bonuses, annual fees, and full reviews.',
        intro:
            'Rewards credit cards earn points you can redeem for travel, merchandise, or statement credits, rather than automatic cash back. In Canada that includes Membership Rewards, Scene+, Avion, Aventura, and store programs such as PC Optimum. Compare welcome bonuses, annual fees, and whether you will actually use the redemption options. This list includes cards in our data whose category is rewards.',
        navLabel: 'Rewards',
        teaser: 'Points you can redeem for travel or everyday purchases',
    },
    {
        slug: 'groceries',
        title: 'Best Grocery Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best Grocery Credit Cards in Canada (2026)',
        description:
            'Compare the best grocery credit cards in Canada for 2026. See supermarket earn rates, PC Optimum, Costco, and cash-back grocery cards.',
        intro:
            'Grocery credit cards pay a higher rate on supermarket spending than on general purchases. Some return cash back in grocery categories; others earn PC Optimum, Scene+ at Sobeys-family stores, or Costco-focused cash back. Compare annual fees against how much you spend on groceries, and whether a store or club membership is required. The cards below currently list grocery as a bonus earn category, or belong to a grocery-focused program, in our data.',
        navLabel: 'Groceries',
        teaser: 'Higher earn on supermarket and grocery-store spending',
    },
    {
        slug: 'low-interest',
        title: 'Best Low Interest Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best Low Interest Credit Cards in Canada (2026)',
        description:
            'Compare the best low interest credit cards in Canada for 2026. See purchase rates, annual fees, and cards built for carrying a balance.',
        intro:
            'Low interest credit cards charge a lower purchase rate than typical Canadian cards, which can matter if you sometimes carry a balance. Rewards are usually modest compared with cash-back or travel cards. Compare the annual fee against the rate difference, and whether a promotional rate expires. The cards below currently list Low Interest as the category in our data.',
        navLabel: 'Low Interest',
        teaser: 'Lower purchase rates if you carry a balance',
    },
    {
        slug: 'us-dollar',
        title: 'Best U.S. Dollar Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best U.S. Dollar Credit Cards in Canada (2026)',
        description:
            'Compare the best U.S. dollar credit cards in Canada for 2026. See USD billing, foreign-exchange savings, fees, and rewards.',
        intro:
            'U.S. dollar credit cards issued in Canada bill in USD, which can reduce conversion fees when you spend with U.S. merchants. You typically need a U.S. dollar bank account to pay the statement. Compare annual fees, rewards, and whether the card is worth it for how often you pay in USD. The cards below currently list US as the category in our data.',
        navLabel: 'U.S. Dollar',
        teaser: 'USD billing for U.S. spending from Canada',
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

export function isStudentCard(card: CreditCard): boolean {
    return STUDENT_CATEGORY.test(card.category) || STUDENT_CATEGORY.test(card.creditCardName);
}

export function isRewardsCard(card: CreditCard): boolean {
    if (REWARDS_CATEGORY.test(card.category)) {
        return true;
    }

    if (isMessyCategory(card.category)) {
        return REWARDS_CATEGORY.test(`${card.creditCardName} ${card.rewardsProgram}`);
    }

    return false;
}

export function isLowInterestCard(card: CreditCard): boolean {
    if (LOW_INTEREST_CATEGORY.test(card.category)) {
        return true;
    }

    if (isMessyCategory(card.category)) {
        return LOW_INTEREST_NAME.test(card.creditCardName);
    }

    return false;
}

export function isUsDollarCard(card: CreditCard): boolean {
    if (US_CATEGORY.test(card.category.trim())) {
        return true;
    }

    return US_DOLLAR_NAME.test(card.creditCardName);
}

function groceryHaystack(card: CreditCard): string {
    return `${card.features} ${card.featuresDetailed} ${card.rewardsProgram} ${card.creditCardName}`;
}

export function isGroceryCard(card: CreditCard): boolean {
    const nameAndIssuer = `${card.creditCardName} ${card.issuer}`;
    if (GROCERY_FOCUSED_NAME.test(nameAndIssuer)) {
        return true;
    }

    const haystack = groceryHaystack(card);
    if (GROCERY_BANNER.test(haystack)) {
        return true;
    }

    const cleaned = haystack
        .replace(/confirm[^.]*grocer[^.]*\.?/gi, ' ')
        .replace(/(?:everything else|dining to)[^.]{0,80}grocer[^.]*\.?/gi, ' ');

    return GROCERY_WORD.test(cleaned);
}

export function filterCardsForHub(cards: CreditCard[], slug: HubSlug): CreditCard[] {
    switch (slug) {
        case 'travel':
            return cards.filter(isTravelCard);
        case 'cash-back':
            return cards.filter(isCashBackCard);
        case 'no-annual-fee':
            return cards.filter(isNoAnnualFeeCard);
        case 'students':
            return cards.filter(isStudentCard);
        case 'rewards':
            return cards.filter(isRewardsCard);
        case 'groceries':
            return cards.filter(isGroceryCard);
        case 'low-interest':
            return cards.filter(isLowInterestCard);
        case 'us-dollar':
            return cards.filter(isUsDollarCard);
    }
}
