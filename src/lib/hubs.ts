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
    'premium',
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
    /** Short pointer to the companion "how to choose" guide, shown under the intro. Inline markdown links allowed. */
    guideNote?: string;
    /** Longer buying advice shown under the card list. Inline markdown links allowed. */
    analysis?: { heading: string; body: string }[];
    faqs?: { question: string; answer: string }[];
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
const PREMIUM_ANNUAL_FEE_CAD = 120;
const PREMIUM_TIER_NAME =
    /infinite\s*privilege|world\s*elite|world\s*legend|\breserve\b|\bascend\b|visa\s*infinite|the platinum card|odyssey visa infinite privilege/i;
const BASIC_CASH_BACK_NAME = /simplii financial cash back|simplycash card from/i;

export const HUBS: HubDefinition[] = [
    {
        slug: 'travel',
        title: 'Best Travel Credit Cards in Canada (2026), Compared',
        h1: 'Best Travel Credit Cards in Canada (2026)',
        description:
            'Compare the best travel credit cards in Canada for 2026: Aeroplan, WestJet, hotel and flexible points cards, with annual fees, welcome bonuses and reviews.',
        intro:
            'Choosing a travel credit card in Canada usually comes down to how you fly and how you redeem points. Airline-branded cards can be a strong fit if you already use that program, while hotel and flexible rewards cards may suit mixed travel. Weigh the annual fee against welcome bonuses, travel insurance, and lounge or companion benefits before you apply. The cards below are categorized as travel or earn a well-known travel rewards program.',
        navLabel: 'Travel',
        teaser: 'Airline, hotel, and flexible travel rewards',
        analysis: [
            {
                heading: "How to narrow the list",
                body: "Start with how you fly. If you mostly fly Air Canada, an Aeroplan card adds airline perks such as a free first checked bag on many of the mid-tier cards, which can be worth more than the points. If you fly WestJet out of Calgary or Vancouver, a WestJet card is the natural fit. If you travel on different airlines or want hotels too, flexible points such as Amex Membership Rewards or RBC Avion let you choose later.",
            },
            {
                heading: "Check the insurance, not just the points",
                body: "Travel insurance is where these cards differ most, and it's easy to miss. Some cards include travel medical, trip cancellation and trip interruption; others list only rental car and baggage cover. The age limits matter as well. Several cards shorten travel medical cover for travellers 65 and older to just a few days. Read the card page's insurance section, and confirm it against the certificate on the issuer's site before you skip separate coverage.",
            },
            {
                heading: "A quick example",
                body: "A couple flying Air Canada round trip with one checked bag each pays for four bag fees per trip. On a card with a free first checked bag, that saving alone can cover a mid-range annual fee after one or two trips a year. If you only travel carry-on, that perk is worth nothing to you, and a no-fee card or a flexible points card may do more.",
            },
            {
                heading: "Common mistakes",
                body: "Paying a premium fee for lounge access you'll use once a year, ignoring foreign transaction fees (most cards charge about 2.5% on foreign spending; a few don't), and chasing a welcome bonus with spend you wouldn't otherwise put on the card. Bonuses and perks change, so check the issuer's page before you apply.",
            },
        ],
    },
    {
        slug: 'cash-back',
        title: 'Best Cash Back Credit Cards in Canada (2026): No-Fee Picks',
        h1: 'Best Cash Back Credit Cards in Canada (2026)',
        description:
            'The best cash back credit cards in Canada for 2026, including no annual fee cash back cards and premium picks. Compare earn rates, fees and welcome bonuses.',
        intro:
            'Cash back credit cards return a percentage of what you spend, typically as a statement credit. They are often the simplest rewards option in Canada if you would rather not track points or airline programs. Compare bonus categories such as groceries and gas, how cash back is redeemed, and whether a higher annual fee is worth the extra earning rate. No annual fee cash back cards sit in the same list as paid ones, so check the annual fee on each card. This list includes every cash back card we currently track.',
        navLabel: 'Cash Back',
        guideNote:
            'Not sure whether category or flat-rate cash back fits your spending? Read [how to choose a cash back credit card](/guides/best-cash-back-credit-cards-canada/) for caps, merchant codes and the year-two fee test.',
        teaser: 'Statement credits on everyday spending',
    },
    {
        slug: 'no-annual-fee',
        title: 'Best No Fee Credit Cards in Canada (2026): $0 Annual Fee',
        h1: 'Best No Annual Fee Credit Cards in Canada (2026)',
        description:
            'Compare the best no fee credit cards in Canada for 2026. Every card here lists a $0 annual fee: cash back, rewards and travel options with full reviews.',
        intro:
            'No annual fee credit cards charge $0 per year to keep the account open. That can make them a practical everyday card, a student option, or a complement to a premium travel card. Compare earning rates, welcome bonuses, and purchase interest rates — a $0 fee does not automatically mean the best overall value. The cards below currently list a $0 annual fee.',
        navLabel: 'No Annual Fee',
        teaser: 'Cards that currently list a $0 annual fee',
        guideNote:
            'Deciding which kind of $0 card to open first? Read [how to choose a no-annual-fee credit card](/guides/best-no-annual-fee-credit-cards-canada/) for eligibility, welcome-bonus rules and when a paid card wins.',
    },
    {
        slug: 'students',
        title: 'Best Student Credit Cards in Canada (2026), Compared',
        h1: 'Best Student Credit Cards in Canada (2026)',
        description:
            'Compare the best student credit cards in Canada for 2026. See no-fee and student versions of cash back, travel, and rewards cards with current fees.',
        intro:
            'Student credit cards in Canada are usually built for thinner credit files and often carry no annual fee. Many are student versions of cash-back or travel cards, with similar earn rates and lower or waived fees. Compare how you qualify, whether the card reports to the credit bureau, and if you can keep the product after graduation. The cards below currently list Student as the category, or include student in the card name.',
        navLabel: 'Students',
        teaser: 'Student versions of cash back, travel, and rewards cards',
        analysis: [
            {
                heading: "Who a student card is for",
                body: "A student card is for someone in a Canadian college, university or other post-secondary program who wants to start a credit history without paying an annual fee. Most of the student cards listed here charge $0 a year, and several say there's no minimum income requirement, which matters when your income is a part-time job. International students can apply for some of them, though credit limits are usually lower; check each issuer's page for the current rules.",
            },
            {
                heading: "How to choose",
                body: "Pick the card from the bank you already use. Having your chequing account and your card at the same bank makes paying in full easier and can help with approval. Then look at where your money actually goes. If most of it is groceries, a card that pays more on groceries (such as the BMO CashBack student card at 3%, or the CIBC Dividend student card at 2%) will do more than a travel points card. If you go home by plane at Christmas, an Aeroplan student card earns points on that flight and on everyday spending.\n\nThink about the long run too. A student card is meant to become your regular card after you graduate, and the age of that account helps your credit score. Ask the bank what the card converts to when you finish school.",
            },
            {
                heading: "A worked example",
                body: "A student spending $250 a month on groceries earns about $90 a year at 3% cash back, compared with about $15 at 0.5%. That's real money on a student budget, but it's tiny next to interest. A $1,000 balance carried for a year at around 22% costs roughly $220, more than double what the card earns.",
            },
            {
                heading: "Pitfalls to watch",
                body: "Don't apply for several cards in the same month: each application adds a hard inquiry to a thin file. Keep your balance well under the credit limit, ideally below about 30%, because high use relative to the limit can pull a new score down. Set up an automatic payment for at least the minimum so one missed due date doesn't cost you a late payment on your file. And watch for student cards that charge a fee; Scotiabank lists student versions with a $29 or $49 fee, so make sure the extra features are worth it.",
            },
        ],
        faqs: [
            {
                question: "Can I get a student credit card with no income?",
                answer: "Several student cards on this page list no minimum income, and the CIBC student cards say Canadian students can get limits of up to $5,000. Approval still depends on the bank's checks, so confirm the requirements on the issuer's page.",
            },
            {
                question: "Will a student card build my credit?",
                answer: "Yes, if you use it a little each month and pay on time. Canadian card issuers report to the credit bureaus, and a long, clean payment history is one of the biggest factors in your score.",
            },
        ],
    },
    {
        slug: 'rewards',
        title: 'Best Rewards Credit Cards in Canada (2026), Compared',
        h1: 'Best Rewards Credit Cards in Canada (2026)',
        description:
            'Compare the best rewards credit cards in Canada for 2026. See Visa and Mastercard points cards side by side with annual fees, welcome bonuses and reviews.',
        intro:
            'Rewards credit cards earn points you can redeem for travel, merchandise, or statement credits, rather than automatic cash back. In Canada that includes Membership Rewards, Scene+, Avion, Aventura, and store programs such as PC Optimum. Compare welcome bonuses, annual fees, and whether you will actually use the redemption options. This list includes every points-based rewards card we currently track.',
        navLabel: 'Rewards',
        teaser: 'Points you can redeem for travel or everyday purchases',
    },
    {
        slug: 'groceries',
        title: 'Best Grocery Credit Cards in Canada (2026), Compared',
        h1: 'Best Grocery Credit Cards in Canada (2026)',
        description:
            'Compare the best grocery credit cards in Canada for 2026: PC Optimum, Costco and cash back cards that earn more at the supermarket, with fees and reviews.',
        intro:
            'Grocery credit cards pay a higher rate on supermarket spending than on general purchases. Some return cash back in grocery categories; others earn PC Optimum, Scene+ at Sobeys-family stores, or Costco-focused cash back. Compare annual fees against how much you spend on groceries, and whether a store or club membership is required. The cards below currently list grocery as a bonus earn category or belong to a grocery-focused program.',
        navLabel: 'Groceries',
        teaser: 'Higher earn on supermarket and grocery-store spending',
    },
    {
        slug: 'low-interest',
        title: 'Best Low Interest Credit Cards in Canada (2026), Compared',
        h1: 'Best Low Interest Credit Cards in Canada (2026)',
        description:
            'Looking for a low interest credit card? Compare the best low interest credit cards in Canada for 2026 by purchase rate, annual fee and balance transfer terms.',
        intro:
            'Low interest credit cards charge a lower purchase rate than typical Canadian cards, which can matter if you sometimes carry a balance. Rewards are usually modest compared with cash-back or travel cards. Compare the annual fee against the rate difference, and whether a promotional rate expires. The cards below are the low-interest cards we currently track.',
        navLabel: 'Low Interest',
        teaser: 'Lower purchase rates if you carry a balance',
        guideNote:
            'Not sure you need a low interest credit card at all? Read [low interest vs rewards credit cards](/guides/low-interest-vs-rewards-credit-cards-canada/) for the break-even and a payoff strategy.',
        analysis: [
            {
                heading: "Who a low interest card is for",
                body: "A low interest card is for people who sometimes carry a balance, or who want a backup card for a large purchase they'll pay off over a few months. If you pay your statement in full every month, the purchase rate never applies and a rewards card will almost always leave you better off. Be honest about which group you're in, because that decides everything else.",
            },
            {
                heading: "How to choose",
                body: "Compare the purchase interest rate first, then the annual fee. The cards on this page range from no-fee options such as the Desjardins Flexi Visa and MBNA True Line, at roughly 11% to 13%, to cards with fees of about $20 to $39 and rates from about 9% to 14%. A few are variable: the RBC RateAdvantage Visa lists prime plus 4.99%, and the National Bank Syncro lists prime plus 4%, so their rate moves with the Bank of Canada. Also check the cash advance rate. Some low-rate cards keep it low, while others charge close to 25% on cash advances, which is no different from a regular card.",
            },
            {
                heading: "A worked example",
                body: "Carrying an average balance of $3,000 for a year at about 21% costs roughly $630 in interest. At about 13%, the same balance costs roughly $390, a saving of about $240. Subtract a $29 annual fee and you're still about $210 ahead. On a $500 balance, the saving is only about $40, so a no-fee low-rate card is the better fit.",
            },
            {
                heading: "Pitfalls to watch",
                body: "A low rate is still interest. Paying only the minimum on a 13% card can stretch a balance out for years. Promotional balance transfer rates usually come with a transfer fee and expire, after which the regular rate applies. Variable-rate cards go up when the prime rate goes up. Most low interest cards earn little or nothing in rewards, so once the balance is cleared it can make sense to move everyday spending to a rewards card and keep this one for emergencies. Check the issuer's page for the current rate and any balance transfer terms before you apply.",
            },
        ],
        faqs: [
            {
                question: "Is a low interest card or a balance transfer offer better?",
                answer: "A promotional balance transfer can be cheaper for a few months, but you usually pay a transfer fee and the rate jumps when the promotion ends. A low interest card keeps its standard rate year-round, which suits a balance you'll pay down over a longer time.",
            },
            {
                question: "Does a low interest card hurt my credit?",
                answer: "No. The type of card doesn't matter to your score. What matters is paying on time and how much of your limit you're using.",
            },
        ],
    },
    {
        slug: 'us-dollar',
        title: 'Best U.S. Dollar Credit Cards in Canada (2026), Compared',
        h1: 'Best U.S. Dollar Credit Cards in Canada (2026)',
        description:
            'Compare the best U.S. dollar credit cards in Canada for 2026. See USD billing, foreign-exchange savings, fees, and rewards.',
        intro:
            'U.S. dollar credit cards issued in Canada bill in USD, which can reduce conversion fees when you spend with U.S. merchants. You typically need a U.S. dollar bank account to pay the statement. Compare annual fees, rewards, and whether the card is worth it for how often you pay in USD. The cards below are the U.S. dollar cards we currently track.',
        navLabel: 'U.S. Dollar',
        teaser: 'USD billing for U.S. spending from Canada',
        analysis: [
            {
                heading: "Who a U.S. dollar card is for",
                body: "A U.S. dollar card makes sense if you already earn, hold or spend U.S. dollars regularly: snowbirds who winter in Florida or Arizona, people who pay U.S. subscriptions or software bills, online sellers paid in USD, and cross-border shoppers who keep a U.S. dollar account at their Canadian bank. If you only cross the border once or twice a year, a no-foreign-transaction-fee card in Canadian dollars is usually simpler, because you skip the second account and the second bill.",
            },
            {
                heading: "How to choose",
                body: "Start with where your U.S. dollars come from. The statement has to be paid in USD, normally from a U.S. dollar account. If you fund that account by converting Canadian dollars at your bank, you pay a conversion spread at that point instead of on the card, so the savings shrink.\n\nNext, look at the annual fee against how much you spend. The cards on this page currently list fees of roughly $35 to $65 a year in their own currency, and the BMO U.S. Dollar Mastercard lists a fee rebate in the following year if you spend U.S. $3,000 or more. Rewards are thin across the board. The RBC U.S. Dollar Visa Gold earns Avion points on U.S. spending, the CIBC U.S. Dollar Aventura Gold earns Aventura points, and some of the others earn nothing at all. Pick on fee and convenience first, and treat rewards as a small extra.",
            },
            {
                heading: "A worked example",
                body: "Say you put U.S. $4,000 a year on a regular Canadian-dollar card. Most of those cards add a conversion markup of around 2.5%, so you'd pay roughly U.S. $100 in fees. On a U.S. dollar card with a $35 to $40 fee, the markup disappears and you come out about $60 ahead, provided your U.S. dollars didn't cost you a conversion to get. At U.S. $1,000 a year, the markup is about $25, and the annual fee wipes out the saving.",
            },
            {
                heading: "Pitfalls to watch",
                body: "Purchase interest rates on these cards sit in the low 20s, the same as most rewards cards, so carrying a balance erases any foreign-exchange savings fast. Refunds land in USD, which is good, but a payment made from a Canadian-dollar account gets converted at your bank's rate. And spending in euros or pounds on a U.S. dollar card is still a foreign-currency purchase. Check each issuer's page for the current fee and how it handles non-USD purchases.",
            },
        ],
        faqs: [
            {
                question: "Do I need a U.S. bank account for a U.S. dollar credit card?",
                answer: "In practice, yes. The statement is billed in USD, and the cleanest way to pay it is from a U.S. dollar account at the same bank. Paying from a Canadian-dollar account works at some banks, but then you're converting at the bank's rate, which defeats the point.",
            },
            {
                question: "Is a U.S. dollar card better than a no-FX-fee card?",
                answer: "It's better if you hold U.S. dollars already. If you earn in Canadian dollars and just travel south now and then, a Canadian-dollar card with no foreign transaction fee usually saves about the same with less admin, and it also works for other currencies.",
            },
        ],
    },
    {
        slug: 'premium',
        title: 'Best Premium Credit Cards in Canada (2026): Perks & Fees',
        h1: 'Best Premium Credit Cards in Canada (2026)',
        description:
            'Compare the best premium credit cards in Canada for 2026: lounge access, travel insurance, annual credits and higher earn rates, weighed against the annual fee.',
        intro:
            'Premium credit cards in Canada usually charge a higher annual fee in exchange for stronger earn rates, travel insurance, lounge access, or a larger welcome bonus. Typical names include Visa Infinite Privilege, World Elite, Reserve, and The Platinum Card. Weigh the fee against benefits you will actually use — a $150 card can be a better fit than a $599 card if you will not use the extras. The cards below currently list an annual fee of at least $120, excluding student products and basic cash-back cards that only meet the fee cut.',
        navLabel: 'Premium',
        teaser: 'Higher-fee Infinite Privilege, World Elite, and Platinum cards',
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

export function isPremiumCard(card: CreditCard): boolean {
    if (isStudentCard(card)) {
        return false;
    }

    if (!Number.isFinite(card.annualFee) || card.annualFee < PREMIUM_ANNUAL_FEE_CAD) {
        return false;
    }

    if (BASIC_CASH_BACK_NAME.test(card.creditCardName) && !PREMIUM_TIER_NAME.test(card.creditCardName)) {
        return false;
    }

    return true;
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
        case 'premium':
            return cards.filter(isPremiumCard);
    }
}

export function getMatchingHubsForCard(card: CreditCard): HubDefinition[] {
    return HUBS.filter((hub) => filterCardsForHub([card], hub.slug).length > 0);
}
