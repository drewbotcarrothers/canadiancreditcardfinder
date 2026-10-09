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

export interface GuideImage {
    src: string;
    alt: string;
    width: number;
    height: number;
    /** True when the guide has no featured image yet and the site-wide default is used instead. */
    isFallback: boolean;
}

/** Featured images live at public/images/guides/<id>.webp (1200x630, matches og:image size). */
export const GUIDE_IMAGE_WIDTH = 1200;
export const GUIDE_IMAGE_HEIGHT = 630;

const GUIDE_IMAGE_ALTS: Record<string, string> = {
    'amex-cobalt-vs-gold-rewards':
        'Two blank credit cards, slate blue and gold, on a cafe table beside a latte and a croissant, for the Amex Cobalt vs Gold Rewards comparison',
    'are-premium-credit-cards-worth-it-canada':
        'Traveller relaxing with a coffee in an airport lounge armchair beside the runway windows, for the guide on whether premium credit cards are worth it',
    'best-cash-back-credit-cards-canada':
        'Hand dropping a toonie into a coin jar on a kitchen counter with a blank credit card beside it, for the best cash back credit cards guide',
    'best-grocery-credit-cards-canada':
        'Grocery cart with bread and eggs in a produce aisle as a hand picks an apple, for the best grocery credit cards guide',
    'best-no-annual-fee-credit-cards-canada':
        'Leather wallet holding a single blank credit card beside a coffee mug, keys, and coins, for the best no annual fee credit cards guide',
    'best-student-credit-cards-canada':
        'Student in a hoodie tapping a blank credit card on a payment terminal at a campus cafe, for the best student credit cards guide',
    'best-us-dollar-credit-cards-canada':
        'Couple loading paper shopping bags into a car trunk at an outdoor shopping plaza, for the best US dollar credit cards guide',
    'how-to-choose-travel-credit-card-canada':
        'Traveller with a carry-on suitcase walking through an airport terminal with a mountain view, for the guide on choosing a travel credit card',
    'low-interest-vs-rewards-credit-cards-canada':
        'Hands with a pen, calculator, blank papers, and a blank credit card on a table in the evening, for the low interest vs rewards credit cards guide',
    'rbc-vs-td-vs-scotiabank-credit-cards':
        'Commuters crossing a street in the downtown Toronto financial district, for the RBC vs TD vs Scotiabank credit cards comparison',
    'aeroplan-for-beginners-canada':
        'Traveller in a winter coat sitting by an airport window with a passport on her suitcase, looking out at a plane and mountains, for the Aeroplan for beginners guide',
    'amex-acceptance-canada':
        'Hand holding a blank credit card at a bakery payment terminal beside a pastry case, for the Amex acceptance in Canada guide',
    'authorized-users-credit-cards-canada':
        'Parent handing a blank credit card to an adult child across a kitchen island, for the authorized users and additional cardholders guide',
    'balance-transfers-explained-canada':
        'Red and green blank cards beside a calculator and pen on a wooden desk, for the balance transfers explained guide',
    'costco-credit-card-canada':
        'Shopper pushing a loaded flatbed cart of produce and paper goods down a warehouse aisle, for the Costco credit card options guide',
    'credit-card-interest-grace-period-minimum-payment-canada':
        'Person at a kitchen table with envelopes, a blank credit card, and a wall calendar with a date circled, for the interest, grace period and minimum payment guide',
    'credit-card-points-value-canada':
        'Hands with a phone, notebook, blank credit card, calculator and coffee at a wooden table, for the credit card points value guide',
    'credit-card-travel-insurance-explained-canada':
        'Open suitcase on a bed with folded clothes, a passport, sunglasses and a blank credit card, for the credit card travel insurance guide',
    'credit-cards-for-newcomers-canada':
        'Newcomer opening a card envelope at a table while children with suitcases wait by the door, for the credit cards for newcomers guide',
    'foreign-transaction-fees-canada':
        'Traveller handing a blank credit card to a vendor at an outdoor produce market, for the foreign transaction fees guide',
    'how-credit-scores-work-canada':
        'Person reviewing a laptop on a living room sofa with a coffee mug nearby, for the how credit scores work in Canada guide',
    'mobile-device-insurance-credit-cards-canada':
        'Cracked smartphone beside a blank credit card on a wooden table, for the credit card mobile device insurance guide',
    'pay-rent-taxes-credit-card-canada':
        'Person at a laptop by a city window at dusk with keys and a blank credit card on the table, for the paying rent and taxes with a credit card guide',
    'pc-optimum-explained':
        'Shopper holding a blank card over a basket of produce in a grocery aisle, for the PC Optimum explained guide',
    'product-switch-vs-cancel-credit-card-canada':
        'Person on a phone call at a laptop holding a blank credit card, for the product switch vs cancel credit card guide',
    'scene-plus-explained':
        'Couple on a city sidewalk at night with popcorn, a grocery bag and a blank credit card, for the Scene+ explained guide',
    'visa-infinite-world-elite-income-requirements-canada':
        'Hand in a suit placing a blank black credit card on a restaurant bill folder, for the Visa Infinite and World Elite income requirements guide',
    'welcome-bonus-eligibility-rules-canada':
        'Hands with a magnifying glass over fine-print paperwork beside a gift box and blank credit card, for the welcome bonus eligibility rules guide',
};

/** Site-wide default social image (1200x630). Used until a guide gets its own featured image. */
const FALLBACK_GUIDE_IMAGE = '/og-default.png';
const FALLBACK_GUIDE_IMAGE_ALT = 'Canadian Credit Card Finder';

/**
 * Guides with an entry in GUIDE_IMAGE_ALTS have a featured image at public/images/guides/<id>.webp.
 * Guides without one fall back to the site default social image; pages hide the hero figure in that case.
 */
export function getGuideImage(id: string): GuideImage {
    const alt = GUIDE_IMAGE_ALTS[id];
    if (!alt) {
        return {
            src: FALLBACK_GUIDE_IMAGE,
            alt: FALLBACK_GUIDE_IMAGE_ALT,
            width: GUIDE_IMAGE_WIDTH,
            height: GUIDE_IMAGE_HEIGHT,
            isFallback: true,
        };
    }
    return {
        src: `/images/guides/${id}.webp`,
        alt,
        width: GUIDE_IMAGE_WIDTH,
        height: GUIDE_IMAGE_HEIGHT,
        isFallback: false,
    };
}
