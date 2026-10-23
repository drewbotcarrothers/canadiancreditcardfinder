import type { CreditCard } from './types';
import { estimateWelcomeFeeMath } from './reviewMath';

/** Yearly grocery spend used for the ranking on /best/groceries/. */
export const GROCERY_VALUE_SPEND = 8000;

/**
 * Cents per point, taken from the published redemption floors in the
 * "How much are credit card points worth in Canada?" guide. Programs with no
 * fixed value there (Aeroplan, Aventura and others) are left out on purpose.
 */
const CENTS_PER_UNIT: Record<string, number> = {
    'cash back': 1,
    'amex membership rewards': 1,
    'scene+ points': 1,
    avion: 1,
    'td rewards': 0.5,
    'bmo rewards points': 100 / 150,
    'pc optimum': 0.1,
};

export interface GroceryValueRow {
    card: CreditCard;
    /** Points per $1 (or percent for cash back) on groceries. */
    rate: number;
    rateLabel: string;
    /** True when the top rate only applies at Sobeys-family grocers. */
    sobeysFamilyOnly: boolean;
    /** Annual grocery spend cap at the bonus rate, if any. */
    capAnnual: number | null;
    /** Earn rate per $1 above the cap, in the same unit as `rate`. */
    baseRate: number;
    grossValue: number;
    annualFee: number;
    netValue: number;
}

function centsPerUnit(card: CreditCard): number | null {
    const key = card.rewardsProgram.trim().toLowerCase();
    return key in CENTS_PER_UNIT ? CENTS_PER_UNIT[key] : null;
}

/**
 * Issuer copy is sometimes broken across lines mid-sentence ("Earn" / "3 Scene+ points" /
 * "on every $1 ..."). Join a line onto the next when it is a fragment of a few words or
 * the next line carries on in lower case.
 */
function joinBrokenLines(text: string): string {
    const lines = text.split('\n');
    const out: string[] = [];
    let carry = '';
    lines.forEach((raw, i) => {
        const line = `${carry} ${raw.trim()}`.trim();
        const next = (lines[i + 1] || '').trim();
        const fragment = line.split(/\s+/).length <= 3 && !/[.!?]$/.test(line);
        if (next && (fragment || /^[a-z(]/.test(next))) {
            carry = line;
        } else {
            out.push(line);
            carry = '';
        }
    });
    if (carry) {
        out.push(carry);
    }
    return out.join('\n');
}

function splitClauses(text: string): string[] {
    return joinBrokenLines(text)
        .split(/\|\||\n|;|\.(?=\s|$)/)
        .map((part) => part.trim())
        .filter(Boolean);
}

/** Grocery wording, including the Sobeys-family banners that Scene+ cards name instead. */
const GROCER = /grocer|sobeys|safeway|freshco/i;
const GROCER_BANNER_ONLY = /sobeys|safeway|freshco/i;
const EVERYTHING_ELSE = /(all other|everything else|everywhere else|other purchases|other eligible purchases)/i;
const NUM = String.raw`(\d+(?:\.\d+)?)`;
const POINTS_RATE = new RegExp(
    String.raw`${NUM}\s*(?:x\b|×|[A-Za-zÀ-ÿ+ ]{0,40}?\bpoints?\b)[^$%]{0,40}?\b(?:per|for every|for each|on every)\s+\$(\d+)(?:\s*CAD)?`,
    'gi',
);
const MULTIPLIER_RATE = new RegExp(String.raw`(?:up to\s+)?${NUM}\s*(?:x|×)(?=[\s,]|$)`, 'gi');
const PERCENT_RATE = new RegExp(String.raw`${NUM}\s*%`, 'g');

function isCashBack(card: CreditCard): boolean {
    return card.rewardsProgram.trim().toLowerCase() === 'cash back';
}

interface RateMatch {
    index: number;
    rate: number;
}

/** Every earn rate written in a clause, in percent (cash back) or points per $1. */
function clauseRates(clause: string, cashBack: boolean): RateMatch[] {
    const found: RateMatch[] = [];
    if (cashBack) {
        for (const match of clause.matchAll(PERCENT_RATE)) {
            found.push({ index: match.index ?? 0, rate: parseFloat(match[1]) });
        }
        return found;
    }
    for (const match of clause.matchAll(POINTS_RATE)) {
        const dollars = parseFloat(match[2]) || 1;
        found.push({ index: match.index ?? 0, rate: parseFloat(match[1]) / dollars });
    }
    if (found.length === 0) {
        for (const match of clause.matchAll(MULTIPLIER_RATE)) {
            found.push({ index: match.index ?? 0, rate: parseFloat(match[1]) });
        }
    }
    return found;
}

/**
 * The rate that belongs to a keyword: the last rate written before it, or the
 * first one after it when the clause names the category first.
 */
function clauseRate(clause: string, cashBack: boolean, keyword: RegExp = GROCER): number {
    const rates = clauseRates(clause, cashBack);
    const at = clause.search(keyword);
    if (rates.length === 0 || at < 0) {
        return 0;
    }
    const before = rates.filter((r) => r.index < at);
    if (before.length > 0) {
        return before[before.length - 1].rate;
    }
    return rates[0].rate;
}

const MONEY = String.raw`\$(\d[\d,]*)`;
const PERIOD = String.raw`(per statement period|statement period|per month|each month|every month|in a month|monthly|a month|per calendar year|a year|per year|\/yr|annual|annually|calendar year)`;

function periodMultiplier(period: string | undefined): number {
    return period && /statement|month/i.test(period) ? 12 : 1;
}

function money(value: string): number {
    return parseFloat(value.replace(/,/g, ''));
}

/** Annual spend cap for the bonus rate written in a grocery clause, if any. */
interface Cap {
    annual: number;
    /** False when the text gives an amount without saying per month or per year. */
    explicit: boolean;
}

function clauseCap(clause: string, rate: number, cashBack: boolean): Cap | null {
    const cashCap = clause.match(new RegExp(String.raw`up to ${MONEY} cash back (?:a|per) year`, 'i'));
    if (cashCap && cashBack && rate > 0) {
        return { annual: money(cashCap[1]) / (rate / 100), explicit: true };
    }

    const patterns = [
        new RegExp(String.raw`(?<!(?:per|every|each)\s)${MONEY}\s+(?:a year\s+)?on groceries()`, 'i'),
        new RegExp(String.raw`groceries\s*\(first ${MONEY}(?:\s+${PERIOD})?`, 'i'),
        new RegExp(String.raw`(?:up to|first|on up to)\s+(?:a combined\s+)?${MONEY}[^.()]{0,70}?${PERIOD}`, 'i'),
        new RegExp(String.raw`(?:first|up to|on up to)\s+${MONEY}`, 'i'),
        new RegExp(String.raw`maximum annual amount of ${MONEY}`, 'i'),
    ];
    for (const pattern of patterns) {
        const match = clause.match(pattern);
        if (match) {
            return {
                annual: money(match[1]) * periodMultiplier(match[2]),
                explicit: match[2] !== undefined,
            };
        }
    }
    return null;
}

function thenRate(clause: string, cashBack: boolean): number | null {
    const match = clause.match(new RegExp(String.raw`then\s+${NUM}\s*(%|x|points?)`, 'i'));
    if (!match) {
        return null;
    }
    const isPercent = match[2] === '%';
    if (cashBack !== isPercent) {
        return null;
    }
    return parseFloat(match[1]);
}

/** Rate on "all other" / "everything else" purchases, used above a grocery cap. */
function everythingElseRate(text: string, cashBack: boolean): number | null {
    for (const clause of splitClauses(text)) {
        if (!EVERYTHING_ELSE.test(clause)) {
            continue;
        }
        const rate = clauseRate(clause, cashBack, EVERYTHING_ELSE);
        if (rate > 0) {
            return rate;
        }
    }
    return null;
}

/** "Earn 6x at Sobeys, Safeway ... and other Sobeys-family grocers": a banner-only rate. */
function namesSobeysFamilyFirst(clause: string): boolean {
    const banner = clause.search(GROCER_BANNER_ONLY);
    const generic = clause.search(/grocer/i);
    return banner >= 0 && (generic < 0 || banner < generic);
}

function formatRate(rate: number, cashBack: boolean): string {
    const n = Number.isInteger(rate) ? String(rate) : rate.toFixed(2).replace(/0$/, '');
    return cashBack ? `${n}%` : `${n} pts/$1`;
}

export function groceryValueForCard(
    card: CreditCard,
    spend = GROCERY_VALUE_SPEND,
): GroceryValueRow | null {
    const cents = centsPerUnit(card);
    if (cents === null) {
        return null;
    }

    const cashBack = isCashBack(card);
    const text = `${card.features}\n${card.featuresDetailed}`;
    const groceryClauses = splitClauses(text).filter(
        (clause) => GROCER.test(clause) && !/not groceries|excluding groceries/i.test(clause),
    );

    let rate = 0;
    let rateClause = '';
    for (const clause of groceryClauses) {
        const clauseBonus = clauseRate(clause, cashBack);
        if (clauseBonus > rate) {
            rate = clauseBonus;
            rateClause = clause;
        }
    }
    if (rate <= 0) {
        return null;
    }

    // Caps and the "then" rate can sit in any clause that states the bonus rate.
    // Caps can sit in any grocery clause that states the bonus rate or no rate at all
    // (fine print such as "only available on the first $15,000 in annual net Purchases").
    // A cap that names its period wins over a bare amount.
    let best: Cap | null = null;
    let afterCap: number | null = null;
    for (const clause of groceryClauses) {
        const clauseBonus = clauseRate(clause, cashBack);
        if (clauseBonus !== rate && clauseBonus !== 0) {
            continue;
        }
        const cap = clauseCap(clause, rate, cashBack);
        if (
            cap !== null &&
            (best === null ||
                (cap.explicit && !best.explicit) ||
                (cap.explicit === best.explicit && cap.annual < best.annual))
        ) {
            best = cap;
        }
        afterCap = afterCap ?? thenRate(clause, cashBack);
    }
    const capAnnual = best?.annual ?? null;

    let baseRate = 0;
    if (capAnnual !== null && capAnnual < spend) {
        const fallback = afterCap ?? everythingElseRate(text, cashBack);
        if (fallback === null) {
            return null;
        }
        baseRate = fallback;
    }

    const bonusSpend = capAnnual !== null ? Math.min(spend, capAnnual) : spend;
    const units = rate * bonusSpend + baseRate * (spend - bonusSpend);
    // Cash back rates are percentages; points rates are points per $1.
    const grossValue = cashBack ? units / 100 : (units * cents) / 100;
    const annualFee = estimateWelcomeFeeMath(card).feeUsedForMath;

    return {
        card,
        rate,
        rateLabel: formatRate(rate, cashBack),
        sobeysFamilyOnly: namesSobeysFamilyFirst(rateClause),
        capAnnual,
        baseRate,
        grossValue,
        annualFee,
        netValue: grossValue - annualFee,
    };
}

/** "Scotiabank American Express Card (for students)" and "Student BMO CashBack Mastercard" share a row with the main card. */
function baseCardName(name: string): string {
    return name
        .replace(/\s*\((?:for )?students?\)\s*/i, ' ')
        .replace(/\s+for students\b/i, ' ')
        .replace(/^student\s+/i, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

export function rankGroceryValue(cards: CreditCard[], limit = 10): GroceryValueRow[] {
    const ranked = cards
        .map((card) => groceryValueForCard(card))
        .filter((row): row is GroceryValueRow => row !== null)
        .sort(
            (a, b) =>
                b.netValue - a.netValue ||
                a.annualFee - b.annualFee ||
                a.card.creditCardName.length - b.card.creditCardName.length ||
                a.card.creditCardName.localeCompare(b.card.creditCardName),
        );

    // Student versions with the same earn and fee add nothing to the ranking.
    const seen = new Map<string, GroceryValueRow>();
    const rows: GroceryValueRow[] = [];
    for (const row of ranked) {
        const key = baseCardName(row.card.creditCardName);
        const twin = seen.get(key);
        if (twin && Math.round(twin.netValue) === Math.round(row.netValue)) {
            continue;
        }
        seen.set(key, row);
        rows.push(row);
    }
    return rows.slice(0, limit);
}
