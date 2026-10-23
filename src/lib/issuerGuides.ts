import type { CreditCard } from './types';
import type { IssuerHubSlug } from './issuers';

/**
 * Editorial content for the bank pages that are indexable (/issuer/{slug}/).
 * Card names, fees and rates always render from the current card record; notes here are short
 * descriptions of each card's published earn or perk, so keep them in step with the card pages.
 * Issuers without an entry stay noindex.
 */
export interface IssuerPick {
    need: string;
    cards: { slug: string; note: string }[];
}

export interface IssuerFaq {
    question: string;
    answer: string;
}

export interface IssuerGuide {
    /** Extra lineup paragraphs under the intro. Inline markdown links allowed. */
    lineup: string[];
    picks: IssuerPick[];
    /** Bank-specific questions. Return null to skip a question when the cards it needs aren't listed. */
    faqs: ((cards: CreditCard[]) => IssuerFaq | null)[];
}

const link = (card: CreditCard) => `[${card.creditCardName}](/card/${card.slug}/)`;

function listNames(cards: CreditCard[]): string {
    const names = cards.map(link);
    if (names.length <= 1) return names.join('');
    return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function cardsEarning(program: RegExp, question: string, intro: string) {
    return (cards: CreditCard[]): IssuerFaq | null => {
        const matches = cards.filter((card) => program.test(card.rewardsProgram));
        if (matches.length === 0) return null;
        return { question, answer: `${intro} ${listNames(matches)}.` };
    };
}

export const ISSUER_GUIDES: Partial<Record<IssuerHubSlug, IssuerGuide>> = {
    bmo: {
        lineup: [
            'BMO’s cards fall into a few families. **CashBack** cards pay a statement credit, led by a high grocery rate. **Eclipse** cards earn BMO Rewards points with bonus categories for groceries, dining and gas, and **Ascend** is the travel-focused BMO Rewards card. **Blue Rewards** is the program that replaced AIR MILES at BMO, and **VIPorter** is the Porter Airlines card. A low-rate Mastercard, a U.S. dollar Mastercard and a student CashBack card round out the lineup.',
        ],
        picks: [
            {
                need: 'Groceries and cash back',
                cards: [
                    { slug: 'bmo-cashback-world-elite-mastercard', note: '5% on groceries on the first $500 each statement, then 1%' },
                    { slug: 'bmo-cashback-mastercard', note: 'no annual fee, 3% on groceries up to $500 each statement' },
                ],
            },
            {
                need: 'Flexible points on everyday spending',
                cards: [
                    { slug: 'bmo-eclipse-visa-infinite-card', note: '5 points per $1 on groceries, dining, gas and transit, up to annual caps' },
                    { slug: 'bmo-eclipse-rise-visa-card', note: 'no annual fee, 5 points per $2 on groceries, dining and recurring bills' },
                ],
            },
            {
                need: 'Travel',
                cards: [
                    { slug: 'bmo-ascend-world-elite-mastercard', note: '5 points per $1 on eligible travel' },
                    { slug: 'bmo-viporter-world-elite-mastercard', note: 'Porter flyers: first checked bag and seat selection on Porter flights' },
                ],
            },
            {
                need: 'Former AIR MILES collectors',
                cards: [
                    { slug: 'bmo-blue-rewards-mastercard', note: 'no annual fee, extra points at Blue Rewards partners' },
                    { slug: 'bmo-blue-rewards-world-elite-mastercard', note: 'higher earn at partners and on groceries and gas' },
                ],
            },
            {
                need: 'Carrying a balance',
                cards: [{ slug: 'bmo-preferred-rate-mastercard', note: 'BMO’s lowest purchase rate, plus a balance transfer offer' }],
            },
            {
                need: 'U.S. dollar spending',
                cards: [{ slug: 'bmo-u-s-dollar-mastercard', note: 'billed in U.S. dollars, fee rebated after U.S. $3,000 in a year' }],
            },
            {
                need: 'Students',
                cards: [{ slug: 'student-bmo-cashback-mastercard', note: '3% cash back on groceries, for students aged 18 to 24' }],
            },
        ],
        faqs: [
            (cards) => {
                const blue = cards.find((card) => card.slug === 'bmo-blue-rewards-mastercard');
                if (!blue) return null;
                const worldElite = cards.find((card) => card.slug === 'bmo-blue-rewards-world-elite-mastercard');
                return {
                    question: 'What happened to the BMO AIR MILES Mastercard?',
                    answer: `BMO’s AIR MILES cards became Blue Rewards cards. The no-fee card is now the ${link(blue)}, which earns Blue Rewards points instead of AIR MILES.${worldElite ? ` The ${link(worldElite)} is the higher-earning version with an annual fee.` : ''}`,
                };
            },
            cardsEarning(/bmo rewards/i, 'Which BMO cards earn BMO Rewards points?', 'BMO Rewards points are earned on the'),
        ],
    },
    td: {
        lineup: [
            'TD splits its cards between **Aeroplan** cobrands for Air Canada flyers, **TD Rewards** cards that earn the most when you book travel through Expedia For TD, and **Cash Back** Visas that pay Cash Back Dollars on groceries, gas, transit and recurring bills. A low-rate Visa and a U.S. dollar Visa complete the lineup.',
        ],
        picks: [
            {
                need: 'Air Canada flyers',
                cards: [
                    { slug: 'td-aeroplan-visa-infinite-card', note: '1.5 Aeroplan points per $1 on gas, EV charging, groceries and Air Canada' },
                    { slug: 'td-aeroplan-visa-platinum-credit-card', note: 'lower fee, 1 point per $1 in the same categories' },
                ],
            },
            {
                need: 'Cash back',
                cards: [
                    { slug: 'td-cash-back-visa-infinite-card', note: '3% on groceries, gas and EV, transit, and bills and streaming, up to $15,000 a year each' },
                    { slug: 'td-cash-back-visa-card', note: 'no annual fee, 1% in the same categories' },
                ],
            },
            {
                need: 'Flexible TD Rewards points',
                cards: [
                    { slug: 'td-first-class-travel-visa-infinite-card', note: '8 points per $1 on Expedia For TD travel, 6 on groceries, dining and transit' },
                    { slug: 'td-rewards-visa-card', note: 'no annual fee, 3 points per $1 on groceries, dining and transit' },
                ],
            },
            {
                need: 'Premium Aeroplan perks',
                cards: [{ slug: 'td-aeroplan-visa-infinite-privilege-credit-card', note: '2 points per $1 with Air Canada' }],
            },
            {
                need: 'Carrying a balance',
                cards: [{ slug: 'td-low-rate-visa-card', note: 'low ongoing purchase rate, with a 0% purchase offer for new accounts' }],
            },
            {
                need: 'U.S. dollar spending',
                cards: [{ slug: 'td-u-s-dollar-visa-card', note: 'no conversion on purchases and bills paid in U.S. dollars' }],
            },
        ],
        faqs: [
            cardsEarning(/aeroplan/i, 'Which TD credit cards earn Aeroplan points?', 'TD’s Aeroplan cards are the'),
            cardsEarning(/td rewards/i, 'Which TD cards earn TD Rewards points?', 'TD Rewards points are earned on the'),
        ],
    },
    scotiabank: {
        lineup: [
            'Many Scotiabank cards earn **Scene+**, the points program shared with Sobeys-family grocers and Cineplex. That includes the **Passport** travel Visas and the American Express cards Scotiabank issues. **Momentum** cards pay cash back instead. Scotiabank also lists more student cards than the other big banks, plus a low-rate Value Visa and a U.S. dollar Visa.',
        ],
        picks: [
            {
                need: 'Scene+ on groceries',
                cards: [
                    { slug: 'scotiabank-gold-american-express-card', note: 'up to 6x Scene+ points and no foreign transaction fees' },
                    { slug: 'scotiabank-american-express-card', note: 'no annual fee, 3x at Sobeys, Safeway, FreshCo and Foodland' },
                ],
            },
            {
                need: 'Travel and spending abroad',
                cards: [
                    { slug: 'scotiabank-passport-visa-infinite-card', note: 'no foreign transaction fees and six airport lounge passes' },
                    { slug: 'scotiabank-passport-visa-infinite-privilege-card', note: '10 lounge visits and a $250 annual Scene+ Travel credit' },
                ],
            },
            {
                need: 'Cash back',
                cards: [
                    { slug: 'scotia-momentum-visa-infinite-card', note: '4% cash back on groceries and recurring payments' },
                    { slug: 'scotia-momentum-mastercard-credit-card', note: 'no annual fee, 1% on gas, groceries, drugstores and recurring payments' },
                ],
            },
            {
                need: 'Carrying a balance',
                cards: [{ slug: 'scotiabank-value-visa-card', note: 'Scotiabank’s low-rate Visa' }],
            },
            {
                need: 'Students',
                cards: [
                    { slug: 'scotiabank-scene-plus-visa-card-for-students', note: '2x Scene+ at Sobeys-family grocers and Cineplex' },
                    { slug: 'scotiabank-american-express-card-for-students', note: '3x Scene+ at Sobeys, Safeway, FreshCo and Foodland' },
                ],
            },
            {
                need: 'U.S. dollar spending',
                cards: [{ slug: 'scotiabank-u-s-dollar-visa-card', note: 'billed in U.S. dollars' }],
            },
        ],
        faqs: [
            (cards) => {
                const noFx = cards.filter((card) =>
                    /no foreign transaction fee/i.test(`${card.features} ${card.featuresDetailed}`)
                );
                if (noFx.length === 0) return null;
                return {
                    question: 'Which Scotiabank cards have no foreign transaction fees?',
                    answer: `The ${listNames(noFx)} list no foreign transaction fees, so purchases in other currencies aren’t marked up by the usual conversion fee. Check the card page for the current terms.`,
                };
            },
            cardsEarning(/scene\+/i, 'Which Scotiabank cards earn Scene+ points?', 'Scene+ points are earned on the'),
        ],
    },
    cibc: {
        lineup: [
            'CIBC’s lineup has four main families. **Aeroplan** Visas are for Air Canada flyers. **Aventura** Visas earn flexible points with the most going to travel booked through the CIBC Rewards Centre. **Dividend** Visas pay cash back, led by groceries and gas. The **Costco** Mastercard is for Costco members. CIBC also sells student versions of its Aeroplan, Aventura and Dividend cards, a low-rate Select Visa and a U.S. dollar Aventura card.',
        ],
        picks: [
            {
                need: 'Cash back on groceries and gas',
                cards: [
                    { slug: 'cibc-dividend-visa-infinite-card', note: '4% on gas, EV charging and groceries, up to annual caps' },
                    { slug: 'cibc-dividend-visa-card', note: 'no annual fee, 2% on groceries' },
                ],
            },
            {
                need: 'Air Canada flyers',
                cards: [
                    { slug: 'cibc-aeroplan-visa-infinite-card', note: '1.5 Aeroplan points per $1 on gas, EV charging, groceries and Air Canada' },
                    { slug: 'cibc-aeroplan-visa-card', note: 'no annual fee, 1 point per $1 in the same categories' },
                ],
            },
            {
                need: 'Costco members',
                cards: [{ slug: 'cibc-costco-mastercard', note: 'no annual fee, 3% at restaurants and Costco gas' }],
            },
            {
                need: 'Flexible travel points',
                cards: [
                    { slug: 'cibc-aventura-visa-infinite-card', note: '2 points per $1 on travel through the CIBC Rewards Centre, 1.5 on gas, groceries and drugstores' },
                ],
            },
            {
                need: 'Carrying a balance',
                cards: [{ slug: 'cibc-select-visa-card', note: 'low-rate Visa with a balance transfer offer' }],
            },
            {
                need: 'Students',
                cards: [
                    { slug: 'cibc-dividend-visa-card-for-students', note: '2% cash back on groceries, no minimum income' },
                    { slug: 'cibc-aeroplan-visa-card-for-students', note: 'Aeroplan points, no minimum income' },
                ],
            },
            {
                need: 'U.S. dollar spending',
                cards: [{ slug: 'cibc-u-s-dollar-aventura-gold-visa-card', note: 'no conversion fees on U.S. dollar purchases, earns Aventura points' }],
            },
        ],
        faqs: [
            (cards) => {
                const mastercards = cards.filter((card) => /mastercard/i.test(card.creditCardName));
                if (mastercards.length === 0) return null;
                return {
                    question: 'Which CIBC card can I use at Costco?',
                    answer: `Costco warehouses in Canada take Mastercard, not Visa. Among CIBC’s cards, the ${listNames(mastercards)} ${mastercards.length === 1 ? 'is the Mastercard' : 'are the Mastercards'}; the rest are Visa cards.`,
                };
            },
            cardsEarning(/aeroplan/i, 'Which CIBC cards earn Aeroplan points?', 'CIBC’s Aeroplan cards are the'),
        ],
    },
    rbc: {
        lineup: [
            'Many RBC cards earn **Avion** points. That includes the Avion Visas for travel and the **ION** Visas for everyday spending such as groceries, gas and streaming. RBC also has **Cash Back** Mastercards, **WestJet** cobrands that earn WestJet points, and a British Airways Visa that earns Avios. Low-rate and U.S. dollar Visas round out the lineup.',
        ],
        picks: [
            {
                need: 'Flexible travel points',
                cards: [
                    { slug: 'rbc-avion-visa-infinite', note: 'Avion points, 1.25 per $1 on travel' },
                    { slug: 'rbc-avion-visa-infinite-privilege', note: '1.25 points per $1 on everything and six lounge visits a year' },
                ],
            },
            {
                need: 'Everyday Avion points',
                cards: [
                    { slug: 'rbc-ion-plus-visa', note: '3x on groceries, dining, food delivery, rides, gas and streaming' },
                    { slug: 'rbc-ion-visa', note: 'no annual fee, 1.5x on groceries, rides, gas and streaming' },
                ],
            },
            {
                need: 'Cash back',
                cards: [
                    { slug: 'rbc-cash-back-preferred-world-elite-mastercard', note: '3% on groceries, dining, food delivery, gas, transit and streaming' },
                    { slug: 'rbc-cash-back-mastercard', note: 'no annual fee, 2% on groceries' },
                ],
            },
            {
                need: 'WestJet flyers',
                cards: [
                    { slug: 'westjet-rbc-world-elite-mastercard', note: '2 points per $1 on WestJet, groceries and transportation' },
                    { slug: 'westjet-rbc-mastercard', note: 'lower fee, 1.5 points per $1 on WestJet and restaurants' },
                ],
            },
            {
                need: 'Carrying a balance',
                cards: [
                    { slug: 'rbc-rateadvantage-visa', note: 'no annual fee, variable rate tied to prime' },
                    { slug: 'rbc-visa-classic-low-rate-option', note: 'fixed low purchase rate' },
                ],
            },
            {
                need: 'U.S. dollar spending',
                cards: [{ slug: 'rbc-u-s-dollar-visa-gold', note: '1 Avion point per U.S. $1' }],
            },
        ],
        faqs: [
            cardsEarning(/^avion$/i, 'Which RBC cards earn Avion points?', 'Avion points are earned on the'),
            (cards) => {
                const ion = cards.filter((card) => /\bion\b/i.test(card.creditCardName));
                const avion = cards.filter((card) => /\bavion\b/i.test(card.creditCardName));
                if (ion.length === 0 || avion.length === 0) return null;
                return {
                    question: 'What is the difference between RBC Avion and RBC ION cards?',
                    answer: `Both earn Avion points. The ION cards (${listNames(ion)}) pay extra points on everyday categories such as groceries, gas and streaming. The Avion cards (${listNames(avion)}) are RBC’s travel rewards cards.`,
                };
            },
        ],
    },
};

export function getIssuerGuide(slug: IssuerHubSlug): IssuerGuide | null {
    return ISSUER_GUIDES[slug] ?? null;
}

export function isIndexableIssuer(slug: IssuerHubSlug): boolean {
    return slug in ISSUER_GUIDES;
}
