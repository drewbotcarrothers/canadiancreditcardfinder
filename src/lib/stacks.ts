import type { GuideEntry } from './guides';
import { getGuides } from './guides';

export const STACK_DISCLAIMER =
    'Offers, annual fees, earn rates, and welcome bonuses change. Figures shown for each card come from our live catalog — confirm every number on the card page and with the issuer before you apply. Stack advice is only for people who pay the balance in full every month. This is general information for Canadians, not financial advice, and not a guarantee of approval.';

export interface StackCardRef {
    slug: string;
    role: string;
    note?: string;
}

export interface StackFaq {
    question: string;
    answer: string;
}

export interface StackYoutube {
    title: string;
    url: string;
}

export interface StackPersona {
    slug: string;
    name: string;
    shortWho: string;
    stackSummary: string;
    h1: string;
    metaTitle: string;
    metaDescription: string;
    complexity: string;
    intro: string;
    who: string[];
    spendingProfile: string;
    goals: string[];
    painPoints: string[];
    recommended: StackCardRef[];
    alternatives: StackCardRef[];
    notForYou: string[];
    relatedHubs: { href: string; label: string }[];
    relatedGuideIds: string[];
    youtube?: StackYoutube;
    faqs: StackFaq[];
}

/**
 * Credit card stack personas for /stacks/.
 * Card fees and earn rates are never hard-coded here — pages pull them live via slug.
 * Persona copy follows the enriched set; skip known data gaps (Simplii fee conflict,
 * secured cards not in catalog). The Marriott Bonvoy Amex free-night award is
 * stated from American Express’s cardmember benefits page.
 */
export const STACK_PERSONAS: readonly StackPersona[] = [
    {
        slug: 'set-and-forget-cash-back',
        name: 'Set-and-forget cash backer',
        shortWho: 'Pays in full, wants a fair return, and does not want to juggle cards.',
        stackSummary: 'One $0 cash-back card (Tangerine, SimplyCash, or Rogers Red).',
        h1: 'The set-and-forget cash back stack (Canada)',
        metaTitle: 'Set-and-Forget Cash Back Credit Card Stack (Canada 2026)',
        metaDescription:
            'A simple Canadian cash-back stack: one no-fee card for everyday spend. See Tangerine, SimplyCash, and Rogers Red with live fees from our catalog.',
        complexity: '1-card',
        intro:
            'This stack is for Canadians who pay the balance in full and want a fair cash return without tracking categories every week. Start with one strong no-fee card. Add a second only if one heavy category is left behind.',
        who: [
            'You pay in full every month and keep spend moderate.',
            'You have used the same bank card for years and want a simple upgrade.',
            'You would rather see statement credits than learn a points program.',
            'You will carry at most one or two cards.',
        ],
        spendingProfile:
            'Everyday mix across groceries, gas, and bills — without heavy category optimization. Illustrative reference spend is around $2,000 a month; use your own statement, not that figure, when you compare.',
        goals: [
            'Roughly mid-single-digit cash back on the categories that matter, with a $0 annual fee when possible.',
            'Nothing to track beyond autopay.',
            'A clear answer to “am I leaving much on the table?”',
        ],
        painPoints: [
            'Comparison pages that feel like ads.',
            'Points programs that can change value.',
            'Caps and rotating categories that feel like homework.',
        ],
        recommended: [
            {
                slug: 'tangerine-money-back-credit-card',
                role: 'Primary everyday card',
                note: 'Pick the bonus categories that match your month. Confirm the live category list on the card page.',
            },
            {
                slug: 'simplycash-card-from-american-express',
                role: 'Optional Amex cash-back card',
                note: '2% at stand-alone gas and grocery in Canada, up to $15,000 combined a year, then 1.25%. Keep a Visa or Mastercard backup.',
            },
            {
                slug: 'rogers-red-mastercard',
                role: 'Optional Rogers-path everyday card',
                note: 'Best when you already have an eligible Rogers, Fido, Shaw, or Comwave service. Confirm earn caps on the card page.',
            },
        ],
        alternatives: [
            {
                slug: 'rogers-red-world-mastercard',
                role: 'Rogers path with World Mastercard benefits',
                note: 'Still $0 in our catalog — confirm current earn and caps on the card page.',
            },
        ],
        notForYou: [
            'You carry a revolving balance (interest usually wipes cash back).',
            'You want travel points, lounges, or insurance as the main payoff.',
            'You are willing to run three or four cards to maximize every category — see the category maximizer stack instead.',
            'You need a World Elite product for income-gated flat rates and do not mind the income test — compare Rogers Red World Elite on its own card page.',
        ],
        relatedHubs: [
            { href: '/best/no-annual-fee/', label: 'Best no-annual-fee cards' },
            { href: '/best/cash-back/', label: 'Best cash-back cards' },
            { href: '/finder/', label: 'Card finder' },
        ],
        relatedGuideIds: [
            'best-no-annual-fee-credit-cards-canada',
            'best-cash-back-credit-cards-canada',
        ],
        faqs: [
            {
                question: 'Do I need more than one cash-back card?',
                answer:
                    'Usually no. One well-chosen $0 card covers most people in this persona. Add a second only when a single heavy category (for example dining on Amex, or Rogers bill redemption) clearly beats your primary card after you check live rates.',
            },
            {
                question: 'Is a no-fee card always better than a paid cash-back card?',
                answer:
                    'Not always. A paid card can win if your grocery and bill spend clears the fee after you run the math on the live earn rates. If you will not track that math, stay on a $0 card.',
            },
            {
                question: 'Should newcomers start here?',
                answer:
                    'If you already have a Canadian credit file and can get approved for a mainstream $0 rewards card, yes. If you are brand new to Canadian credit, start with the newcomer stack first.',
            },
        ],
    },
    {
        slug: 'category-maximizer',
        name: 'Category maximizer',
        shortWho: 'Comfortable with a few cards so every everyday dollar earns its best rate.',
        stackSummary: 'Cobalt for food + Passport VI backup ± flat Mastercard catch-all.',
        h1: 'The category maximizer credit card stack (Canada)',
        metaTitle: 'Category Maximizer Credit Card Stack Canada (2026)',
        metaDescription:
            'Build a Canadian everyday stack: high-earn food card, Visa or Mastercard backup, and optional catch-all. Live fees from our catalog.',
        complexity: '3+ card',
        intro:
            'This is the classic “credit card stack”: each card has a job. Put food on the high multiplier, non-Amex and foreign spend on a Visa Infinite backup, and everything else on a flat Mastercard when you need it.',
        who: [
            'You pay in full and are comfortable choosing the right card at the till.',
            'Monthly spend is large enough that category rates matter (often a few thousand dollars across groceries, dining, gas, and bills).',
            'You will pay one annual fee when the net return after the fee still wins.',
        ],
        spendingProfile:
            'Split spend across food, gas or transit, recurring bills, and a catch-all. Illustrative reference households often sit around $3,000 or more a month — use your own categories.',
        goals: [
            'Highest net return per category after fees.',
            'A backup network where American Express is not taken.',
            'A clear fee break-even you can explain in one sentence.',
        ],
        painPoints: [
            'Amex gaps at warehouse clubs and some grocery banners.',
            'Monthly earn caps.',
            'Merchants that code into the wrong category.',
        ],
        recommended: [
            {
                slug: 'american-express-cobalt-card',
                role: 'Food and stand-alone grocery earner',
                note: 'Watch the monthly combined cap on the 5x bucket. Superstores and warehouse clubs usually miss grocery coding.',
            },
            {
                slug: 'scotiabank-passport-visa-infinite-card',
                role: 'Visa backup and no-foreign-fee travel card',
                note: 'Also carries lounge passes in current features. Infinite-style income rules apply — confirm on the card page. Scotiabank welcome offers often exclude recent personal-card holders.',
            },
            {
                slug: 'rogers-red-world-elite-mastercard',
                role: 'Optional flat Mastercard catch-all',
                note: 'World Elite income rules apply. Use where Amex is declined and you want a simple cash rate.',
            },
        ],
        alternatives: [
            {
                slug: 'scotia-momentum-visa-infinite-card',
                role: 'Cash path — groceries and recurring bills',
                note: 'Pairs with a $0 Amex or Mastercard catch-all if you prefer cash back over Membership Rewards.',
            },
            {
                slug: 'simplycash-card-from-american-express',
                role: 'Cash path — 2% stand-alone gas and grocery, 1.25% on other Amex spend',
                note: 'The 2% rate stops after $15,000 in combined gas and grocery purchases a year.',
            },
            {
                slug: 'american-express-gold-rewards-card',
                role: 'When food spend regularly blows past Cobalt’s monthly 5x cap',
                note: 'Broader 2x grocery/gas/drugstore and travel mix — compare on the Cobalt vs Gold guide.',
            },
        ],
        notForYou: [
            'You want one card and zero decisions — use the set-and-forget stack.',
            'Costco is your main grocery run — start with the Costco & family stack (Mastercard first).',
            'You will not pay Infinite or Cobalt fees from real category spend.',
        ],
        relatedHubs: [
            { href: '/best/groceries/', label: 'Best grocery cards' },
            { href: '/best/cash-back/', label: 'Best cash-back cards' },
            { href: '/best/rewards/', label: 'Best rewards cards' },
            { href: '/finder/', label: 'Card finder' },
        ],
        relatedGuideIds: [
            'amex-cobalt-vs-gold-rewards',
            'best-grocery-credit-cards-canada',
            'best-cash-back-credit-cards-canada',
        ],
        youtube: {
            title: 'Amex Cobalt vs Amex Gold Rewards',
            url: 'https://youtu.be/VFFQ5dZIT9U',
        },
        faqs: [
            {
                question: 'How many cards should a maximizer carry?',
                answer:
                    'Three is enough for most people: food earner, network backup, catch-all. A fourth only helps when a real spend bucket is still earning a weak rate.',
            },
            {
                question: 'What if my grocer does not take Amex?',
                answer:
                    'Put that shop on a Visa or Mastercard grocery card (for example Momentum Infinite or a PC Mastercard) and keep Cobalt for dining and Amex-friendly grocers.',
            },
            {
                question: 'Does Cobalt skip foreign-transaction fees?',
                answer:
                    'No. Treat Cobalt as a domestic earner. For foreign-currency spend, use a no-foreign-fee card such as Passport Visa Infinite and confirm the live FX policy on each card page.',
            },
        ],
    },
    {
        slug: 'costco-family',
        name: 'Costco & family household',
        shortWho: 'Family shop runs through Costco and a Loblaw banner — acceptance comes first.',
        stackSummary: 'CIBC Costco + PC World Elite (or PC World) ± bills/travel Visa.',
        h1: 'The Costco and family household credit card stack (Canada)',
        metaTitle: 'Costco & Family Credit Card Stack Canada (2026)',
        metaDescription:
            'Canadian family stack built around Costco Mastercard acceptance and Loblaws-family PC Optimum, with live fees from our catalog.',
        complexity: '2–3 card',
        intro:
            'Warehouse clubs and grocery banners decide the plastic before earn rates do. Costco Canada takes Mastercard in-warehouse. Pair that with a store-ecosystem card for your main grocer, then one Visa for bills or trips.',
        who: [
            'Households with kids and one or two vehicles.',
            'Regular Costco runs plus a Loblaw-family banner (or Walmart) for the weekly shop.',
            'Two cardholders who need a stack simple enough that both partners will use it.',
        ],
        spendingProfile:
            'Groceries and gas dominate. Illustrative reference households mention around $1,500 a month on groceries plus fuel — replace with your own totals.',
        goals: [
            'A lower household bill via cash back or grocery points.',
            'Cards that actually work at the stores you already visit.',
            'At most three cards in the shared wallet.',
        ],
        painPoints: [
            '“Best grocery card” lists that ignore acceptance.',
            'World Elite income tests on a single income.',
            'A partner who will not carry four cards.',
        ],
        recommended: [
            {
                slug: 'cibc-costco-mastercard',
                role: 'Costco warehouse and Costco gas',
                note: 'Costco warehouses and gas bars take Mastercard only. Amex is not accepted at Costco.',
            },
            {
                slug: 'pc-world-elite-mastercard',
                role: 'Loblaws-family PC Optimum earner',
                note: 'Highest PC Financial partner earn tier in our catalog summary — confirm live partner multipliers on the issuer page. World Elite income rules apply.',
            },
            {
                slug: 'scotia-momentum-visa-infinite-card',
                role: 'Bills and supermarket Visa',
                note: 'Use when recurring payments and non-Costco grocery should earn elevated cash back. Infinite income rules apply.',
            },
        ],
        alternatives: [
            {
                slug: 'pc-world-mastercard',
                role: 'Loblaws-family when World Elite income is the blocker',
            },
            {
                slug: 'pc-mastercard',
                role: 'Entry PC Optimum Mastercard',
            },
            {
                slug: 'tangerine-money-back-credit-card',
                role: '$0 bills and category backup instead of a paid Infinite',
            },
            {
                slug: 'scotiabank-passport-visa-infinite-card',
                role: 'Family travel / no-foreign-fee slot',
            },
        ],
        notForYou: [
            'You rarely shop Costco or Loblaws-family stores.',
            'You want a single Amex dining card as the whole strategy — Costco will not take it.',
            'You carry a balance.',
        ],
        relatedHubs: [
            { href: '/best/groceries/', label: 'Best grocery cards' },
            { href: '/best/cash-back/', label: 'Best cash-back cards' },
            { href: '/finder/', label: 'Card finder' },
        ],
        relatedGuideIds: ['best-grocery-credit-cards-canada', 'best-cash-back-credit-cards-canada'],
        youtube: {
            title: 'The Family Credit Card Stack for Canada: 3 Cards, 3 Jobs',
            url: 'https://youtu.be/RRCgr8r2kyQ',
        },
        faqs: [
            {
                question: 'Why start with a Mastercard for Costco?',
                answer:
                    'Costco Canada warehouses and gas bars accept Mastercard, not Visa or American Express. The card has to clear the till before any earn rate matters.',
            },
            {
                question: 'Does the PC World Elite earn Optimum at Costco?',
                answer:
                    'The plastic can go through as a Mastercard, but Optimum partner earn is built for Loblaws-family and listed partners — not as a Costco rewards program. Keep Costco spend on the Costco Mastercard.',
            },
            {
                question: 'What if we fail the World Elite income test?',
                answer:
                    'Step down to PC World or the entry PC Mastercard for Optimum, and keep CIBC Costco for the warehouse. Confirm live income wording on each application.',
            },
        ],
    },
    {
        slug: 'points-traveller',
        name: 'Points traveller',
        shortWho: 'Collects toward a trip from normal spending — not from opening cards every month.',
        stackSummary: 'Cobalt + Aeroplan Visa Infinite + Passport VI (or Scene+ path).',
        h1: 'The points traveller credit card stack (Canada)',
        metaTitle: 'Points Traveller Credit Card Stack Canada (2026)',
        metaDescription:
            'Canadian travel points stack: flexible earner, airline cobrand, and no-foreign-fee backup. Live fees from our catalog.',
        complexity: '2–3+ card',
        intro:
            'Pick one program to learn well. Earn a flexible currency on everyday food spend, add a cobrand for airline purchases and perks, and keep a no-foreign-fee Visa for trip spend where Amex is weak.',
        who: [
            'You take one to three trips a year and care about seat or hotel value.',
            'You pay in full and will learn one loyalty program properly.',
            'You earn mainly from spending you would do anyway.',
        ],
        spendingProfile:
            'Everyday Canadian spend feeding a travel currency, plus some airline and hotel bookings.',
        goals: [
            'More travel value per dollar than flat cash back.',
            'A backup network and a no-foreign-fee option abroad.',
            'A trip-goal view: points needed and how the stack feeds them.',
        ],
        painPoints: [
            'Dynamic award pricing and thin award space.',
            'Transfer partners that take study to use well.',
            'Paying fees for perks you will not use.',
        ],
        recommended: [
            {
                slug: 'american-express-cobalt-card',
                role: 'Flexible / food earner (Membership Rewards)',
                note: 'Points can typically transfer to airline partners including Aeroplan — confirm the live transfer list and ratio in your Amex account. Cobalt is not a no-FX card.',
            },
            {
                slug: 'td-aeroplan-visa-infinite-card',
                role: 'Aeroplan cobrand and Visa backup',
                note: 'Infinite income rules apply. Compare the live CIBC Aeroplan Infinite alternative if you already bank at CIBC.',
            },
            {
                slug: 'scotiabank-passport-visa-infinite-card',
                role: 'No-foreign-fee trip card and lounge passes',
            },
        ],
        alternatives: [
            {
                slug: 'cibc-aeroplan-visa-infinite-card',
                role: 'Alternate Aeroplan Visa Infinite cobrand',
            },
            {
                slug: 'scotiabank-gold-american-express-card',
                role: 'Scene+ path — elevated grocery/dining Amex with no foreign fees in current features',
                note: 'Pairs with Passport Infinite for Visa acceptance and lounge passes.',
            },
            {
                slug: 'american-express-aeroplan-card',
                role: 'Simpler Aeroplan Amex when you want cobrand points without Membership Rewards transfers',
            },
        ],
        notForYou: [
            'You will not redeem points for travel within a year or two — cash back is simpler.',
            'You want lounges and credits as the product — see the premium perks stack.',
            'You are optimizing welcome bonuses more than ongoing earn — that is a different (higher-risk) path.',
        ],
        relatedHubs: [
            { href: '/best/travel/', label: 'Best travel cards' },
            { href: '/best/premium/', label: 'Best premium cards' },
            { href: '/best/rewards/', label: 'Best rewards cards' },
            { href: '/finder/', label: 'Card finder' },
        ],
        relatedGuideIds: [
            'how-to-choose-travel-credit-card-canada',
            'amex-cobalt-vs-gold-rewards',
        ],
        youtube: {
            title: 'Amex Cobalt vs Amex Gold Rewards',
            url: 'https://youtu.be/VFFQ5dZIT9U',
        },
        faqs: [
            {
                question: 'Should I start with Aeroplan or a flexible currency?',
                answer:
                    'If almost every trip is Air Canada, a cobrand is simpler. If you want airline choice later, earn Membership Rewards or a bank currency you can move, then transfer when the trip is booked.',
            },
            {
                question: 'Do I need Passport if I already have Cobalt?',
                answer:
                    'Cobalt does not replace a no-foreign-fee Visa. Passport (or another verified no-FX card) covers FX and merchants that skip Amex.',
            },
            {
                question: 'WestJet or Porter instead of Aeroplan?',
                answer:
                    'Use the matching cobrand pages in our catalog (WestJet RBC, BMO VIPorter) and keep the same backup logic: one earner, one network backup, one no-FX card when you travel abroad.',
            },
        ],
    },
    {
        slug: 'churner-keepers',
        name: 'Churner (keepers & eligibility)',
        shortWho: 'Tracks welcome offers and issuer rules — this page covers keepers and eligibility only.',
        stackSummary: 'Keeper examples: Cobalt, Passport VI, Aeroplan Infinite — plus offer hygiene.',
        h1: 'Welcome offers and keeper cards (Canada)',
        metaTitle: 'Credit Card Welcome Offers & Keeper Cards Canada (2026)',
        metaDescription:
            'How Canadians think about welcome-offer eligibility and long-term keeper cards. No churning how-to — live fees and rules from our catalog.',
        complexity: '3+ (pipeline + keepers)',
        intro:
            'Some Canadians focus on first-year welcome value more than ongoing earn rates. This page does not teach application sequencing, manufactured spend, or how to game issuer rules. It explains keeper cards worth holding after a bonus, and why eligibility text on each card page matters before you apply.',
        who: [
            'You already pay in full and keep organized records of cards you have held.',
            'You read welcome eligibility and lookback rules before applying.',
            'You want a small set of long-term keepers underneath any short-term products.',
        ],
        spendingProfile:
            'Spend is planned around stated minimum-purchase windows on offers you choose — without inventing purchases you do not need.',
        goals: [
            'Understand issuer eligibility before applying.',
            'Keep one or two strong everyday and travel cards after bonuses end.',
            'Avoid applying blind for a product you already held.',
        ],
        painPoints: [
            'Lifetime bonus limits on some Amex products.',
            'Bank lookbacks and personal-card exclusions (Scotiabank’s two-year personal-card rule shows up often on Scotia cards).',
            'Hard inquiries close to a mortgage application.',
        ],
        recommended: [
            {
                slug: 'american-express-cobalt-card',
                role: 'Everyday Membership Rewards keeper',
                note: 'Check whether you are a current or former Cobalt cardmember before counting on a welcome bonus.',
            },
            {
                slug: 'scotiabank-passport-visa-infinite-card',
                role: 'No-FX and lounge keeper',
                note: 'Confirm Scotiabank personal-card welcome exclusions on the live offer.',
            },
            {
                slug: 'td-aeroplan-visa-infinite-card',
                role: 'Aeroplan keeper / Visa network',
                note: 'Compare CIBC Aeroplan Infinite if that is your bank relationship. Read lookback and income text on the card page.',
            },
        ],
        alternatives: [
            {
                slug: 'the-platinum-card',
                role: 'Premium keeper only if you use lounges and credits',
                note: 'High fee — run a keep-or-cancel tally of benefits you actually used.',
            },
            {
                slug: 'cibc-aeroplan-visa-infinite-card',
                role: 'Alternate Aeroplan Infinite keeper',
            },
        ],
        notForYou: [
            'You want a step-by-step churning plan — we do not publish that.',
            'You carry a balance or are about to apply for a mortgage and cannot spare hard pulls.',
            'You only want one simple cash-back card — use the set-and-forget stack.',
        ],
        relatedHubs: [
            { href: '/best/premium/', label: 'Best premium cards' },
            { href: '/best/travel/', label: 'Best travel cards' },
            { href: '/finder/', label: 'Card finder' },
        ],
        relatedGuideIds: [
            'are-premium-credit-cards-worth-it-canada',
            'how-to-choose-travel-credit-card-canada',
        ],
        faqs: [
            {
                question: 'Why will you not publish a churning guide?',
                answer:
                    'Issuer rules change, manufactured spend creates risk, and advice that encourages people to open cards they cannot pay in full causes harm. We stick to catalog facts, eligibility reminders, and keeper fit.',
            },
            {
                question: 'What should I read on every offer?',
                answer:
                    'The welcome bonus detail, the eligibility or “not available if” line, the annual fee, and the minimum spend window. Those fields live on each card page in our catalog.',
            },
            {
                question: 'What is a keeper card?',
                answer:
                    'A product you would still hold after the welcome bonus because ongoing earn rates or perks beat the fee for your real spend — for example Cobalt for food, Passport for foreign spend, or an Aeroplan Infinite you use with Air Canada.',
            },
        ],
    },
    {
        slug: 'newcomer-credit-builder',
        name: 'Newcomer & credit builder',
        shortWho: 'Needs approval and a Canadian credit file before earn rates matter.',
        stackSummary: 'Amex Green, RBC ION, or a student $0 card — then upgrade later.',
        h1: 'The newcomer and credit builder stack (Canada)',
        metaTitle: 'First Credit Card Stack for Newcomers & Students (Canada 2026)',
        metaDescription:
            'Start Canadian credit with $0 cards from our catalog: Amex Green, RBC ION, and student options. Approval is never guaranteed.',
        complexity: '1-card',
        intro:
            'Approval and reportable history come before optimized earn rates. Start with one no-fee card you can pay in full, then graduate into a set-and-forget or maximizer stack once the file has history.',
        who: [
            'Recent immigrants building a Canadian credit file.',
            'Students and anyone with a thin file.',
            'People rebuilding after a damaged file who need a realistic first step.',
        ],
        spendingProfile:
            'Modest everyday spend. Keep utilization low and autopay the full balance.',
        goals: [
            'Get approved for a card that reports to Canadian bureaus.',
            'Pay $0 annual fee while learning the ropes.',
            'Know when to move up to a stronger everyday card.',
        ],
        painPoints: [
            'Declines despite strong foreign credit or income.',
            'Low starting limits.',
            'Advice written only for $80,000 World Elite applicants.',
        ],
        recommended: [
            {
                slug: 'american-express-green-card',
                role: 'No-fee Membership Rewards starter',
                note: 'Still needs a Canadian credit file and Amex acceptance plan — keep a Visa/Mastercard backup when you can.',
            },
            {
                slug: 'rbc-ion-visa',
                role: 'No-fee Visa with Avion on everyday categories',
                note: 'Wider acceptance than Amex for daily life.',
            },
            {
                slug: 'student-bmo-cashback-mastercard',
                role: 'Student cash-back path',
                note: 'Confirm student eligibility on the live application.',
            },
        ],
        alternatives: [
            {
                slug: 'scotiabank-scene-plus-visa-card-for-students',
                role: 'Student Scene+ Visa',
            },
            {
                slug: 'scotiabank-american-express-card-for-students',
                role: 'Student Scene+ Amex',
            },
            {
                slug: 'tangerine-money-back-credit-card',
                role: 'Upgrade target once approval odds and income support a mainstream $0 card',
            },
        ],
        notForYou: [
            'You already have years of Canadian credit and Infinite-level income — skip ahead to set-and-forget or maximizer.',
            'You need a secured card product that is not in our directory yet — we will not invent one.',
            'You plan to carry a balance to “build credit” — pay in full; interest is not a strategy.',
        ],
        relatedHubs: [
            { href: '/best/students/', label: 'Best student cards' },
            { href: '/best/no-annual-fee/', label: 'Best no-annual-fee cards' },
            { href: '/finder/', label: 'Card finder' },
        ],
        relatedGuideIds: [
            'best-student-credit-cards-canada',
            'best-no-annual-fee-credit-cards-canada',
        ],
        faqs: [
            {
                question: 'Can you tell me my approval odds?',
                answer:
                    'No. Issuers use their own credit and income checks. We show catalog cards and eligibility text — never odds.',
            },
            {
                question: 'When should I upgrade?',
                answer:
                    'After you have on-time full payments and a thicker file, compare a mainstream $0 card such as Tangerine Money-Back, then fee cards only if the math clears.',
            },
            {
                question: 'Why is there no secured card on this page?',
                answer:
                    'Our live catalog does not currently include a secured or guaranteed starter product we can link. When one is added, this stack will update.',
            },
        ],
    },
    {
        slug: 'cross-border',
        name: 'Cross-border spender',
        shortWho: 'Snowbirds, US shoppers, and anyone tired of paying ~2.5% on foreign currency.',
        stackSummary: 'Add Passport VI (or Home Trust / Scotia Gold Amex / Brim WE) to your domestic stack.',
        h1: 'The cross-border and no-FX credit card stack (Canada)',
        metaTitle: 'No Foreign Transaction Fee Credit Card Stack Canada (2026)',
        metaDescription:
            'Add a no-FX Canadian card for USD and travel spend: Passport Infinite, Scotia Gold Amex, Home Trust, or Brim. Live fees from our catalog.',
        complexity: '+1 card',
        intro:
            'This is a layer, not a full wallet replacement. Keep your domestic earners, then add one card you use only for foreign-currency spend.',
        who: [
            'Snowbirds who spend months in the US.',
            'Frequent travellers and USD online shoppers.',
            'Freelancers with foreign-currency expenses.',
        ],
        spendingProfile:
            'A meaningful share of spend posts in USD or other foreign currencies on top of a normal Canadian month.',
        goals: [
            'Stop paying a typical ~2.5% foreign-conversion fee on every foreign charge.',
            'Still earn something abroad when possible.',
            'Carry a backup network where Amex is weak.',
        ],
        painPoints: [
            'Few true no-FX cards.',
            'No-fee no-FX options that earn little.',
            'Bonus categories that stop applying abroad.',
        ],
        recommended: [
            {
                slug: 'scotiabank-passport-visa-infinite-card',
                role: 'Primary no-foreign-fee Visa + lounge passes',
                note: 'Infinite income rules apply. Confirm the live no-FX wording on the card page.',
            },
            {
                slug: 'scotiabank-gold-american-express-card',
                role: 'No-FX Amex with Scene+ earn',
                note: 'Foreign purchases may earn less than domestic bonus categories — confirm features.',
            },
            {
                slug: 'home-trust-preferred-visa',
                role: '$0 no-FX candidate',
                note: 'Not offered in Quebec. Confirm the live FX policy on the card page before you treat it as no-FX.',
            },
        ],
        alternatives: [
            {
                slug: 'brim-world-elite-mastercard',
                role: 'World Elite path often marketed with no FX',
                note: 'Confirm FX treatment on the issuer page; income rules may apply.',
            },
            {
                slug: 'rogers-red-world-elite-mastercard',
                role: 'USD earn alternative (not the same as no-FX)',
                note: 'Elevated USD earn paths still need you to check whether a conversion fee applies and what net return remains.',
            },
        ],
        notForYou: [
            'You almost never spend in foreign currency.',
            'You expected Cobalt or Platinum to be no-FX — Canadian Amex personal cards typically add a conversion commission; confirm each agreement.',
            'You live in Quebec and were counting on Home Trust — it is not offered there.',
        ],
        relatedHubs: [
            { href: '/best/us-dollar/', label: 'Best US-dollar cards' },
            { href: '/best/travel/', label: 'Best travel cards' },
            { href: '/best/premium/', label: 'Best premium cards' },
            { href: '/finder/', label: 'Card finder' },
        ],
        relatedGuideIds: [
            'best-us-dollar-credit-cards-canada',
            'how-to-choose-travel-credit-card-canada',
        ],
        faqs: [
            {
                question: 'Is a USD-billed card the same as no-FX?',
                answer:
                    'No. A USD-billed card helps if you hold USD and want to avoid conversion on the statement currency. A no-FX CAD card skips the issuer conversion fee on foreign charges. Many snowbirds use both ideas — compare the US-dollar hub.',
            },
            {
                question: 'Can I just use my grocery card abroad?',
                answer:
                    'You can, but a typical ~2.5% conversion fee often costs more than the rewards you earn. Run the annual FX cost on your real travel spend.',
            },
            {
                question: 'Do I still need a domestic earner?',
                answer:
                    'Yes. Keep Cobalt, Momentum, Tangerine, or your family stack for Canadian spend, and reserve the no-FX card for foreign currency.',
            },
        ],
    },
    {
        slug: 'big-bill-payer',
        name: 'Big-bill payer',
        shortWho: 'Wants rewards on rent, taxes, freelancing costs, or landlord expenses.',
        stackSummary: 'Momentum VI or TD Cash Back Infinite for bills ± flat catch-all; freelancer/landlord angles.',
        h1: 'The big-bill payer credit card stack (Canada)',
        metaTitle: 'Credit Cards for Rent, Bills & Business Spend Canada (2026)',
        metaDescription:
            'Canadian stacks for recurring bills, freelancers, and landlords: Momentum Infinite, TD Cash Back Infinite, and flat catch-alls with live fees.',
        complexity: '1–2 added cards',
        intro:
            'Large fixed outflows — rent, tax instalments, suppliers — only make sense on a card when the earn rate beats any payment-platform fee and you pay in full. Freelancers and landlords also care about clean separation between business and personal spend.',
        who: [
            'Renters in expensive cities exploring card-based rent payments.',
            'Self-employed and incorporated professionals with tax instalments or soft costs.',
            'Small landlords who need acceptance and clear books (never float a new roof on a card).',
        ],
        spendingProfile:
            'High recurring bills and occasional large payments. Platform fees charged by rent or tax payment services are set by those companies — not by our card catalog — so always run break-even with their current fee.',
        goals: [
            'Earn elevated cash back on recurring payments when the merchant codes correctly.',
            'Separate business and personal spend for cleaner books.',
            'Avoid interest and over-limit problems on rent-sized charges.',
        ],
        painPoints: [
            'Thin margins after platform fees.',
            'Payments that code as ordinary purchases instead of recurring bills.',
            'Credit limits that cannot hold a month of rent.',
        ],
        recommended: [
            {
                slug: 'scotia-momentum-visa-infinite-card',
                role: 'Recurring payments and grocery cash back',
                note: 'Confirm whether your payment method codes as a recurring payment under Scotiabank’s rules.',
            },
            {
                slug: 'td-cash-back-visa-infinite-card',
                role: 'Wide 3% stack including recurring bills and streaming',
                note: '3% applies to the first $15,000 a year in each of four bonus categories (recurring bills and streaming share one cap), then 1%.',
            },
            {
                slug: 'rbc-cash-back-preferred-world-elite-mastercard',
                role: 'Flat cash-back catch-all / float card',
                note: 'World Elite income rules apply.',
            },
        ],
        alternatives: [
            {
                slug: 'tangerine-money-back-credit-card',
                role: '$0 category card when you will not pay an Infinite fee',
            },
            {
                slug: 'mbna-rewards-world-elite-mastercard',
                role: 'Freelancer angle — elevated points on dining, groceries, utilities, and digital media',
            },
            {
                slug: 'bmo-cashback-world-elite-mastercard',
                role: 'Landlord / household cash-back angle — strong grocery and transit percentages in current features',
            },
            {
                slug: 'brim-mastercard',
                role: 'Flexible $0 backup for acceptance and separate ledger use',
            },
            {
                slug: 'rogers-red-world-elite-mastercard',
                role: '$0 flat World Elite catch-all when you qualify and want simple cash',
            },
        ],
        notForYou: [
            'You would put capital repairs or uncertain income on a credit card.',
            'Your credit limit cannot hold the payment — do not split dangerously across cards.',
            'You carry a balance.',
        ],
        relatedHubs: [
            { href: '/best/cash-back/', label: 'Best cash-back cards' },
            { href: '/finder/', label: 'Card finder' },
        ],
        relatedGuideIds: ['best-cash-back-credit-cards-canada'],
        faqs: [
            {
                question: 'Is paying rent with a credit card worth it?',
                answer:
                    'Only when the card’s earn rate on that payment exceeds the platform fee and you pay the statement in full. If the payment codes at the base earn rate, the math often fails.',
            },
            {
                question: 'Should freelancers use a “business” card?',
                answer:
                    'A dedicated card for business spend helps bookkeeping even when it is a personal product. Pick earn rates that match software, ads, and supplier categories you actually use.',
            },
            {
                question: 'What about landlords and CapEx?',
                answer:
                    'Operating expenses that fit your limit and payoff plan are different from a new roof. Do not finance capital projects on rewards cards.',
            },
        ],
    },
    {
        slug: 'deal-stacker',
        name: 'Deal stacker',
        shortWho: 'Layers portals and store loyalty on top of the card — card choice is tactical.',
        stackSummary: 'Pick the best catalog card per merchant (PC, Costco, Triangle, Tangerine, Amazon).',
        h1: 'The deal stacker approach (Canada)',
        metaTitle: 'Stack Credit Cards with Portals & Loyalty Canada (2026)',
        metaDescription:
            'Canadian deal stacking: choose the right card per merchant — PC Optimum, Costco, Triangle, Tangerine, Amazon — then layer loyalty. Live fees from our catalog.',
        complexity: 'Tactical (any)',
        intro:
            'Here the card is one layer among several. Store loyalty and cash-back portals can matter more than a fixed three-card wallet. We do not track live portal rates on this site — match the merchant to a strong card from our catalog, then confirm portal terms elsewhere.',
        who: [
            'Bargain hunters who enjoy optimizing a purchase.',
            'People with time to activate offers and check whether bonuses tracked.',
            'Shoppers already in PC Optimum, Triangle, or Amazon ecosystems.',
        ],
        spendingProfile:
            'Modest to moderate spend, redirected through whichever card wins that checkout.',
        goals: [
            'Extra return on purchases you would make anyway.',
            'A checklist mindset: card + loyalty (+ portal when relevant).',
            'Timely deals rather than one evergreen wallet.',
        ],
        painPoints: [
            'Portal purchases that do not track.',
            'Offers that expire or need activating.',
            'Hours spent for a few dollars.',
        ],
        recommended: [
            {
                slug: 'pc-world-elite-mastercard',
                role: 'Loblaws-family / PC Optimum checkouts',
                note: 'Step down to PC World or PC Mastercard if income blocks World Elite.',
            },
            {
                slug: 'cibc-costco-mastercard',
                role: 'Costco warehouse and Costco gas',
            },
            {
                slug: 'triangle-world-elite-mastercard',
                role: 'Canadian Tire family and grocery earn tier',
                note: 'Or Triangle Mastercard if you do not meet World Elite income.',
            },
            {
                slug: 'tangerine-money-back-credit-card',
                role: 'Chosen 2% categories for everything else',
            },
            {
                slug: 'amazon-ca-rewards-mastercard',
                role: 'Amazon.ca and Whole Foods spend',
            },
        ],
        alternatives: [
            {
                slug: 'pc-world-mastercard',
                role: 'PC Optimum without World Elite income',
            },
            {
                slug: 'triangle-mastercard',
                role: 'Triangle path at $0 without World Elite',
            },
        ],
        notForYou: [
            'You want a boring two-card wallet and hate activating offers.',
            'You would stretch spend just to clear a portal bonus.',
            'You carry a balance.',
        ],
        relatedHubs: [
            { href: '/best/groceries/', label: 'Best grocery cards' },
            { href: '/best/cash-back/', label: 'Best cash-back cards' },
            { href: '/best/no-annual-fee/', label: 'Best no-annual-fee cards' },
            { href: '/finder/', label: 'Card finder' },
        ],
        relatedGuideIds: [
            'best-grocery-credit-cards-canada',
            'best-cash-back-credit-cards-canada',
        ],
        faqs: [
            {
                question: 'Do you list cash-back portal rates?',
                answer:
                    'No. Portal offers change constantly. We link the cards; you confirm portal terms on the portal.',
            },
            {
                question: 'Does a portal always stack with a welcome bonus?',
                answer:
                    'Not always. Some issuers exclude certain channels. Read the offer and portal rules before you assume both pay.',
            },
            {
                question: 'Is deal stacking worth minimum wage for your time?',
                answer:
                    'Only on purchases you were making anyway. If the checklist takes longer than the dollar value, simplify to set-and-forget.',
            },
        ],
    },
    {
        slug: 'premium-perks',
        name: 'Premium perks seeker',
        shortWho: 'Buys lounges, insurance, and travel credits — the fee is fine if the perks get used.',
        stackSummary: 'Amex Platinum ± Cobalt or Gold ± optional Marriott; or Passport VI lounge path.',
        h1: 'The premium perks credit card stack (Canada)',
        metaTitle: 'Premium Travel Perks Credit Card Stack Canada (2026)',
        metaDescription:
            'Canadian premium stack focused on lounges and travel perks: Amex Platinum, Gold, Cobalt, Passport Infinite. Live fees from our catalog.',
        complexity: '1–3 premium',
        intro:
            'Premium cards sell comfort and coverage more than an extra half percent. Keep an everyday earner beside the flagship so you are not paying a Platinum-level fee to buy groceries.',
        who: [
            'High earners and frequent travellers who will use lounges and credits.',
            'People who value insurance and trip friction reduction over maximum earn rate.',
            'Households ready to audit the fee against benefits actually used each year.',
        ],
        spendingProfile:
            'Travel-heavy with enough lounge visits and bookings to matter; everyday spend still needs a separate earner.',
        goals: [
            'Perks worth more than the annual fee.',
            'A smoother trip with solid coverage.',
            'An honest keep-or-cancel review before renewal.',
        ],
        painPoints: [
            'Perks being trimmed over time.',
            'Credits you forget to use.',
            'Paying flagship fees for earn rates alone.',
        ],
        recommended: [
            {
                slug: 'the-platinum-card',
                role: 'Premium anchor — lounges and travel credits',
                note: 'Run a keep-or-cancel tally. Additional cards carry their own fee in our catalog.',
            },
            {
                slug: 'american-express-cobalt-card',
                role: 'Everyday dining and grocery earner beside Platinum',
            },
            {
                slug: 'scotiabank-passport-visa-infinite-card',
                role: 'Lower-fee lounge and no-FX path',
                note: 'Six lounge passes in current features — confirm details on the card page.',
            },
        ],
        alternatives: [
            {
                slug: 'american-express-gold-rewards-card',
                role: 'Mid-premium Amex with travel credit and lounge membership pieces',
                note: 'Compare against Cobalt on earn versus perks.',
            },
            {
                slug: 'marriott-bonvoy-american-express-card',
                role: 'Hotel cobrand when Marriott stays are already the plan',
                note: 'Annual Free Night Award each year after the first year of Cardmembership, at a room redemption rate of up to 35,000 points.',
            },
            {
                slug: 'scotiabank-passport-visa-infinite-privilege-card',
                role: 'Higher-fee Passport Privilege when income and travel match',
            },
        ],
        notForYou: [
            'You will not use lounges or travel credits — earn-focused stacks are cheaper.',
            'You want a $0 cash-back wallet.',
            'You carry a balance.',
        ],
        relatedHubs: [
            { href: '/best/premium/', label: 'Best premium cards' },
            { href: '/best/travel/', label: 'Best travel cards' },
            { href: '/finder/', label: 'Card finder' },
        ],
        relatedGuideIds: [
            'are-premium-credit-cards-worth-it-canada',
            'how-to-choose-travel-credit-card-canada',
            'amex-cobalt-vs-gold-rewards',
        ],
        faqs: [
            {
                question: 'How do I know if Platinum is worth it?',
                answer:
                    'List the fee, then only the credits, lounge visits, and insurance events you used last year. If the total you genuinely valued is below the fee, downgrade or switch.',
            },
            {
                question: 'Can Cobalt replace Platinum?',
                answer:
                    'No. Cobalt is an earn card without lounge access or a travel credit in our review. Many people hold Cobalt for food and a premium card for perks.',
            },
            {
                question: 'Does the Marriott Bonvoy Amex include a free night?',
                answer:
                    'Yes. American Express lists an Annual Free Night Award each year after your first year of Cardmembership, at a room redemption rate of up to 35,000 points, plus 15 Elite Night Credits each calendar year and automatic Silver Elite status. Gold Elite follows $30,000 in net purchases in a card year. Confirm the certificate on American Express’s Marriott benefits page before you count on a specific hotel.',
            },
        ],
    },
] as const;

export type StackSlug = (typeof STACK_PERSONAS)[number]['slug'];

const personasBySlug = new Map(STACK_PERSONAS.map((persona) => [persona.slug, persona]));

export function getStackPersonas(): StackPersona[] {
    return [...STACK_PERSONAS];
}

export function getStackPersonaBySlug(slug: string): StackPersona | undefined {
    return personasBySlug.get(slug as StackSlug);
}

export function getStackSlugs(): StackSlug[] {
    return STACK_PERSONAS.map((persona) => persona.slug);
}

export function isStackSlug(slug: string): slug is StackSlug {
    return personasBySlug.has(slug as StackSlug);
}

export function stackPath(slug: string): string {
    return `/stacks/${slug}/`;
}

export async function getRelatedGuidesForStack(persona: StackPersona): Promise<GuideEntry[]> {
    if (persona.relatedGuideIds.length === 0) {
        return [];
    }
    const guides = await getGuides();
    const byId = new Map(guides.map((guide) => [guide.id, guide]));
    return persona.relatedGuideIds.map((id) => {
        const guide = byId.get(id);
        if (!guide) {
            throw new Error(`Stack "${persona.slug}" links to unknown guide "${id}"`);
        }
        return guide;
    });
}

/** Every card slug referenced by any stack — used to fail the build if data is missing. */
export function getAllStackCardSlugs(): string[] {
    const slugs = new Set<string>();
    for (const persona of STACK_PERSONAS) {
        for (const ref of [...persona.recommended, ...persona.alternatives]) {
            slugs.add(ref.slug);
        }
    }
    return [...slugs];
}

export interface StackImage {
    src: string;
    alt: string;
    width: number;
    height: number;
}

/** Featured images live at public/images/stacks/<slug>.webp (1200x630, matches og:image size). */
export const STACK_IMAGE_WIDTH = 1200;
export const STACK_IMAGE_HEIGHT = 630;

const STACK_IMAGE_ALTS: Record<string, string> = {
    'set-and-forget-cash-back':
        'Hand tapping a blank credit card on a payment terminal at a Canadian grocery checkout',
    'category-maximizer':
        'Fuel nozzle in a car at a Canadian gas station in autumn, an everyday spending category',
    'costco-family':
        'Family loading bulk groceries from a warehouse-store cart into a minivan in a snowy Canadian parking lot',
    'points-traveller': 'Traveller with a carry-on suitcase walking through a bright Canadian airport terminal',
    'churner-keepers':
        'Three blank credit cards laid out on a kitchen table beside a notebook, ready to sort which cards to keep',
    'newcomer-credit-builder':
        'Young newcomer holding her first blank credit card among moving boxes in a Toronto apartment',
    'cross-border':
        'Retired Canadian couple loading suitcases into their car in a snowy driveway before a winter trip south',
    'big-bill-payer': 'Brick duplex rental house on a Canadian street, representing rent and landlord expenses',
    'deal-stacker': 'Shopper comparing two products on a shelf in a Canadian pharmacy aisle',
    'premium-perks': 'Quiet airport lounge with armchairs and a buffet overlooking a snowy Canadian runway',
};

export function getStackImage(slug: string): StackImage {
    const alt = STACK_IMAGE_ALTS[slug];
    if (!alt) {
        throw new Error(`Missing featured image alt text for stack: ${slug}`);
    }
    return {
        src: `/images/stacks/${slug}.webp`,
        alt,
        width: STACK_IMAGE_WIDTH,
        height: STACK_IMAGE_HEIGHT,
    };
}
