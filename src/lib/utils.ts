export function slugify(name: string): string {
    return name
        .toLowerCase()
        // Keep ION+ / Scene+ distinct from ION / Scene (`+` is not alphanumeric).
        .replace(/\+/g, '-plus-')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export function parseFeeRange(feeRange: string): { min: number; max: number } {
    switch (feeRange) {
        case '0':
            return { min: 0, max: 0 };
        case '1-99':
            return { min: 1, max: 99 };
        case '100-199':
            return { min: 100, max: 199 };
        case '200+':
            return { min: 200, max: Infinity };
        default:
            return { min: 0, max: Infinity };
    }
}

export function parseBonusValue(value: string): number {
    // Extract a dollar value from strings like "up to $150", "$200".
    // Points-only values ("up to 25,000 bonus points") have no dollar figure, so they count as 0.
    if (!value) return 0;
    // "Get 12% cash back for the first 3 months on up to $2,000" is worth 12% of $2,000.
    const pctOfSpend = value.match(/(\d+(?:\.\d+)?)\s?%[^$]*?\$\s?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (pctOfSpend && /cash ?back/i.test(value)) {
        return Math.round((parseFloat(pctOfSpend[1]) / 100) * parseFloat(pctOfSpend[2].replace(/,/g, '')));
    }
    const dollar = value.match(/\$\s?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (dollar) {
        return parseFloat(dollar[1].replace(/,/g, ''));
    }
    if (/points?|miles?|scene\+|aeroplan|avion|air miles/i.test(value)) {
        return 0;
    }
    const plain = value.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (plain) {
        return parseFloat(plain[1].replace(/,/g, ''));
    }
    return 0;
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}
