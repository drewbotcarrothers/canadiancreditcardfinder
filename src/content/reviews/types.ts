import type { HubSlug } from '../../lib/hubs';

export interface ReviewFaq {
    question: string;
    answer: string;
}

/**
 * Qualitative editorial copy for a card review page.
 * Fees, rates, and welcome-bonus figures stay on the live card record — do not
 * hardcode those numbers here.
 */
export interface CardEditorialReview {
    slug: string;
    seoTitle: string;
    h1: string;
    primaryKeyword: string;
    metaDescription: string;
    /** 2–3 sentences. Inline markdown links (`[label](/path/)`) are allowed. */
    intro: string;
    whoItsFor: string[];
    whoShouldSkip: string[];
    pros: string[];
    cons: string[];
    /** Qualitative fee discussion. Live fee math is rendered beside this copy. */
    feesAndValue: string;
    rewardsExplained: string;
    welcomeBonus: string;
    faqs: ReviewFaq[];
    /** Extra /best/{hub}/ links beyond those auto-detected from card data. */
    extraHubSlugs?: HubSlug[];
    relatedCardSlugs: string[];
}
