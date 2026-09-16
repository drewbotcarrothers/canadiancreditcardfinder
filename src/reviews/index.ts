import type { CreditCard } from '../lib/types';
import {
    getHubBySlug,
    getMatchingHubsForCard,
    type HubDefinition,
} from '../lib/hubs';
import type { CardEditorialReview } from './types';

import amazonCaRewardsMastercard from './amazon-ca-rewards-mastercard';
import americanExpressAeroplanCard from './american-express-aeroplan-card';
import americanExpressAeroplanReserveCard from './american-express-aeroplan-reserve-card';
import americanExpressCobaltCard from './american-express-cobalt-card';
import americanExpressGoldRewardsCard from './american-express-gold-rewards-card';
import americanExpressGreenCard from './american-express-green-card';
import bmoAscendWorldEliteMastercard from './bmo-ascend-world-elite-mastercard';
import bmoBlueRewardsMastercard from './bmo-blue-rewards-mastercard';
import bmoBlueRewardsWorldEliteMastercard from './bmo-blue-rewards-world-elite-mastercard';
import bmoCashbackMastercard from './bmo-cashback-mastercard';
import bmoCashbackWorldEliteMastercard from './bmo-cashback-world-elite-mastercard';
import bmoEclipseVisaInfiniteCard from './bmo-eclipse-visa-infinite-card';
import bmoEclipseVisaInfinitePrivilegeCard from './bmo-eclipse-visa-infinite-privilege-card';
import bmoViporterWorldEliteMastercard from './bmo-viporter-world-elite-mastercard';
import brimWorldEliteMastercard from './brim-world-elite-mastercard';
import cibcAeroplanVisaCard from './cibc-aeroplan-visa-card';
import cibcAeroplanVisaInfiniteCard from './cibc-aeroplan-visa-infinite-card';
import cibcAeroplanVisaInfinitePrivilegeCard from './cibc-aeroplan-visa-infinite-privilege-card';
import cibcAventuraGoldVisaCard from './cibc-aventura-gold-visa-card';
import cibcAventuraVisaCard from './cibc-aventura-visa-card';
import cibcAventuraVisaInfiniteCard from './cibc-aventura-visa-infinite-card';
import cibcAventuraVisaInfinitePrivilegeCard from './cibc-aventura-visa-infinite-privilege-card';
import cibcCostcoMastercard from './cibc-costco-mastercard';
import cibcDividendPlatinumVisaCard from './cibc-dividend-platinum-visa-card';
import cibcDividendVisaInfiniteCard from './cibc-dividend-visa-infinite-card';
import desjardinsOdysseyVisaInfinitePrivilege from './desjardins-odyssey-visa-infinite-privilege';
import marriottBonvoyAmericanExpressCard from './marriott-bonvoy-american-express-card';
import mbnaRewardsWorldEliteMastercard from './mbna-rewards-world-elite-mastercard';
import nationalBankWorldEliteMastercard from './national-bank-world-elite-mastercard';
import pcMastercard from './pc-mastercard';
import pcWorldEliteMastercard from './pc-world-elite-mastercard';
import pcWorldMastercard from './pc-world-mastercard';
import rbcAvionVisaInfinite from './rbc-avion-visa-infinite';
import rbcAvionVisaInfinitePrivilege from './rbc-avion-visa-infinite-privilege';
import rbcAvionVisaPlatinum from './rbc-avion-visa-platinum';
import rbcBritishAirwaysVisaInfinite from './rbc-british-airways-visa-infinite';
import rbcCashBackMastercard from './rbc-cash-back-mastercard';
import rbcCashBackPreferredWorldEliteMastercard from './rbc-cash-back-preferred-world-elite-mastercard';
import rbcIonPlusVisa from './rbc-ion-plus-visa';
import rbcIonVisa from './rbc-ion-visa';
import rogersRedMastercard from './rogers-red-mastercard';
import rogersRedWorldEliteMastercard from './rogers-red-world-elite-mastercard';
import rogersRedWorldLegendMastercard from './rogers-red-world-legend-mastercard';
import rogersRedWorldMastercard from './rogers-red-world-mastercard';
import scotiaMomentumNoFeeVisaCard from './scotia-momentum-no-fee-visa-card';
import scotiaMomentumVisaInfiniteCard from './scotia-momentum-visa-infinite-card';
import scotiabankAmericanExpressCard from './scotiabank-american-express-card';
import scotiabankGoldAmericanExpressCard from './scotiabank-gold-american-express-card';
import scotiabankPassportVisaInfiniteCard from './scotiabank-passport-visa-infinite-card';
import scotiabankPassportVisaInfinitePrivilegeCard from './scotiabank-passport-visa-infinite-privilege-card';
import scotiabankPlatinumAmericanExpressCard from './scotiabank-platinum-american-express-card';
import scotiabankSceneVisaCard from './scotiabank-scene-visa-card';
import simpliiFinancialCashBackVisa from './simplii-financial-cash-back-visa';
import simplycashCardFromAmericanExpress from './simplycash-card-from-american-express';
import simplycashPreferredCardFromAmericanExpress from './simplycash-preferred-card-from-american-express';
import tangerineMoneyBackCreditCard from './tangerine-money-back-credit-card';
import tangerineMoneyBackWorldMastercard from './tangerine-money-back-world-mastercard';
import tdAeroplanVisaInfiniteCard from './td-aeroplan-visa-infinite-card';
import tdAeroplanVisaInfinitePrivilegeCreditCard from './td-aeroplan-visa-infinite-privilege-credit-card';
import tdAeroplanVisaPlatinumCreditCard from './td-aeroplan-visa-platinum-credit-card';
import tdCashBackVisaCard from './td-cash-back-visa-card';
import tdCashBackVisaInfiniteCard from './td-cash-back-visa-infinite-card';
import tdFirstClassTravelVisaInfiniteCard from './td-first-class-travel-visa-infinite-card';
import tdPlatinumTravelVisaCard from './td-platinum-travel-visa-card';
import thePlatinumCard from './the-platinum-card';
import triangleMastercard from './triangle-mastercard';
import triangleWorldEliteMastercard from './triangle-world-elite-mastercard';
import walmartRewardsMastercard from './walmart-rewards-mastercard';
import westjetRbcMastercard from './westjet-rbc-mastercard';
import westjetRbcWorldEliteMastercard from './westjet-rbc-world-elite-mastercard';

const REVIEW_LIST: CardEditorialReview[] = [
    americanExpressCobaltCard,
    americanExpressGoldRewardsCard,
    thePlatinumCard,
    americanExpressAeroplanCard,
    americanExpressAeroplanReserveCard,
    tdAeroplanVisaInfiniteCard,
    tdAeroplanVisaInfinitePrivilegeCreditCard,
    scotiabankPassportVisaInfiniteCard,
    rogersRedWorldEliteMastercard,
    bmoCashbackWorldEliteMastercard,
    rbcAvionVisaInfinite,
    tangerineMoneyBackCreditCard,
    simpliiFinancialCashBackVisa,
    westjetRbcWorldEliteMastercard,
    cibcAeroplanVisaInfiniteCard,
    scotiabankGoldAmericanExpressCard,
    rbcAvionVisaInfinitePrivilege,
    tdCashBackVisaInfiniteCard,
    cibcDividendVisaInfiniteCard,
    nationalBankWorldEliteMastercard,
    cibcCostcoMastercard,
    amazonCaRewardsMastercard,
    pcWorldEliteMastercard,
    triangleWorldEliteMastercard,
    scotiaMomentumVisaInfiniteCard,
    scotiabankPassportVisaInfinitePrivilegeCard,
    simplycashPreferredCardFromAmericanExpress,
    cibcAventuraVisaInfiniteCard,
    tdFirstClassTravelVisaInfiniteCard,
    bmoEclipseVisaInfiniteCard,
    americanExpressGreenCard,
    simplycashCardFromAmericanExpress,
    marriottBonvoyAmericanExpressCard,
    rogersRedMastercard,
    rogersRedWorldLegendMastercard,
    cibcAeroplanVisaInfinitePrivilegeCard,
    scotiabankPlatinumAmericanExpressCard,
    rbcBritishAirwaysVisaInfinite,
    bmoEclipseVisaInfinitePrivilegeCard,
    scotiabankSceneVisaCard,
    cibcAventuraVisaInfinitePrivilegeCard,
    bmoBlueRewardsWorldEliteMastercard,
    bmoCashbackMastercard,
    triangleMastercard,
    pcMastercard,
    tangerineMoneyBackWorldMastercard,
    rbcAvionVisaPlatinum,
    tdAeroplanVisaPlatinumCreditCard,
    rbcIonPlusVisa,
    walmartRewardsMastercard,
    cibcAventuraVisaCard,
    cibcAventuraGoldVisaCard,
    bmoBlueRewardsMastercard,
    rbcIonVisa,
    rbcCashBackPreferredWorldEliteMastercard,
    westjetRbcMastercard,
    tdCashBackVisaCard,
    scotiabankAmericanExpressCard,
    scotiaMomentumNoFeeVisaCard,
    brimWorldEliteMastercard,
    bmoViporterWorldEliteMastercard,
    bmoAscendWorldEliteMastercard,
    cibcDividendPlatinumVisaCard,
    cibcAeroplanVisaCard,
    desjardinsOdysseyVisaInfinitePrivilege,
    mbnaRewardsWorldEliteMastercard,
    pcWorldMastercard,
    rogersRedWorldMastercard,
    tdPlatinumTravelVisaCard,
    rbcCashBackMastercard,
];

const reviewsBySlug = new Map(REVIEW_LIST.map((review) => [review.slug, review]));

for (const review of REVIEW_LIST) {
    if (review.faqs.length < 3 || review.faqs.length > 5) {
        throw new Error(`${review.slug} must have 3–5 FAQ items`);
    }
    if (review.relatedCardSlugs.includes(review.slug)) {
        throw new Error(`${review.slug} cannot list itself as a related card`);
    }
}

export function getCardEditorialReview(slug: string): CardEditorialReview | null {
    return reviewsBySlug.get(slug) ?? null;
}

export function getReviewHubs(card: CreditCard, review: CardEditorialReview): HubDefinition[] {
    const hubs = new Map<string, HubDefinition>();

    for (const hub of getMatchingHubsForCard(card)) {
        hubs.set(hub.slug, hub);
    }

    for (const slug of review.extraHubSlugs ?? []) {
        hubs.set(slug, getHubBySlug(slug));
    }

    return [...hubs.values()];
}

export type { CardEditorialReview, ReviewFaq } from './types';
