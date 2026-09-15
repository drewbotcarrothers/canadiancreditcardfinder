import Papa from 'papaparse';
import type { CreditCard } from './types';
import { filterCardsForHub, type HubSlug } from './hubs';
import { slugify } from './utils';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQNMup_DS4IXwkwpnueP7v4q3KZoLxZyBPHWKr5b2g8CMUohPXZ8jpzuAzFVYOHKG-cWfHODG7H6Arw/pub?gid=272625262&single=true&output=csv'

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
        annualFeeDetail: row.Annual_Fee_Detail || '',
        additionalCardFee: parseFloat(row.Additional_Card_Fee?.replace(/[$,]/g, '') || '0'),
        additionalCardFeeDisplay: row.Additional_Card_Fee || '$0',
        additionalCardDetail: row.Additional_Card_Detail || '',
        purchaseInterestRate: parseFloat(row.Purchase_Interest_Rate?.replace('%', '') || '0'),
        purchaseInterestRateDisplay: row.Purchase_Interest_Rate || '',
        cashAdvanceInterestRate: parseFloat(row.Cash_Advance_Interest_Rate?.replace('%', '') || '0'),
        cashAdvanceInterestRateDisplay: row.Cash_Advance_Interest_Rate || '',
        rewardsProgram: row.Rewards_Program || '',
        welcomeBonus: row.Welcome_Bonus || '',
        welcomeBonusDetailed: row.Welcome_Bonus_Detailed || '',
        welcomeBonusValue: row.Welcome_Bonus_Value || '',
        welcomeBonusEligibility: row.Welcome_Bonus_Eligbility || '',
        features: row.Features || '',
        featuresDetailed: row.Features_Detailed || '',
        cardEligibility: row.Card_Eligibility || '',
        insurance: row.Insurance || '',
        productLink: row.Product_Link || '',
        slug: slugify(row.Credit_Card_Name || ''),
    }));
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
    return cachedCards;
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

export async function getCardsForHub(slug: HubSlug): Promise<CreditCard[]> {
    const cards = await getCards();
    return filterCardsForHub(cards, slug);
}
