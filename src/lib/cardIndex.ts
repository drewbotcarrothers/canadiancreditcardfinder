import type { CreditCard } from './types';
import { isNoAnnualFeeCard } from './hubs';
import { cardNetwork, offerDollarValue } from './networkAndOffers';

/**
 * Quarterly index and the no-foreign-transaction-fee list.
 * Every figure is derived from the card records that render /card/<slug>/.
 * A fee, rate, or bonus the catalog does not state is left blank — never filled in.
 */

export const OFFERS_CHANGE_NOTE =
    'Offers, fees, and rates change. Confirm the current terms with the issuer before you apply.';

export const CARD_INDEX_EDITION = 'Q4 2026';
export const CARD_INDEX_PATH = '/data/credit-card-index/';
export const CARD_INDEX_CSV_PATH = '/data/credit-card-index-2026-q4.csv';
export const CARD_INDEX_EMBED_PATH = '/embed/credit-card-index/';
export const NO_FX_PATH = '/no-foreign-transaction-fee-credit-cards/';
export const NO_FX_EMBED_PATH = '/embed/no-fx-fee-cards/';
export const FX_GUIDE_PATH = '/guides/foreign-transaction-fees-canada/';

export interface FxFeeStatement {
    /** Null when the catalog does not state a foreign transaction fee. */
    percent: number | null;
    /** Catalog figure, such as "2.50%" or "0%". Empty when unstated. */
    display: string;
}

export interface CardIndexCsvRow {
    name: string;
    issuer: string;
    network: string;
    annualFee: string;
    purchaseApr: string;
    fxFee: string;
    welcomeBonusValue: string;
    cardPageUrl: string;
}

export interface CountRow {
    label: string;
    count: number;
}

export interface CardIndex {
    total: number;
    byIssuer: CountRow[];
    byNetwork: CountRow[];
    /** CAD annual fees used for the median and range. */
    cadFeeCount: number;
    usdFeeCount: number;
    feeMedian: number;
    feeMin: number;
    feeMax: number;
    noAnnualFeeCount: number;
    /** Cards whose purchase APR cell is a single percent. */
    singleAprCount: number;
    aprMedian: number | null;
    aprRangeCount: number;
    aprMissingCount: number;
    aprOtherCount: number;
    noFxCards: CreditCard[];
    /** Cards whose welcome-bonus value field contains a dollar amount. */
    welcomeValueCount: number;
    welcomeExcludedCount: number;
    welcomeAverage: number | null;
    rows: CardIndexCsvRow[];
}

/**
 * Unconditional 0% statements. A waiver that only names U.S. dollar purchases
 * ("no conversion fee on U.S. dollar purchases") does not match these.
 */
const ZERO_FEE_PATTERNS: readonly RegExp[] = [
    /\bno foreign transaction fees?\b/i,
    /\bno foreign exchange fees?\b/i,
    /\b0%\s+currency conversion charge\b/i,
    /\bno foreign currency conversion fee\s*\(\s*0%/i,
];

const RATE_PATTERNS: readonly RegExp[] = [
    /foreign transaction fee\s+(\d+(?:\.\d+)?)\s*%/gi,
    /(\d+(?:\.\d+)?)\s*%\s+foreign transaction fee/gi,
    /(\d+(?:\.\d+)?)\s*%\s+foreign currency conversion commission/gi,
    /foreign currency conversion (?:fee|markup|commission)\s+(\d+(?:\.\d+)?)\s*%/gi,
    /(\d+(?:\.\d+)?)\s*%\s+conversion fee/gi,
    /charged a\s+(\d+(?:\.\d+)?)\s*%\s+conversion fee/gi,
    /carry a\s+(\d+(?:\.\d+)?)\s*%\s+(?:foreign transaction fee|conversion fee)/gi,
    /plus(?:\s+a)?\s+(\d+(?:\.\d+)?)\s*%/gi,
    /conversion (?:fee|markup|commission)\s+(\d+(?:\.\d+)?)\s*%/gi,
];

interface ParsedRate {
    raw: string;
    value: number;
}

function catalogFxText(card: CreditCard): string {
    return `${card.features} ${card.featuresDetailed}`.replace(/\bU\.S\./g, 'US').replace(/\s+/g, ' ').trim();
}

function ratesIn(text: string): ParsedRate[] {
    const found: ParsedRate[] = [];
    for (const pattern of RATE_PATTERNS) {
        pattern.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(text))) {
            const start = Math.max(0, match.index - 100);
            const window = text.slice(start, match.index + match[0].length + 50);
            if (!/foreign|conversion fee|conversion charge|other currencies/i.test(window)) continue;
            // "saves the typical 2.5%" and "versus 2.5% on other cards" describe someone else's fee.
            if (/typical|versus|on other/i.test(window) && /no foreign/i.test(window)) continue;
            const raw = match[1];
            const value = parseFloat(raw);
            if (!Number.isFinite(value)) continue;
            found.push({ raw, value });
        }
    }
    return found;
}

function uniqueRates(rates: ParsedRate[], cardName: string): ParsedRate[] {
    const values = [...new Set(rates.map((rate) => rate.value))];
    if (values.length > 1) {
        throw new Error(
            `Card "${cardName}" states more than one foreign transaction fee (${rates
                .map((rate) => `${rate.raw}%`)
                .join(', ')}). Refusing to pick one.`,
        );
    }
    return rates;
}

/**
 * Foreign transaction fee stated in the card's own features.
 * Returns a blank display when the catalog does not state one.
 */
export function statedForeignTransactionFee(card: CreditCard): FxFeeStatement {
    const text = catalogFxText(card);
    if (!text) return { percent: null, display: '' };

    if (ZERO_FEE_PATTERNS.some((pattern) => pattern.test(text))) {
        const other = uniqueRates(ratesIn(text), card.creditCardName).filter((rate) => rate.value !== 0);
        if (other.length > 0) {
            throw new Error(
                `Card "${card.creditCardName}" states no foreign transaction fee and also states ${other[0].raw}%.`,
            );
        }
        return { percent: 0, display: '0%' };
    }

    const rates = uniqueRates(ratesIn(text), card.creditCardName);
    if (rates.length === 0) return { percent: null, display: '' };
    return { percent: rates[0].value, display: `${rates[0].raw}%` };
}

function isUsdAnnualFee(card: CreditCard): boolean {
    return /USD|US\$|U\.S\.\s*\$/i.test(card.annualFeeDisplay);
}

/** A single purchase APR such as "20.99%". Ranges and blank cells are not a single rate. */
export function singlePurchaseApr(card: CreditCard): number | null {
    const match = card.purchaseInterestRateDisplay.trim().match(/^(\d+(?:\.\d+)?)%$/);
    if (!match) return null;
    const value = parseFloat(match[1]);
    return Number.isFinite(value) ? value : null;
}

function isAprRange(card: CreditCard): boolean {
    return /\d+(?:\.\d+)?%\s*[-–—]\s*\d+(?:\.\d+)?%/.test(card.purchaseInterestRateDisplay.trim());
}

export function median(values: number[]): number | null {
    if (values.length === 0) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 1) return sorted[mid];
    return (sorted[mid - 1] + sorted[mid]) / 2;
}

function countBy(labels: string[]): CountRow[] {
    const counts = new Map<string, number>();
    for (const label of labels) {
        counts.set(label, (counts.get(label) ?? 0) + 1);
    }
    return [...counts.entries()]
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function csvField(value: string): string {
    const cleaned = value.replace(/\r?\n/g, ' ').trim();
    if (/[",]/.test(cleaned)) return `"${cleaned.replace(/"/g, '""')}"`;
    return cleaned;
}

export function cardIndexToCsv(rows: CardIndexCsvRow[]): string {
    const header = [
        'name',
        'issuer',
        'network',
        'annual fee',
        'purchase APR',
        'FX fee',
        'welcome bonus value',
        'card page URL',
    ];
    const lines = [
        header.join(','),
        ...rows.map((row) =>
            [
                row.name,
                row.issuer,
                row.network,
                row.annualFee,
                row.purchaseApr,
                row.fxFee,
                row.welcomeBonusValue,
                row.cardPageUrl,
            ]
                .map(csvField)
                .join(','),
        ),
    ];
    return `\uFEFF${lines.join('\n')}\n`;
}

export function buildCardIndex(cards: CreditCard[], site: string | URL): CardIndex {
    const base = String(site instanceof URL ? site.origin : site).replace(/\/$/, '');
    const cadFees: number[] = [];
    let usdFeeCount = 0;
    const singleAprs: number[] = [];
    let aprRangeCount = 0;
    let aprMissingCount = 0;
    let aprOtherCount = 0;
    const welcomeValues: number[] = [];
    const noFxCards: CreditCard[] = [];
    const rows: CardIndexCsvRow[] = [];

    for (const card of cards) {
        if (isUsdAnnualFee(card)) usdFeeCount += 1;
        else if (Number.isFinite(card.annualFee)) cadFees.push(card.annualFee);

        const apr = singlePurchaseApr(card);
        if (apr !== null) singleAprs.push(apr);
        else if (!card.purchaseInterestRateDisplay.trim()) aprMissingCount += 1;
        else if (isAprRange(card)) aprRangeCount += 1;
        else aprOtherCount += 1;

        const fx = statedForeignTransactionFee(card);
        if (fx.percent === 0) noFxCards.push(card);

        const welcome = offerDollarValue(card);
        if (welcome > 0) welcomeValues.push(welcome);

        rows.push({
            name: card.creditCardName,
            issuer: card.issuer,
            network: cardNetwork(card) ?? '',
            annualFee: card.annualFeeDisplay,
            purchaseApr: card.purchaseInterestRateDisplay.trim(),
            fxFee: fx.display,
            welcomeBonusValue: card.welcomeBonusValue.trim(),
            cardPageUrl: `${base}/card/${card.slug}/`,
        });
    }

    rows.sort((a, b) => a.issuer.localeCompare(b.issuer) || a.name.localeCompare(b.name));
    noFxCards.sort(
        (a, b) => a.annualFee - b.annualFee || a.creditCardName.localeCompare(b.creditCardName),
    );

    const feeMedian = median(cadFees);
    if (feeMedian === null || cadFees.length === 0) {
        throw new Error('Card index has no Canadian-dollar annual fees to summarize.');
    }

    const networkLabels = cards.map((card) => cardNetwork(card) ?? 'Not stated');

    return {
        total: cards.length,
        byIssuer: countBy(cards.map((card) => card.issuer || 'Not stated')),
        byNetwork: countBy(networkLabels),
        cadFeeCount: cadFees.length,
        usdFeeCount,
        feeMedian,
        feeMin: Math.min(...cadFees),
        feeMax: Math.max(...cadFees),
        noAnnualFeeCount: cards.filter(isNoAnnualFeeCard).length,
        singleAprCount: singleAprs.length,
        aprMedian: median(singleAprs),
        aprRangeCount,
        aprMissingCount,
        aprOtherCount,
        noFxCards,
        welcomeValueCount: welcomeValues.length,
        welcomeExcludedCount: cards.length - welcomeValues.length,
        welcomeAverage:
            welcomeValues.length > 0
                ? welcomeValues.reduce((sum, value) => sum + value, 0) / welcomeValues.length
                : null,
        rows,
    };
}

export function formatCountShare(count: number, total: number): string {
    if (total === 0) return '0';
    const pct = Math.round((count / total) * 1000) / 10;
    const pctText = Number.isInteger(pct) ? String(pct) : pct.toFixed(1);
    return `${count} of ${total} (${pctText}%)`;
}

export function formatPercent(value: number): string {
    const rounded = Math.round(value * 100) / 100;
    if (Number.isInteger(rounded)) return `${rounded}%`;
    const text = rounded.toFixed(2).replace(/0$/, '');
    return `${text}%`;
}
