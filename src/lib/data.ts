import Papa from 'papaparse';
import type { CreditCard } from './types';
import { filterCardsForHub, type HubSlug } from './hubs';
import { filterCardsForIssuer, type IssuerHubSlug } from './issuers';
import { applyPublishedCardFacts } from './publishedCardFacts';
import { slugify } from './utils';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQNMup_DS4IXwkwpnueP7v4q3KZoLxZyBPHWKr5b2g8CMUohPXZ8jpzuAzFVYOHKG-cWfHODG7H6Arw/pub?gid=272625262&single=true&output=csv'

/**
 * Discontinued products. Dropped from every public list, hub, compare set, and
 * sitemap even if the published catalog still has a row. Old URLs 301 in
 * astro.config.mjs and public/.htaccess.
 */
const RETIRED_CARD_SLUGS = new Set(['rbc-rateadvantage-visa']);

function isRetiredCard(card: Pick<CreditCard, 'slug' | 'creditCardName'>): boolean {
    return RETIRED_CARD_SLUGS.has(card.slug) || /rateadvantage/i.test(card.creditCardName);
}

interface CSVRow {
    ID: string;
    Credit_Card_Name: string;
    Image: string;
    Image_File: string;
    Issuer: string;
    Category: string;
    Annual_Fee: string;
    Annual_Fee_Detail: string;
    Additional_Card_Fee: string;
    Additional_Card_Detail: string;
    Purchase_Interest_Rate: string;
    Cash_Advance_Interest_Rate: string;
    Rewards_Program: string;
    Welcome_Bonus: string;
    Welcome_Bonus_Detailed: string;
    Welcome_Bonus_Value: string;
    Welcome_Bonus_Eligbility: string;
    Features: string;
    Features_Detailed: string;
    Card_Eligibility: string;
    Insurance: string;
    Product_Link: string;
}

let cachedCards: CreditCard[] | null = null;
let fetchedAt: Date | null = null;

/**
 * Editor notes left in sheet cells (for example "fill current NBC Platinum offer ...")
 * must never render as public copy. Treat them as empty so the page shows its normal
 * "not listed" state instead of an internal to-do.
 */
const EDITOR_NOTE_PATTERN = /^\s*(fill\b|tbd\b|todo\b|xxx\b|placeholder\b)/i;

/** Issuer copy pasted without spaces between sentences ("on your Card.Earn up to") gets a space back. */
function fixJoinedSentences(text: string): string {
    return text.replace(/([a-z)])\.([A-Z])/g, '$1. $2');
}

function publicText(value: string | undefined): string {
    const text = fixJoinedSentences((value || '').trim());
    return EDITOR_NOTE_PATTERN.test(text) ? '' : text;
}

function parseCSV(csvText: string): CreditCard[] {
    const result = Papa.parse<CSVRow>(csvText, {
        header: true,
        skipEmptyLines: true
    });

    return result.data.map((row) => ({
        id: parseInt(row.ID) || 0,
        creditCardName: row.Credit_Card_Name || '',
        imageFile: row.Image_File || 'placeholder.png',
        issuer: row.Issuer || '',
        category: row.Category || '',
        annualFee: parseFloat(row.Annual_Fee?.replace(/[$,]/g, '') || '0'),
        annualFeeDisplay: row.Annual_Fee || '$0',
        annualFeeDetail: publicText(row.Annual_Fee_Detail),
        additionalCardFee: parseFloat(row.Additional_Card_Fee?.replace(/[$,]/g, '') || '0'),
        additionalCardFeeDisplay: row.Additional_Card_Fee || '$0',
        additionalCardDetail: publicText(row.Additional_Card_Detail),
        purchaseInterestRate: parseFloat(row.Purchase_Interest_Rate?.replace('%', '') || '0'),
        purchaseInterestRateDisplay: row.Purchase_Interest_Rate || '',
        cashAdvanceInterestRate: parseFloat(row.Cash_Advance_Interest_Rate?.replace('%', '') || '0'),
        cashAdvanceInterestRateDisplay: row.Cash_Advance_Interest_Rate || '',
        rewardsProgram: row.Rewards_Program || '',
        welcomeBonus: publicText(row.Welcome_Bonus),
        welcomeBonusDetailed: publicText(row.Welcome_Bonus_Detailed),
        welcomeBonusValue: publicText(row.Welcome_Bonus_Value),
        welcomeBonusEligibility: publicText(row.Welcome_Bonus_Eligbility),
        features: publicText(row.Features),
        featuresDetailed: publicText(row.Features_Detailed),
        cardEligibility: publicText(row.Card_Eligibility),
        insurance: publicText(row.Insurance),
        productLink: row.Product_Link || '',
        slug: slugify(row.Credit_Card_Name || ''),
    })).map(applyPublishedCardFacts).filter((card) => !isRetiredCard(card));
}

export async function getCards(): Promise<CreditCard[]> {
    if (cachedCards) {
        return cachedCards;
    }

    const response = await fetch(CSV_URL);
    if (!response.ok) {
        throw new Error(`Failed to load credit card data (${response.status} ${response.statusText})`);
    }

    const csvText = await response.text();
    cachedCards = parseCSV(csvText);
    fetchedAt = new Date();
    return cachedCards;
}

/** When this build pulled the card data (fees, rates, offers). Null until getCards() has run. */
export function getDataFetchedAt(): Date | null {
    return fetchedAt;
}

export async function getCardBySlug(slug: string): Promise<CreditCard | null> {
    const cards = await getCards();
    return cards.find(card => card.slug === slug) || null;
}

export async function getUniqueCategories(): Promise<string[]> {
    const cards = await getCards();
    return [...new Set(cards.map(c => c.category).filter(Boolean))].sort();
}

export async function getUniqueIssuers(): Promise<string[]> {
    const cards = await getCards();
    return [...new Set(cards.map(c => c.issuer).filter(Boolean))].sort();
}

export async function getUniqueRewardsPrograms(): Promise<string[]> {
    const cards = await getCards();
    return [...new Set(cards.map(c => c.rewardsProgram).filter(Boolean))].sort();
}

export async function getRelatedCards(card: CreditCard, limit = 4): Promise<CreditCard[]> {
    const cards = await getCards();
    return cards
        .filter(c => c.id !== card.id && (c.category === card.category || c.issuer === card.issuer))
        .slice(0, limit);
}

export async function getCardsBySlugs(slugs: string[]): Promise<CreditCard[]> {
    const cards = await getCards();
    const bySlug = new Map(cards.map((card) => [card.slug, card]));
    return slugs.flatMap((slug) => {
        const match = bySlug.get(slug);
        return match ? [match] : [];
    });
}

export async function getCardsForHub(slug: HubSlug): Promise<CreditCard[]> {
    const cards = await getCards();
    return filterCardsForHub(cards, slug);
}

export async function getCardsForIssuerHub(slug: IssuerHubSlug): Promise<CreditCard[]> {
    const cards = await getCards();
    return filterCardsForIssuer(cards, slug);
}
