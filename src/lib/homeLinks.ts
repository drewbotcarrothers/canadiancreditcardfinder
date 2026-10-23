import type { HubSlug } from './hubs';

/**
 * Homepage "Best credit cards in Canada" picks. Card names and annual fees render from the
 * current card record; a pick whose card is no longer listed is dropped at build time.
 * Notes describe each card's published earn or perk, so keep them in step with the card pages.
 * `{rate}` in a note is replaced with the card's current purchase rate.
 */
export interface HomeCategoryPick {
    hub: HubSlug;
    heading: string;
    picks: { slug: string; note: string }[];
}

export const HOME_CATEGORY_PICKS: HomeCategoryPick[] = [
    {
        hub: 'cash-back',
        heading: 'Best cash back credit cards',
        picks: [
            { slug: 'tangerine-money-back-credit-card', note: '2% in categories you choose' },
            { slug: 'cibc-dividend-visa-infinite-card', note: '4% on groceries, gas and EV charging' },
        ],
    },
    {
        hub: 'no-annual-fee',
        heading: 'Best no annual fee credit cards',
        picks: [
            { slug: 'simplii-financial-cash-back-visa', note: '4% at restaurants and coffee shops' },
            { slug: 'simplycash-card-from-american-express', note: '1.25% on everyday purchases' },
        ],
    },
    {
        hub: 'travel',
        heading: 'Best travel credit cards',
        picks: [
            { slug: 'td-aeroplan-visa-infinite-card', note: 'Aeroplan points on a Visa' },
            { slug: 'westjet-rbc-world-elite-mastercard', note: 'for people who fly WestJet' },
        ],
    },
    {
        hub: 'rewards',
        heading: 'Best rewards credit cards',
        picks: [
            { slug: 'american-express-cobalt-card', note: '5x on eats and drinks' },
            { slug: 'rbc-avion-visa-infinite', note: 'flexible Avion points' },
        ],
    },
    {
        hub: 'groceries',
        heading: 'Best grocery credit cards',
        picks: [
            { slug: 'pc-world-elite-mastercard', note: 'PC Optimum at Loblaw stores' },
            { slug: 'cibc-costco-mastercard', note: 'the Mastercard for Costco members' },
        ],
    },
    {
        hub: 'low-interest',
        heading: 'Best low interest credit cards',
        picks: [
            { slug: 'mbna-true-line-mastercard', note: '{rate} purchase rate' },
            { slug: 'td-low-rate-visa-card', note: '{rate} purchase rate' },
        ],
    },
    {
        hub: 'students',
        heading: 'Best student credit cards',
        picks: [
            { slug: 'student-bmo-cashback-mastercard', note: '3% cash back on groceries' },
            { slug: 'cibc-dividend-visa-card-for-students', note: '2% cash back on groceries' },
        ],
    },
    {
        hub: 'us-dollar',
        heading: 'Best U.S. dollar credit cards',
        picks: [
            { slug: 'bmo-u-s-dollar-mastercard', note: 'fee rebated after U.S. $3,000 in spend' },
            { slug: 'rbc-u-s-dollar-visa-gold', note: 'earns Avion points on U.S. spending' },
        ],
    },
    {
        hub: 'premium',
        heading: 'Best premium credit cards',
        picks: [
            { slug: 'scotiabank-passport-visa-infinite-privilege-card', note: 'lounge visits and no FX fees' },
            { slug: 'td-aeroplan-visa-infinite-privilege-credit-card', note: '2 points per $1 with Air Canada' },
        ],
    },
];

/** Guides and stacks linked from the homepage, grouped by the question they answer. */
export const HOME_GUIDE_GROUPS: { heading: string; links: { href: string; label: string; note: string }[] }[] = [
    {
        heading: 'Choosing a card',
        links: [
            { href: '/guides/best-cash-back-credit-cards-canada/', label: 'How to choose a cash back card', note: 'category vs flat rate' },
            { href: '/guides/best-no-annual-fee-credit-cards-canada/', label: 'How to choose a no-fee card', note: 'when $0 is the right answer' },
            { href: '/guides/how-to-choose-travel-credit-card-canada/', label: 'How to choose a travel card', note: 'airline, hotel or flexible points' },
            { href: '/guides/cash-back-vs-points-credit-cards-canada/', label: 'Cash back vs points', note: 'which pays you more' },
            { href: '/guides/low-interest-vs-rewards-credit-cards-canada/', label: 'Low interest vs rewards', note: 'if you carry a balance' },
            { href: '/guides/are-premium-credit-cards-worth-it-canada/', label: 'Are premium cards worth it?', note: 'the annual fee math' },
        ],
    },
    {
        heading: 'Banks and programs',
        links: [
            { href: '/guides/rbc-vs-td-vs-scotiabank-credit-cards/', label: 'RBC vs TD vs Scotiabank', note: 'the big-bank lineups compared' },
            { href: '/guides/aeroplan-vs-scene-plus-canada/', label: 'Aeroplan vs Scene+', note: 'which points to collect' },
            { href: '/guides/pc-optimum-explained/', label: 'PC Optimum explained', note: 'Loblaw points' },
            { href: '/guides/best-us-dollar-credit-cards-canada/', label: 'U.S. dollar cards', note: 'who needs one' },
        ],
    },
    {
        heading: 'Getting approved',
        links: [
            { href: '/guides/credit-cards-for-newcomers-canada/', label: 'Credit cards for newcomers', note: 'building a Canadian file' },
            { href: '/guides/best-student-credit-cards-canada/', label: 'Student credit cards', note: 'first card in school' },
            { href: '/guides/how-credit-scores-work-canada/', label: 'How credit scores work', note: 'Equifax and TransUnion' },
        ],
    },
    {
        heading: 'Ready-made card stacks',
        links: [
            { href: '/stacks/set-and-forget-cash-back/', label: 'Set-and-forget cash back', note: 'one or two cards, no tracking' },
            { href: '/stacks/costco-family/', label: 'Costco and family', note: 'warehouse, groceries and gas' },
            { href: '/stacks/points-traveller/', label: 'Points traveller', note: 'travel rewards wallet' },
            { href: '/stacks/cross-border/', label: 'Cross-border spender', note: 'U.S. and foreign spending' },
            { href: '/stacks/newcomer-credit-builder/', label: 'Newcomer and credit builder', note: 'starting from scratch' },
        ],
    },
];
