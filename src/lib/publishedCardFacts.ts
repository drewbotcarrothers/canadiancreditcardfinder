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
    welcomeBonusDetailed?: string;
    welcomeBonusEligibility?: string;
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
    'american-express-aeroplan-card': {
        features:
            "2 points per $1 on eligible Air Canada and Air Canada Vacations purchases, 1.5 per $1 on eligible dining and food delivery in Canada and at participating Hyatt hotels and resorts, and 1 per $1 on everything else.",
        featuresDetailed:
            "Earns Aeroplan points: 2 per $1 directly with Air Canada and Air Canada Vacations, 1.5 per $1 on eligible dining and food delivery in Canada, 1.5 per $1 directly at participating Hyatt hotels and resorts (July 15, 2026 to July 15, 2029), and 1 per $1 on everything else. A free first checked bag on Air Canada flights for you and up to 8 companions on the same reservation. Points don't expire while you hold the card, and cardmembers can often book flight rewards at preferred pricing. Points can also go to hotels, car rentals, vacation packages and merchandise. Amex has announced a $150 annual fee and new benefits from January 12, 2027.\n\nWhat it means: outside Air Canada and restaurants this is a 1-point-per-dollar card, so $1,000 of everyday spend earns 1,000 points.",
        cardEligibility:
            "Canadian resident with a Canadian credit file, and the age of majority in your province or territory.",
    },
    'american-express-aeroplan-reserve-card': {
        featuresDetailed:
            "3 points per $1 directly with Air Canada (including Air Canada Vacations), 2 per $1 on dining and food delivery in Canada and at participating Hyatt hotels (July 15, 2026 to July 15, 2029), and 1.25 per $1 on everything else. Main perks: a free first checked bag for you and up to 8 companions, Maple Leaf Lounge and Air Canada Café access in Canada and the U.S. with a guest, Priority Pass membership (visits are charged), priority airport services, an Annual Worldwide Companion Pass after $25,000 in net purchases in a card year, up to 25,000 SQC a year (1,000 per $5,000 spent), and up to $100 in NEXUS credits every 4 years.\n\nWhat it means: the companion pass and SQC both need heavy spend. $25,000 a year is about $2,080 a month, so the card pays off mainly for people who fly Air Canada often.",
        insurance:
            "Travel medical (up to $5,000,000 for the first 15 days of a trip, under 65), trip cancellation and interruption, flight and baggage delay, lost or stolen baggage, hotel burglary, rental car theft and damage (MSRP up to $85,000, up to 48 days), $500,000 travel accident, purchase protection and up to 1 extra year of warranty.\n\nWhat it means: this is a full travel package. Check the certificate for per-coverage limits before you drop separate insurance.",
        cardEligibility:
            "Canadian resident with a Canadian credit file, and the age of majority in your province or territory.",
    },
    'american-express-cobalt-card': {
        featuresDetailed:
            "5 points per $1 at restaurants, bars and cafés in Canada, stand-alone grocery stores in Canada and food delivery in Canada, on up to $2,500 in combined net purchases each month, then 1 per $1. 3 per $1 on eligible streaming, 2 per $1 on stand-alone gas stations and local transit or rideshare, and 1 per $1 everywhere else. Hotel and car rental bookings through Amex Travel Online earn 1 extra point. Supplementary cards are $0.\n\nWhat it means: the monthly cap allows up to 12,500 points a month (150,000 a year) from food spend, which is more than most households will reach.",
        insurance:
            "Travel medical up to $5,000,000 (under 65, first 15 days), rental car theft and damage, flight and baggage delay (up to $500 combined), lost baggage, hotel burglary, travel accident up to $250,000, mobile device up to $1,000, purchase protection and up to 1 extra year of warranty.\n\nWhat it means: good cover for a mid-fee card, but no trip cancellation is listed, so plan big prepaid trips with that in mind.",
        cardEligibility:
            "Canadian resident with a Canadian credit file, and the age of majority in your province or territory.",
    },
    'american-express-gold-rewards-card': {
        featuresDetailed:
            "2 points per $1 on eligible travel and on gas, grocery and drugstore purchases in Canada, and 1 per $1 elsewhere. Hotel and car rental bookings through Amex Travel Online earn 1 extra point. Perks: a $100 annual travel credit on one Amex Travel Online booking of $100 or more, Priority Pass membership (visit fees apply), 4 Plaza Premium lounge visits a year in Canada, and a $50 NEXUS credit every 4 years. The first supplementary card is free, then $50 a year each.\n\nWhat it means: the $100 travel credit only offsets part of the annual fee if you would book through Amex Travel anyway.",
        insurance:
            "Travel medical (under 65), trip cancellation and interruption, rental car theft and damage, lost baggage, hotel burglary, flight and baggage delay, travel accident up to $500,000, purchase protection (90 days, up to $1,000) and up to 1 extra year of warranty.\n\nWhat it means: broad travel cover. Read the certificate for the limits and age rules before you rely on it.",
        cardEligibility:
            "Canadian resident with a Canadian credit file, and the age of majority in your province or territory.",
    },
    'american-express-green-card': {
        features:
            "1 point per $1 on everyday purchases, plus 1 extra point on eligible hotel and car rental bookings through Amex Travel Online.",
        featuresDetailed:
            "Earns Membership Rewards at 1 point per $1 on eligible purchases, and 2 per $1 on eligible hotel and car rental bookings through Amex Travel Online.\n\nWhat it means: there are no bonus categories, so $20,000 a year of spending earns about 20,000 points.",
        insurance:
            "Purchase protection (90 days, up to $1,000 per occurrence) and up to 1 extra year on the manufacturer's warranty.\n\nWhat it means: no travel insurance is listed, so don't count on this card for trip cover.",
        cardEligibility:
            "Canadian resident with a Canadian credit file, and the age of majority in your province or territory.",
    },
    'cibc-aeroplan-visa-card': {
        features:
            "1 point per $1 on eligible gas, EV charging, groceries and Air Canada purchases (including Air Canada Vacations), and 1 point per $1.50 on everything else. Up to 10 cents off per litre at participating stations with Journie Rewards.",
        featuresDetailed:
            "1 Aeroplan point per $1 on eligible gas, EV charging, groceries and purchases made directly with Air Canada (including Air Canada Vacations), and 1 point per $1.50 on everything else. Linking Journie Rewards gets up to 10 cents off per litre at participating gas stations.\n\nWhat it means: spending outside those categories earns about 0.67 points per dollar, so this card works best when most of your spend is groceries and gas.",
        welcomeBonusDetailed:
            "Earn up to 10,000 Aeroplan points (up to $200 in travel value): 2,500 points when you make your first purchase; 2,500 points when you spend $1,500 or more in the first 4 monthly statement periods; and 5,000 points as an anniversary bonus when you have at least $10,000 in net purchases in the first 12 monthly statement periods.",
    },
    'cibc-aeroplan-visa-infinite-card': {
        featuresDetailed:
            "1.5 points per $1 on eligible gas, EV charging, groceries, purchases made directly with Air Canada (including Air Canada Vacations) and participating Hyatt hotels, and 1 per $1 on everything else. Free first checked bag for you, authorized users and up to 8 companions on Air Canada flights. 1,000 SQC per $20,000 in net purchases (up to 25,000 SQC). Up to 10 cents off per litre on eligible gas, an Avis Preferred Plus upgrade and Visa Infinite concierge.\n\nWhat it means: $500 a month on groceries and gas earns 9,000 points a year before you count any other spending.",
    },
    'marriott-bonvoy-american-express-card': {
        featuresDetailed:
            "5 points per $1 at participating Marriott Bonvoy properties and Bonvoy stores, and 2 per $1 on everything else. An Annual Free Night Award after your first year (rooms up to 35,000 points), 15 Elite Night Credits each calendar year, automatic Silver Elite status, and Gold Elite after $30,000 in net purchases in a card year.\n\nWhat it means: the yearly free night is the main reason to keep the card, and it's only worth something if you'll actually book a Marriott stay.",
        insurance:
            "Rental car theft and damage (MSRP up to $85,000, up to 48 days), flight and baggage delay (up to $500 combined), lost baggage (up to $500), hotel burglary (up to $500), $500,000 travel accident, purchase protection and up to 1 extra year of warranty.\n\nWhat it means: no travel medical or trip cancellation is listed, so arrange those separately.",
    },
    'scotiabank-gold-american-express-card': {
        featuresDetailed:
            "6 Scene+ points per $1 at Sobeys-family grocers (Sobeys, Safeway, FreshCo, Foodland, IGA and others); 5 per $1 at other grocery stores, dining, food delivery, food subscriptions and entertainment; 3 per $1 on gas, daily transit and select streaming; 1 per $1 elsewhere. Accelerated rates apply to the first $50,000 of Canadian-dollar purchases each calendar year. Hotels and car rentals booked through Scene+ Travel earn up to 4 per $1. No foreign transaction fees, and a Priority Pass membership discount.\n\nWhat it means: skipping the typical 2.5% markup saves about $75 on $3,000 of spending abroad.",
        insurance:
            "Travel medical up to $1 million (up to 25 days under 65, 3 days at 65 and older), trip cancellation and interruption, flight delay, delayed and lost luggage, travel accident up to $500,000, rental car damage, hotel burglary, mobile device up to $1,000, purchase security and extended warranty.\n\nWhat it means: the travel medical window is short for travellers 65 and older, so check the age limits before you rely on it.",
    },
    'simplycash-card-from-american-express': {
        featuresDetailed:
            "2% cash back at stand-alone gas stations and grocery stores in Canada on up to $15,000 a year combined, then 1.25%; 1.25% on everything else. Superstores, wholesale clubs, alcohol stores and general merchandise retailers don't count as gas or grocery. The $15,000 limit resets on your card anniversary. No annual fee. Cash back is paid once a year as a statement credit on the September statement.\n\nWhat it means: the 2% tier is worth at most $300 a year, and you wait up to 12 months to see the money.",
        insurance:
            "$100,000 travel accident cover when you charge the full fare to the card, purchase protection (90 days, up to $1,000) and up to 1 extra year of warranty.\n\nWhat it means: no travel medical is listed, so pair this card with other cover for trips.",
    },
    'simplycash-preferred-card-from-american-express': {
        featuresDetailed:
            "4% cash back at stand-alone gas stations and stand-alone grocery stores in Canada on up to $30,000 a year combined (then 2%), and 2% on everything else. Superstores, wholesale clubs, alcohol retailers and general merchandise retailers don't count as gas or grocery. The annual fee is $9.99 a month ($119.88 a year; $119 a year for Quebec residents). Cash back is paid once a year as a statement credit on the September statement. Up to $60 a year in Instacart statement credits through December 31, 2027 (registration required).\n\nWhat it means: at 2%, about $6,000 a year of spending covers the fee before the 4% categories add anything.",
        cardEligibility:
            "Canadian resident with a Canadian credit file, and the age of majority in your province or territory.",
    },
    'td-aeroplan-visa-infinite-card': {
        featuresDetailed:
            "1.5 Aeroplan points per $1 on gas, EV charging, grocery and Air Canada purchases (up to $80,000 of those a year), 1.5 per $1 at participating Hyatt hotels (July 15, 2026 to July 15, 2029), and 1 per $1 on everything else. Free first checked bag on Air Canada flights for you and up to 8 companions on the same reservation, and a NEXUS fee rebate (up to $100) every 48 months for each cardholder.\n\nWhat it means: the $80,000 cap on bonus categories is high enough that most households will never reach it.",
        insurance:
            "Travel medical up to $2 million (first 21 days, or first 4 days if you or your spouse is 65 or older), trip cancellation and interruption, flight delay over 4 hours, delayed and lost baggage, travel accident up to $500,000, rental car damage (up to 48 days), hotel burglary, mobile device up to $1,000, purchase security and extended warranty.\n\nWhat it means: one of the fuller packages at this tier. Confirm the limits in TD's certificate before you skip separate insurance.",
        welcomeBonusEligibility:
            "To be eligible, you must be approved for a TD Aeroplan Visa Infinite Card account while this offer is in effect, and must not have opened any TD Aeroplan Visa account (for example Platinum, Infinite, Infinite Privilege or Business) in the last 12 months.",
    },
    'td-aeroplan-visa-platinum-credit-card': {
        features:
            "1 Aeroplan point per $1 on eligible gas, EV charging, grocery and Air Canada purchases (including Air Canada Vacations), and 1 point per $1.50 on everything else.",
        featuresDetailed:
            "1 Aeroplan point per $1 on gas, EV charging, grocery and Air Canada purchases (up to $80,000 of those a year), and 1 point per $1.50 on everything else.\n\nWhat it means: $1,500 a month split evenly between bonus and other spending earns about 15,000 points a year.",
        welcomeBonusDetailed:
            "10,000 Aeroplan points when you make your first purchase, plus 10,000 more when you spend $1,500 within 90 days of opening the account. The first-year annual fee is rebated for the primary cardholder (activate and make the first purchase within 3 months) and for up to 3 additional cardholders added within 3 months.",
        welcomeBonusEligibility:
            "To be eligible, you must be approved for a TD Aeroplan Visa Platinum Card account while this offer is in effect, and must not have opened any TD Aeroplan Visa account (for example Platinum, Infinite, Infinite Privilege or Business) in the last 12 months.",
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
    if (patch.welcomeBonusDetailed !== undefined) next.welcomeBonusDetailed = patch.welcomeBonusDetailed;
    if (patch.welcomeBonusEligibility !== undefined) next.welcomeBonusEligibility = patch.welcomeBonusEligibility;
    if (patch.omitPurchaseRate) next = withoutRate(next, 'purchase');
    if (patch.omitCashAdvanceRate) next = withoutRate(next, 'cashAdvance');
    return next;
}
