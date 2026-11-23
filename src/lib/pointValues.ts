/**
 * Cents-per-point floors published in
 * src/content/guides/credit-card-points-value-canada.md.
 *
 * A program is listed here only when that guide states a fixed rate.
 * Aeroplan is omitted because the guide says it has no fixed value.
 * CIBC Aventura is omitted because the guide's program table does not
 * publish a cents-per-point floor (value depends on the fare versus the
 * chart cap). Air Miles is omitted because the guide does not cover it.
 * Do not add a rate that the guide does not state.
 */

export interface PointProgram {
    id: string;
    /** Name used in the guide. */
    name: string;
    /** Cents per point at the guide's published floor. */
    centsPerPoint: number;
    /** The guide's own redemption ratio, shown beside the estimate. */
    basis: string;
    /**
     * `rewardsProgram` labels in the card catalog (lowercase) that use this floor.
     * Grocery rankings look these up so the number cannot drift from the calculator.
     */
    catalogPrograms: readonly string[];
}

export const POINT_PROGRAMS: readonly PointProgram[] = [
    {
        id: 'amex-membership-rewards',
        name: 'Amex Membership Rewards',
        centsPerPoint: 1,
        basis: '1,000 points = $10 statement credit on eligible purchases',
        catalogPrograms: ['amex membership rewards'],
    },
    {
        id: 'rbc-avion',
        name: 'RBC Avion',
        centsPerPoint: 1,
        basis: '100 points = $1 on travel through Avion Rewards',
        catalogPrograms: ['avion'],
    },
    {
        id: 'scene-plus',
        name: 'Scene+',
        centsPerPoint: 1,
        basis: '100 points = $1 on travel',
        catalogPrograms: ['scene+ points'],
    },
    {
        id: 'td-rewards',
        name: 'TD Rewards',
        centsPerPoint: 0.5,
        basis: '200 points = $1 on Expedia for TD',
        catalogPrograms: ['td rewards'],
    },
    {
        id: 'bmo-rewards',
        name: 'BMO Rewards',
        // 150 points = $1. The guide also calls this about 0.67 cents per point.
        centsPerPoint: 100 / 150,
        basis: '150 points = $1 on travel paid with your BMO card',
        catalogPrograms: ['bmo rewards points'],
    },
    {
        id: 'pc-optimum',
        name: 'PC Optimum',
        centsPerPoint: 0.1,
        basis: '10,000 points = $10',
        catalogPrograms: ['pc optimum'],
    },
];

export const POINTS_GUIDE_PATH = '/guides/credit-card-points-value-canada/';
export const POINTS_CALCULATOR_PATH = '/tools/points-value-calculator/';

const CATALOG_CENTS = new Map<string, number>();
for (const program of POINT_PROGRAMS) {
    for (const label of program.catalogPrograms) {
        CATALOG_CENTS.set(label, program.centsPerPoint);
    }
}

/** Floor for a catalog `rewardsProgram` label, or null when the guide assigns none. */
export function centsForCatalogProgram(rewardsProgram: string): number | null {
    const key = rewardsProgram.trim().toLowerCase();
    return CATALOG_CENTS.has(key) ? (CATALOG_CENTS.get(key) as number) : null;
}

/** Estimated dollars. Rounded to the nearest cent from the guide's exact ratio. */
export function pointsValueCad(points: number, centsPerPoint: number): number {
    return Math.round(points * centsPerPoint) / 100;
}

export function formatCentsPerPoint(cents: number): string {
    if (Math.abs(cents - 100 / 150) < 1e-9) return 'about 0.67¢';
    if (Number.isInteger(cents)) return `${cents}¢`;
    return `${cents}¢`;
}
