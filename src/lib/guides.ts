import { getCollection, type CollectionEntry } from 'astro:content';
import type { HubSlug } from './hubs';
import type { IssuerHubSlug } from './issuers';

export type GuideEntry = CollectionEntry<'guides'>;

export const GUIDE_DISCLAIMER =
    'Offers, annual fees, earn rates, and welcome bonuses change. Figures on this page are qualitative — confirm every number on the live card page and with the issuer before you apply. This is general information for Canadians, not financial advice, and not a guarantee of approval.';

/** Use-case hub slug → content-collection guide id(s). Every /best/ hub has at least one. */
export const RELATED_GUIDE_IDS_BY_HUB = {
    'no-annual-fee': ['best-no-annual-fee-credit-cards-canada'],
    travel: ['how-to-choose-travel-credit-card-canada'],
    'cash-back': ['best-cash-back-credit-cards-canada'],
    premium: ['are-premium-credit-cards-worth-it-canada'],
    students: ['best-student-credit-cards-canada'],
    groceries: ['best-grocery-credit-cards-canada'],
    'low-interest': ['low-interest-vs-rewards-credit-cards-canada'],
    'us-dollar': ['best-us-dollar-credit-cards-canada'],
    rewards: ['best-cash-back-credit-cards-canada'],
} as const satisfies Record<HubSlug, readonly [string, ...string[]]>;

/** Issuer hub slug → guide id(s). Only issuers with a matching guide are listed. */
export const RELATED_GUIDE_IDS_BY_ISSUER: Partial<
    Record<IssuerHubSlug, readonly [string, ...string[]]>
> = {
    'american-express': ['amex-cobalt-vs-gold-rewards'],
    rbc: ['rbc-vs-td-vs-scotiabank-credit-cards'],
    td: ['rbc-vs-td-vs-scotiabank-credit-cards'],
    scotiabank: ['rbc-vs-td-vs-scotiabank-credit-cards'],
};

export async function getGuides(): Promise<GuideEntry[]> {
    const guides = await getCollection('guides');
    return guides.sort((a, b) => a.data.sortOrder - b.data.sortOrder || a.data.title.localeCompare(b.data.title));
}

export function guidePath(guide: GuideEntry): string {
    return `/guides/${guide.id}/`;
}

function resolveGuideIds(ids: readonly string[], context: string, guides: GuideEntry[]): GuideEntry[] {
    const byId = new Map(guides.map((guide) => [guide.id, guide]));
    return ids.map((id) => {
        const guide = byId.get(id);
        if (!guide) {
            throw new Error(`Unknown related guide "${id}" (${context})`);
        }
        return guide;
    });
}

export async function getRelatedGuidesForHub(slug: HubSlug): Promise<GuideEntry[]> {
    return resolveGuideIds(RELATED_GUIDE_IDS_BY_HUB[slug], `hub /best/${slug}/`, await getGuides());
}

export async function getRelatedGuidesForIssuer(slug: IssuerHubSlug): Promise<GuideEntry[]> {
    const ids = RELATED_GUIDE_IDS_BY_ISSUER[slug];
    if (!ids) {
        return [];
    }
    return resolveGuideIds(ids, `issuer /issuer/${slug}/`, await getGuides());
}
