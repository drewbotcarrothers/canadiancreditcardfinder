import { getCollection, type CollectionEntry } from 'astro:content';

export type GuideEntry = CollectionEntry<'guides'>;

export const GUIDE_DISCLAIMER =
    'Offers, annual fees, earn rates, and welcome bonuses change. Figures on this page are qualitative — confirm every number on the live card page and with the issuer before you apply. This is general information for Canadians, not financial advice, and not a guarantee of approval.';

export async function getGuides(): Promise<GuideEntry[]> {
    const guides = await getCollection('guides');
    return guides.sort((a, b) => a.data.sortOrder - b.data.sortOrder || a.data.title.localeCompare(b.data.title));
}

export function guidePath(guide: GuideEntry): string {
    return `/guides/${guide.id}/`;
}
