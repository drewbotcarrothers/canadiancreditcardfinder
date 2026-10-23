import type { CardNetwork } from './networkAndOffers';

/** Copy for /best/mastercard/ and /best/visa/. Card picks are built from current card records. */
export interface NetworkPageDefinition {
    slug: 'mastercard' | 'visa';
    network: Extract<CardNetwork, 'Mastercard' | 'Visa'>;
    title: string;
    h1: string;
    description: string;
    intro: string;
    analysis: { heading: string; body: string }[];
    faqs: { question: string; answer: string }[];
    relatedLinks: { href: string; label: string }[];
}

export const NETWORK_PAGES: Record<'mastercard' | 'visa', NetworkPageDefinition> = {
    mastercard: {
        slug: 'mastercard',
        network: 'Mastercard',
        title: 'Best Mastercard Credit Cards in Canada (2026), Compared',
        h1: 'Best Mastercard Credit Cards in Canada (2026)',
        description:
            'The best Mastercard credit cards in Canada for 2026, picked by category: no annual fee, cash back, travel, premium, low interest, student and U.S. dollar cards, with fees and welcome offers.',
        intro:
            'Mastercard is the network to carry if you shop at Costco, and it is the network behind many store and loyalty cards in Canada, including the PC Financial, Canadian Tire Triangle, Walmart and CIBC Costco cards. The picks below are every Mastercard on this site, sorted into categories and ranked by a simple, stated rule, so you can see the strongest current option for how you spend. Open a review before you apply: the review covers earn rates, caps and insurance in detail.',
        analysis: [
            {
                heading: 'How these picks are ranked',
                body: 'Within each category, cards are ranked by first-year value: the welcome offer value the issuer advertises, minus the regular annual fee. Low interest cards are ranked by the lowest listed purchase rate instead, and U.S. dollar cards by the lowest fee. The list rebuilds every time the site is updated, so when an issuer changes an offer or a fee, the order changes with it. First-year value is a starting point, not the whole answer: a card with a smaller welcome offer can still earn more over several years if its everyday rates match your spending. Each review shows those rates.',
            },
            {
                heading: 'Why Mastercard matters in Canada: Costco',
                body: 'Costco warehouses in Canada take Mastercard but not Visa or American Express, according to [Costco Canada\'s payment methods page](https://customerservice.costco.ca/app/answers/answer_view/a_id/1017193/). Costco gas stations also take Mastercard. If Costco is a regular stop, at least one card in your wallet should be a Mastercard. Our [Costco credit card guide](/guides/costco-credit-card-canada/) explains how purchases there are usually coded, which matters because many grocery bonuses don\'t apply at wholesale clubs.',
            },
            {
                heading: 'Mastercard tiers: standard, World and World Elite',
                body: 'The tier on the card tells you roughly what comes with it. Standard Mastercards usually have no income requirement. World Mastercard cards add some benefits and usually ask for a moderate income. World Elite Mastercard cards carry the richest insurance and perks, and usually require $80,000 personal or $150,000 household income. Several World Elite cards, such as the [Rogers Red World Elite](/card/rogers-red-world-elite-mastercard/), [PC World Elite](/card/pc-world-elite-mastercard/) and [Triangle World Elite](/card/triangle-world-elite-mastercard/), have no annual fee, which is unusual for a top-tier card. Our [income requirements guide](/guides/visa-infinite-world-elite-income-requirements-canada/) explains where the thresholds come from.',
            },
            {
                heading: 'Pairing a Mastercard with other cards',
                body: 'A common setup is an American Express card for restaurants and groceries where it is accepted, plus a no-fee Mastercard for Costco and anywhere Amex is refused. Our [Amex acceptance guide](/guides/amex-acceptance-canada/) covers where Amex works, and the [card stacks](/stacks/) show complete two- and three-card setups.',
            },
        ],
        faqs: [
            {
                question: 'What is the best Mastercard in Canada?',
                answer: 'It depends on what you want from the card. The top pick in each category above is the Mastercard with the highest current first-year value in that category. If you only want one card, start with the no annual fee or cash back picks, then read the review to check the everyday earn rates against your spending.',
            },
            {
                question: 'Is Mastercard or Visa better in Canada?',
                answer: 'Neither network earns rewards on its own; the issuer sets the rewards. The practical difference is acceptance: Costco warehouses in Canada take Mastercard but not Visa. Outside Costco, both are accepted almost everywhere in Canada. See the [best Visa cards](/best/visa/) to compare.',
            },
            {
                question: 'Which Mastercards have no annual fee?',
                answer: 'Many do, including several World Elite cards. The no annual fee section above lists the top picks, and the [no annual fee hub](/best/no-annual-fee/) lists every $0 card on the site across all networks.',
            },
            {
                question: 'Do I need a World Elite Mastercard?',
                answer: 'Only if you will use what it adds, usually travel insurance and higher earn rates, and you meet the income requirement. A standard or World Mastercard is often enough for Costco and everyday spending.',
            },
        ],
        relatedLinks: [
            { href: '/best/visa/', label: 'Best Visa cards' },
            { href: '/credit-card-offers/', label: 'Credit card offers this month' },
            { href: '/guides/costco-credit-card-canada/', label: 'Costco credit card guide' },
            { href: '/best/no-annual-fee/', label: 'Best no annual fee cards' },
        ],
    },
    visa: {
        slug: 'visa',
        network: 'Visa',
        title: 'Best Visa Credit Cards in Canada (2026), Compared',
        h1: 'Best Visa Credit Cards in Canada (2026)',
        description:
            'The best Visa credit cards in Canada for 2026, picked by category: no annual fee, cash back, travel, premium, low interest, student and U.S. dollar cards, with fees and welcome offers.',
        intro:
            'Visa is the network behind most of the big banks\' flagship travel cards in Canada, including the TD and CIBC Aeroplan cards, RBC Avion and Scotiabank Passport. The picks below are every Visa card on this site, sorted into categories and ranked by a simple, stated rule, so you can see the strongest current option for how you spend. Open a review before you apply: the review covers earn rates, caps and insurance in detail.',
        analysis: [
            {
                heading: 'How these picks are ranked',
                body: 'Within each category, cards are ranked by first-year value: the welcome offer value the issuer advertises, minus the regular annual fee. Low interest cards are ranked by the lowest listed purchase rate instead, and U.S. dollar cards by the lowest fee. The list rebuilds every time the site is updated, so when an issuer changes an offer or a fee, the order changes with it. First-year value is a starting point, not the whole answer: a card with a smaller welcome offer can still earn more over several years if its everyday rates match your spending. Each review shows those rates.',
            },
            {
                heading: 'Visa tiers: Platinum, Infinite and Infinite Privilege',
                body: 'The tier on a Visa card tells you roughly what comes with it. Classic and Platinum Visa cards usually have no income requirement. Visa Infinite cards add stronger insurance and perks and usually require $60,000 personal or $100,000 household income. Visa Infinite Privilege cards sit above that, usually at $150,000 personal or $200,000 household income, or assets with the bank. Our [income requirements guide](/guides/visa-infinite-world-elite-income-requirements-canada/) explains where those numbers come from and what to do if you\'re just below them.',
            },
            {
                heading: 'The one place Visa does not work: Costco warehouses',
                body: 'Costco warehouses and gas stations in Canada take Mastercard, not Visa, although Costco.ca accepts Visa, according to [Costco Canada\'s payment methods page](https://customerservice.costco.ca/app/answers/answer_view/a_id/1017193/). If Costco is a regular stop, pair your Visa with a no-fee Mastercard. Our [Costco credit card guide](/guides/costco-credit-card-canada/) covers the options, and the [best Mastercard picks](/best/mastercard/) are a short list.',
            },
            {
                heading: 'Aeroplan, Avion and Scene+ on Visa',
                body: 'If you want a big-bank travel program, you will usually end up on Visa. TD and CIBC issue Aeroplan Visa cards, RBC\'s Avion cards are Visa, and Scotiabank\'s Passport and Scene+ Visa cards earn Scene+. Our [Aeroplan for beginners](/guides/aeroplan-for-beginners-canada/) and [Aeroplan vs Scene+](/guides/aeroplan-vs-scene-plus-canada/) guides help you choose a program before you choose a card.',
            },
        ],
        faqs: [
            {
                question: 'What is the best Visa card in Canada?',
                answer: 'It depends on what you want from the card. The top pick in each category above is the Visa with the highest current first-year value in that category. If you fly Air Canada, start with the travel picks; if you want simple rewards, start with cash back or no annual fee.',
            },
            {
                question: 'Is Visa or Mastercard better in Canada?',
                answer: 'Neither network earns rewards on its own; the issuer sets the rewards. The practical difference is acceptance: Costco warehouses in Canada take Mastercard but not Visa. Outside Costco, both are accepted almost everywhere in Canada. See the [best Mastercard cards](/best/mastercard/) to compare.',
            },
            {
                question: 'What income do I need for a Visa Infinite card?',
                answer: 'Usually $60,000 personal or $100,000 household income, though each issuer sets its own wording. Check the review and the issuer page for the card you want.',
            },
            {
                question: 'Can I use a Visa card at Costco in Canada?',
                answer: 'Only on Costco.ca. Costco warehouses and gas stations in Canada take Mastercard, not Visa.',
            },
        ],
        relatedLinks: [
            { href: '/best/mastercard/', label: 'Best Mastercard cards' },
            { href: '/credit-card-offers/', label: 'Credit card offers this month' },
            { href: '/guides/visa-infinite-world-elite-income-requirements-canada/', label: 'Visa Infinite income requirements' },
            { href: '/best/travel/', label: 'Best travel cards' },
        ],
    },
};
