import type { CreditCard } from './types';

/** First-paint homepage grid size; Load more reveals the next batch of this size. */
export const HOMEPAGE_CARD_PAGE_SIZE = 24;

/** Fields needed to render homepage tiles, filter, and sort — omit long review text. */
export type HomepageCard = Pick<
    CreditCard,
    | 'id'
    | 'creditCardName'
    | 'imageFile'
    | 'issuer'
    | 'category'
    | 'annualFee'
    | 'annualFeeDisplay'
    | 'rewardsProgram'
    | 'welcomeBonus'
    | 'welcomeBonusValue'
    | 'productLink'
    | 'slug'
>;

export function toHomepageCard(card: CreditCard): HomepageCard {
    return {
        id: card.id,
        creditCardName: card.creditCardName,
        imageFile: card.imageFile,
        issuer: card.issuer,
        category: card.category,
        annualFee: card.annualFee,
        annualFeeDisplay: card.annualFeeDisplay,
        rewardsProgram: card.rewardsProgram,
        welcomeBonus: card.welcomeBonus,
        welcomeBonusValue: card.welcomeBonusValue,
        productLink: card.productLink,
        slug: card.slug,
    };
}
