import { useCompare } from '../hooks/useCompare';
import { CARD_IMAGE_HEIGHT, CARD_IMAGE_WIDTH } from '../lib/cardImage';
import type { HomepageCard } from '../lib/homepage';
import { truncateText } from '../lib/utils';
import CardImage from './CardImage';

interface CardItemProps {
    card: HomepageCard;
    reason?: string;
    showApply?: boolean;
}

export default function CardItem({ card, reason, showApply = false }: CardItemProps) {
    const { compareCards, addCard, removeCard } = useCompare();

    const isInCompare = compareCards.includes(card.slug);
    const canAddToCompare = compareCards.length < 3;

    const handleCompareClick = () => {
        if (isInCompare) {
            removeCard(card.slug);
        } else if (canAddToCompare) {
            addCard(card.slug);
        }
    };

    const bonusHeadline = card.welcomeBonusValue?.trim()
        || (card.welcomeBonus ? truncateText(card.welcomeBonus, 42) : '—');
    const isNoFee = Number.isFinite(card.annualFee) && card.annualFee === 0;

    return (
        <article className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-red-200 transition-all duration-200 overflow-hidden group h-full flex flex-col">
            <a href={`/card/${card.slug}/`} className="relative block bg-gradient-to-br from-gray-100 via-gray-50 to-white border-b border-gray-100">
                {card.category && (
                    <span className="absolute top-3 left-3 z-10 bg-white/95 text-gray-700 text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
                        {card.category}
                    </span>
                )}
                <div className="px-6 pt-11 pb-5">
                    <div className="relative mx-auto w-full max-w-[260px] aspect-[250/200]">
                        <CardImage
                            src={card.imageFile}
                            alt={`${card.creditCardName} credit card`}
                            fill
                            width={CARD_IMAGE_WIDTH}
                            height={CARD_IMAGE_HEIGHT}
                        />
                    </div>
                </div>
            </a>

            <div className="p-5 flex flex-col flex-1">
                <a href={`/card/${card.slug}/`} className="block">
                    <h3 className="font-semibold text-lg leading-snug text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                        {card.creditCardName}
                    </h3>
                </a>
                <p className="text-gray-500 text-sm mb-4">by {card.issuer}</p>

                <div className="grid grid-cols-2 gap-2 mb-5">
                    <div className={`rounded-xl border px-3 py-2.5 ${isNoFee ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-0.5">
                            Annual fee
                        </p>
                        <p className="text-lg font-bold text-gray-900 leading-tight">
                            {card.annualFeeDisplay}
                        </p>
                    </div>
                    <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-red-700/80 mb-0.5">
                            Welcome bonus
                        </p>
                        <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                            {bonusHeadline}
                        </p>
                    </div>
                </div>

                {reason && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">
                        <span className="font-semibold text-gray-900">Why this card: </span>
                        {reason}
                    </p>
                )}

                <div className="flex gap-3 mt-auto">
                    <a
                        href={`/card/${card.slug}/`}
                        className="flex-1 border border-gray-300 bg-white text-gray-700 text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                    >
                        View Details
                    </a>
                    {showApply && card.productLink.trim() && (
                        <a
                            href={card.productLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-center py-2.5 px-4 rounded-lg font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        >
                            Apply
                        </a>
                    )}
                    <button
                        type="button"
                        onClick={handleCompareClick}
                        disabled={!isInCompare && !canAddToCompare}
                        className={`py-2.5 px-4 rounded-lg font-medium text-sm transition-colors border-2 ${isInCompare
                            ? 'bg-red-50 border-red-600 text-red-600 hover:bg-red-100'
                            : canAddToCompare
                                ? 'border-red-600 text-red-600 hover:bg-red-50'
                                : 'border-gray-300 text-gray-400 cursor-not-allowed'
                            }`}
                        title={isInCompare ? 'Remove from compare' : canAddToCompare ? 'Add to compare' : 'Compare limit reached (3)'}
                    >
                        {isInCompare ? '✓' : '+'}
                    </button>
                </div>
            </div>
        </article>
    );
}
