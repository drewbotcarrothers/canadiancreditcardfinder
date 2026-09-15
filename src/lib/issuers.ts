import type { CreditCard } from './types';
import { slugify } from './utils';

export const ISSUER_HUB_SLUGS = [
    'american-express',
    'rbc',
    'td',
    'cibc',
    'scotiabank',
    'bmo',
    'rogers-bank',
    'national-bank',
    'desjardins',
    'mbna',
    'tangerine',
    'simplii-financial',
    'pc-financial',
] as const;

export type IssuerHubSlug = (typeof ISSUER_HUB_SLUGS)[number];

export interface IssuerHubDefinition {
    slug: IssuerHubSlug;
    name: string;
    title: string;
    h1: string;
    description: string;
    intro: string;
    navLabel: string;
    teaser: string;
}

/**
 * Maps slugified CSV Issuer values (and common aliases) to a stable hub slug.
 * Matching is by the Issuer field only — never by card name.
 */
const ISSUER_SLUG_ALIASES: Record<string, IssuerHubSlug> = {
    amex: 'american-express',
    'royal-bank': 'rbc',
    'royal-bank-of-canada': 'rbc',
    'td-bank': 'td',
    'td-canada-trust': 'td',
    'toronto-dominion': 'td',
    'toronto-dominion-bank': 'td',
    'canadian-imperial-bank-of-commerce': 'cibc',
    scotia: 'scotiabank',
    'bank-of-nova-scotia': 'scotiabank',
    'bank-of-montreal': 'bmo',
    rogers: 'rogers-bank',
    nbc: 'national-bank',
    'national-bank-of-canada': 'national-bank',
    simplii: 'simplii-financial',
    'presidents-choice': 'pc-financial',
    'presidents-choice-financial': 'pc-financial',
    'president-s-choice': 'pc-financial',
    'president-s-choice-financial': 'pc-financial',
};

export const ISSUER_HUBS: IssuerHubDefinition[] = [
    {
        slug: 'american-express',
        name: 'American Express',
        title: 'Best American Express Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best American Express Credit Cards in Canada (2026)',
        description:
            'Compare American Express credit cards in Canada for 2026. See Cobalt, Gold, Platinum, Aeroplan, and cash-back fees, bonuses, and reviews.',
        intro:
            'American Express cards in Canada include Membership Rewards earners, Aeroplan cobrands, and cash-back options. Compare annual fees against welcome bonuses, lounge access, and how you redeem points — some cards suit everyday spend, others premium travel. Merchant acceptance is wider than it used to be, but it is still worth checking the places you pay most often. The cards below currently list American Express as the issuer in our data.',
        navLabel: 'American Express',
        teaser: 'Membership Rewards, Aeroplan, and cash back',
    },
    {
        slug: 'rbc',
        name: 'RBC',
        title: 'Best RBC Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best RBC Credit Cards in Canada (2026)',
        description:
            'Compare RBC credit cards in Canada for 2026. See Avion, WestJet, ION, and cash-back annual fees, welcome bonuses, and full reviews.',
        intro:
            'RBC credit cards cover Avion travel rewards, WestJet cobrands, ION everyday earn, and cash-back or low-rate options. Compare how Avion points convert to flights versus statement credits, and whether a higher annual fee is offset by the welcome bonus and insurance. The cards below currently list RBC as the issuer in our data.',
        navLabel: 'RBC',
        teaser: 'Avion, WestJet, ION, and cash back',
    },
    {
        slug: 'td',
        name: 'TD',
        title: 'Best TD Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best TD Credit Cards in Canada (2026)',
        description:
            'Compare TD credit cards in Canada for 2026. See Aeroplan, travel, cash-back, and U.S. dollar cards with current fees and bonuses.',
        intro:
            'TD cards in Canada include Aeroplan cobrands, First Class and Platinum travel, cash-back Visas, and a U.S. dollar option. If you already collect Aeroplan, a TD Aeroplan card can consolidate earning; otherwise compare cash back and lower-rate cards. Weigh annual fees against welcome bonuses and travel insurance. The cards below currently list TD as the issuer in our data.',
        navLabel: 'TD',
        teaser: 'Aeroplan, travel, and cash back',
    },
    {
        slug: 'cibc',
        name: 'CIBC',
        title: 'Best CIBC Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best CIBC Credit Cards in Canada (2026)',
        description:
            'Compare CIBC credit cards in Canada for 2026. See Aeroplan, Aventura, Dividend, Costco, and student cards with fees and bonuses.',
        intro:
            'CIBC’s lineup includes Aeroplan, Aventura travel rewards, Dividend cash back, Costco, and student versions of several cards. Aventura points are flexible for travel bookings, while Aeroplan suits Air Canada flyers. Compare fees, welcome bonuses, and grocery or gas earn rates. The cards below currently list CIBC as the issuer in our data.',
        navLabel: 'CIBC',
        teaser: 'Aeroplan, Aventura, Dividend, and Costco',
    },
    {
        slug: 'scotiabank',
        name: 'Scotiabank',
        title: 'Best Scotiabank Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best Scotiabank Credit Cards in Canada (2026)',
        description:
            'Compare Scotiabank credit cards in Canada for 2026. See Scene+, Passport, Momentum, and Scotiabank American Express fees and bonuses.',
        intro:
            'Scotiabank cards include Scene+ earners, Passport travel Visas, Momentum cash back, and American Express cards issued by Scotiabank. Scene+ can cover movies, dining, and travel, while Passport is often compared for travel medical insurance and lounge access. Check annual fees against how you spend. The cards below currently list Scotiabank as the issuer in our data.',
        navLabel: 'Scotiabank',
        teaser: 'Scene+, Passport, Momentum, and Amex',
    },
    {
        slug: 'bmo',
        name: 'BMO',
        title: 'Best BMO Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best BMO Credit Cards in Canada (2026)',
        description:
            'Compare BMO credit cards in Canada for 2026. See Eclipse, CashBack, Blue Rewards, and VIPorter annual fees, bonuses, and reviews.',
        intro:
            'BMO cards include Eclipse rewards, CashBack, Blue Rewards, VIPorter, and a student CashBack option. Eclipse points can cover travel and everyday redemptions, while CashBack is a simpler statement-credit path. Compare annual fees, welcome bonuses, and grocery or transit earn. The cards below currently list BMO as the issuer in our data.',
        navLabel: 'BMO',
        teaser: 'Eclipse, CashBack, Blue Rewards, and VIPorter',
    },
    {
        slug: 'rogers-bank',
        name: 'Rogers Bank',
        title: 'Best Rogers Bank Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best Rogers Bank Credit Cards in Canada (2026)',
        description:
            'Compare Rogers Bank credit cards in Canada for 2026. See Rogers Red Mastercard fees, bill-credit earning, welcome bonuses, and reviews.',
        intro:
            'Rogers Bank issues the Rogers Red Mastercard family, with earning that can apply to Rogers, Fido, or Shaw bills and other redemptions. World Elite and World Legend sit above the no-fee Red card on annual fee and earn rates. Compare welcome bonuses and whether you already pay a Rogers-brand bill. The cards below currently list Rogers Bank as the issuer in our data.',
        navLabel: 'Rogers Bank',
        teaser: 'Rogers Red Mastercard lineup',
    },
    {
        slug: 'national-bank',
        name: 'National Bank',
        title: 'Best National Bank Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best National Bank Credit Cards in Canada (2026)',
        description:
            'Compare National Bank credit cards in Canada for 2026. See Allure, ECHO cashback, World Elite, and starter cards with current fees.',
        intro:
            'National Bank cards include Allure, ECHO cashback, World Elite, and lower-rate or starter options such as mycredit. Compare how rewards are redeemed, annual fees, and whether a World Elite earn rate is worth the fee. The cards below currently list National Bank as the issuer in our data.',
        navLabel: 'National Bank',
        teaser: 'Allure, ECHO, and World Elite',
    },
    {
        slug: 'desjardins',
        name: 'Desjardins',
        title: 'Best Desjardins Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best Desjardins Credit Cards in Canada (2026)',
        description:
            'Compare Desjardins credit cards in Canada for 2026. See Odyssey travel, cash-back, Bonus, and Flexi fees, bonuses, and reviews.',
        intro:
            'Desjardins cards include Odyssey travel rewards, cash-back Mastercard and Visa options, Bonus, and Flexi. Odyssey cards may suit frequent travellers; cash-back cards are simpler for everyday spend. Compare fees, welcome bonuses, and insurance. The cards below currently list Desjardins as the issuer in our data.',
        navLabel: 'Desjardins',
        teaser: 'Odyssey, cash back, and Bonus',
    },
    {
        slug: 'mbna',
        name: 'MBNA',
        title: 'Best MBNA Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best MBNA Credit Cards in Canada (2026)',
        description:
            'Compare MBNA credit cards in Canada for 2026. See Rewards, Smart Cash, True Line, and Amazon.ca Mastercard fees and bonuses.',
        intro:
            'MBNA cards in Canada include Rewards, Smart Cash, True Line, and the Amazon.ca Rewards Mastercard. Compare cash-back versus points, annual fees, and whether an Amazon-focused earn rate fits your shopping. The cards below currently list MBNA as the issuer in our data.',
        navLabel: 'MBNA',
        teaser: 'Rewards, Smart Cash, True Line, and Amazon.ca',
    },
    {
        slug: 'tangerine',
        name: 'Tangerine',
        title: 'Best Tangerine Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best Tangerine Credit Cards in Canada (2026)',
        description:
            'Compare Tangerine credit cards in Canada for 2026. See Money-Back category cash back, World Mastercard fees, and welcome offers.',
        intro:
            'Tangerine Money-Back cards let you choose bonus categories for a higher cash-back rate, with a World Mastercard option above the original card. There is no annual fee on these cards in our current data. Compare category flexibility and welcome offers. The cards below currently list Tangerine as the issuer in our data.',
        navLabel: 'Tangerine',
        teaser: 'Money-Back category cash back',
    },
    {
        slug: 'simplii-financial',
        name: 'Simplii Financial',
        title: 'Best Simplii Financial Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best Simplii Financial Credit Cards in Canada (2026)',
        description:
            'Compare Simplii Financial credit cards in Canada for 2026. See the no-annual-fee Cash Back Visa, earn rate, and welcome bonus.',
        intro:
            'Simplii Financial currently offers a no-annual-fee Cash Back Visa in our data. It is a straightforward cash-back card rather than a travel-points product. Compare the earn rate and welcome bonus with other $0-fee cash-back cards if you want a simple everyday card. The card below currently lists Simplii Financial as the issuer in our data.',
        navLabel: 'Simplii Financial',
        teaser: 'No-fee cash back Visa',
    },
    {
        slug: 'pc-financial',
        name: 'PC Financial',
        title: 'Best PC Financial Credit Cards in Canada (2026) | Canadian Credit Card Finder',
        h1: 'Best PC Financial Credit Cards in Canada (2026)',
        description:
            'Compare PC Financial credit cards in Canada for 2026. See PC Optimum Mastercard fees, grocery earn, and World Elite reviews.',
        intro:
            'PC Financial Mastercard products earn PC Optimum points on groceries and everyday spend, with World and World Elite tiers above the base card. Compare annual fees against bonus earn at PC Express, Esso, and other partners. The cards below currently list PC Financial as the issuer in our data.',
        navLabel: 'PC Financial',
        teaser: 'PC Optimum Mastercard cards',
    },
];

const issuerHubsBySlug = Object.fromEntries(ISSUER_HUBS.map((hub) => [hub.slug, hub])) as Record<
    IssuerHubSlug,
    IssuerHubDefinition
>;

export function isIssuerHubSlug(value: string): value is IssuerHubSlug {
    return (ISSUER_HUB_SLUGS as readonly string[]).includes(value);
}

export function getIssuerHubSlugs(): IssuerHubSlug[] {
    return [...ISSUER_HUB_SLUGS];
}

export function getIssuerHubBySlug(slug: IssuerHubSlug): IssuerHubDefinition {
    return issuerHubsBySlug[slug];
}

export function issuerNameToSlug(issuer: string): string {
    const slug = slugify(issuer);
    if (!slug) {
        return '';
    }

    return ISSUER_SLUG_ALIASES[slug] ?? slug;
}

export function getIssuerHubForName(issuer: string): IssuerHubDefinition | null {
    const slug = issuerNameToSlug(issuer);
    if (!isIssuerHubSlug(slug)) {
        return null;
    }

    return getIssuerHubBySlug(slug);
}

export function filterCardsForIssuer(cards: CreditCard[], slug: IssuerHubSlug): CreditCard[] {
    return cards.filter((card) => issuerNameToSlug(card.issuer) === slug);
}
