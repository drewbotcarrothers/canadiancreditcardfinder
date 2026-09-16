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
import bmoEclipseRiseVisaCard from './bmo-eclipse-rise-visa-card';
import bmoEclipseVisaInfiniteCard from './bmo-eclipse-visa-infinite-card';
import bmoEclipseVisaInfinitePrivilegeCard from './bmo-eclipse-visa-infinite-privilege-card';
import bmoPreferredRateMastercard from './bmo-preferred-rate-mastercard';
import bmoUSDollarMastercard from './bmo-u-s-dollar-mastercard';
import bmoViporterWorldEliteMastercard from './bmo-viporter-world-elite-mastercard';
import brimMastercard from './brim-mastercard';
import brimWorldEliteMastercard from './brim-world-elite-mastercard';
import cibcAeroplanVisaCard from './cibc-aeroplan-visa-card';
import cibcAeroplanVisaCardForStudents from './cibc-aeroplan-visa-card-for-students';
import cibcAeroplanVisaInfiniteCard from './cibc-aeroplan-visa-infinite-card';
import cibcAeroplanVisaInfinitePrivilegeCard from './cibc-aeroplan-visa-infinite-privilege-card';
import cibcAventuraGoldVisaCard from './cibc-aventura-gold-visa-card';
import cibcAventuraVisaCard from './cibc-aventura-visa-card';
import cibcAventuraVisaCardForStudents from './cibc-aventura-visa-card-for-students';
import cibcAventuraVisaInfiniteCard from './cibc-aventura-visa-infinite-card';
import cibcAventuraVisaInfinitePrivilegeCard from './cibc-aventura-visa-infinite-privilege-card';
import cibcCostcoMastercard from './cibc-costco-mastercard';
import cibcDividendPlatinumVisaCard from './cibc-dividend-platinum-visa-card';
import cibcDividendVisaCard from './cibc-dividend-visa-card';
import cibcDividendVisaCardForStudents from './cibc-dividend-visa-card-for-students';
import cibcDividendVisaInfiniteCard from './cibc-dividend-visa-infinite-card';
import cibcSelectVisaCard from './cibc-select-visa-card';
import cibcUSDollarAventuraGoldVisaCard from './cibc-u-s-dollar-aventura-gold-visa-card';
import desjardinsBonusVisa from './desjardins-bonus-visa';
import desjardinsCashBackMastercard from './desjardins-cash-back-mastercard';
import desjardinsCashBackVisa from './desjardins-cash-back-visa';
import desjardinsCashBackWorldEliteMastercard from './desjardins-cash-back-world-elite-mastercard';
import desjardinsFlexiVisa from './desjardins-flexi-visa';
import desjardinsOdysseyGoldVisa from './desjardins-odyssey-gold-visa';
import desjardinsOdysseyVisaInfinitePrivilege from './desjardins-odyssey-visa-infinite-privilege';
import desjardinsOdysseyWorldEliteMastercard from './desjardins-odyssey-world-elite-mastercard';
import homeTrustPreferredVisa from './home-trust-preferred-visa';
import marriottBonvoyAmericanExpressCard from './marriott-bonvoy-american-express-card';
import mbnaRewardsPlatinumPlusMastercard from './mbna-rewards-platinum-plus-mastercard';
import mbnaRewardsWorldEliteMastercard from './mbna-rewards-world-elite-mastercard';
import mbnaSmartCashPlatinumPlusMastercard from './mbna-smart-cash-platinum-plus-mastercard';
import mbnaSmartCashWorldMastercard from './mbna-smart-cash-world-mastercard';
import mbnaTrueLineGoldMastercard from './mbna-true-line-gold-mastercard';
import mbnaTrueLineMastercard from './mbna-true-line-mastercard';
import nationalBankAllureMastercard from './national-bank-allure-mastercard';
import nationalBankEchoCashbackMastercard from './national-bank-echo-cashback-mastercard';
import nationalBankMc1Mastercard from './national-bank-mc1-mastercard';
import nationalBankMycreditMastercard from './national-bank-mycredit-mastercard';
import nationalBankPlatinumMastercard from './national-bank-platinum-mastercard';
import nationalBankSyncroMastercard from './national-bank-syncro-mastercard';
import nationalBankWorldEliteMastercard from './national-bank-world-elite-mastercard';
import nationalBankWorldMastercard from './national-bank-world-mastercard';
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
import rbcRateadvantageVisa from './rbc-rateadvantage-visa';
import rbcUSDollarVisaGold from './rbc-u-s-dollar-visa-gold';
import rbcVisaClassicLowRateOption from './rbc-visa-classic-low-rate-option';
import rbcVisaPlatinum from './rbc-visa-platinum';
import rogersRedMastercard from './rogers-red-mastercard';
import rogersRedWorldEliteMastercard from './rogers-red-world-elite-mastercard';
import rogersRedWorldLegendMastercard from './rogers-red-world-legend-mastercard';
import rogersRedWorldMastercard from './rogers-red-world-mastercard';
import scotiaMomentumMastercardCreditCard from './scotia-momentum-mastercard-credit-card';
import scotiaMomentumNoFeeVisaCard from './scotia-momentum-no-fee-visa-card';
import scotiaMomentumNoFeeVisaCardForStudents from './scotia-momentum-no-fee-visa-card-for-students';
import scotiaMomentumVisaCard from './scotia-momentum-visa-card';
import scotiaMomentumVisaCardForStudents from './scotia-momentum-visa-card-for-students';
import scotiaMomentumVisaInfiniteCard from './scotia-momentum-visa-infinite-card';
import scotiabankAmericanExpressCard from './scotiabank-american-express-card';
import scotiabankAmericanExpressCardForStudents from './scotiabank-american-express-card-for-students';
import scotiabankGoldAmericanExpressCard from './scotiabank-gold-american-express-card';
import scotiabankPassportVisaInfiniteCard from './scotiabank-passport-visa-infinite-card';
import scotiabankPassportVisaInfinitePrivilegeCard from './scotiabank-passport-visa-infinite-privilege-card';
import scotiabankPlatinumAmericanExpressCard from './scotiabank-platinum-american-express-card';
import scotiabankSceneVisaCard from './scotiabank-scene-visa-card';
import scotiabankScenePlusVisaCardForStudents from './scotiabank-scene-plus-visa-card-for-students';
import scotiabankUSDollarVisaCard from './scotiabank-u-s-dollar-visa-card';
import scotiabankValueVisaCard from './scotiabank-value-visa-card';
import scotiabankValueVisaCardForStudents from './scotiabank-value-visa-card-for-students';
import simpliiFinancialCashBackVisa from './simplii-financial-cash-back-visa';
import simplycashCardFromAmericanExpress from './simplycash-card-from-american-express';
import simplycashPreferredCardFromAmericanExpress from './simplycash-preferred-card-from-american-express';
import studentBmoCashbackMastercard from './student-bmo-cashback-mastercard';
import tangerineMoneyBackCreditCard from './tangerine-money-back-credit-card';
import tangerineMoneyBackWorldMastercard from './tangerine-money-back-world-mastercard';
import tdAeroplanVisaInfiniteCard from './td-aeroplan-visa-infinite-card';
import tdAeroplanVisaInfinitePrivilegeCreditCard from './td-aeroplan-visa-infinite-privilege-credit-card';
import tdAeroplanVisaPlatinumCreditCard from './td-aeroplan-visa-platinum-credit-card';
import tdCashBackVisaCard from './td-cash-back-visa-card';
import tdCashBackVisaInfiniteCard from './td-cash-back-visa-infinite-card';
import tdFirstClassTravelVisaInfiniteCard from './td-first-class-travel-visa-infinite-card';
import tdLowRateVisaCard from './td-low-rate-visa-card';
import tdPlatinumTravelVisaCard from './td-platinum-travel-visa-card';
import tdRewardsVisaCard from './td-rewards-visa-card';
import tdUSDollarVisaCard from './td-u-s-dollar-visa-card';
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
    desjardinsOdysseyWorldEliteMastercard,
    desjardinsOdysseyGoldVisa,
    cibcDividendVisaCard,
    bmoEclipseRiseVisaCard,
    brimMastercard,
    nationalBankWorldMastercard,
    scotiaMomentumVisaCard,
    tdRewardsVisaCard,
    homeTrustPreferredVisa,
    mbnaRewardsPlatinumPlusMastercard,
    desjardinsCashBackWorldEliteMastercard,
    desjardinsCashBackMastercard,
    desjardinsCashBackVisa,
    mbnaSmartCashWorldMastercard,
    mbnaSmartCashPlatinumPlusMastercard,
    scotiaMomentumMastercardCreditCard,
    nationalBankEchoCashbackMastercard,
    bmoPreferredRateMastercard,
    tdLowRateVisaCard,
    cibcSelectVisaCard,
    bmoUSDollarMastercard,
    studentBmoCashbackMastercard,
    cibcAeroplanVisaCardForStudents,
    cibcAventuraVisaCardForStudents,
    cibcDividendVisaCardForStudents,
    cibcUSDollarAventuraGoldVisaCard,
    desjardinsBonusVisa,
    desjardinsFlexiVisa,
    mbnaTrueLineGoldMastercard,
    mbnaTrueLineMastercard,
    nationalBankAllureMastercard,
    nationalBankMc1Mastercard,
    nationalBankMycreditMastercard,
    nationalBankPlatinumMastercard,
    nationalBankSyncroMastercard,
    rbcRateadvantageVisa,
    rbcUSDollarVisaGold,
    rbcVisaClassicLowRateOption,
    rbcVisaPlatinum,
    scotiaMomentumNoFeeVisaCardForStudents,
    scotiaMomentumVisaCardForStudents,
    scotiabankAmericanExpressCardForStudents,
    scotiabankScenePlusVisaCardForStudents,
    scotiabankUSDollarVisaCard,
    scotiabankValueVisaCard,
    scotiabankValueVisaCardForStudents,
    tdUSDollarVisaCard,
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
