import { useCompare } from '../hooks/useCompare';
import { CARD_IMAGE_HEIGHT, CARD_IMAGE_WIDTH } from '../lib/cardImage';
import type { CreditCard } from '../lib/types';
import { truncateText } from '../lib/utils';
import CardImage from './CardImage';

interface FinderBestMatchProps {
    card: CreditCard;
    reason: string;
}

export default function FinderBestMatch({ card, reason }: FinderBestMatchProps) {
    const { compareCards, addCard, removeCard } = useCompare();
    const isInCompare = compareCards.includes(card.slug);
    const canAddToCompare = compareCards.length < 3;
    const bonusHeadline = card.welcomeBonusValue?.trim()
        || (card.welcomeBonus ? truncateText(card.welcomeBonus, 72) : '—');
    const hasApplyLink = Boolean(card.productLink.trim());

    const handleCompareClick = () => {
        if (isInCompare) {
            removeCard(card.slug);
        } else if (canAddToCompare) {
            addCard(card.slug);
        }
    };

    return (
        <article className="bg-white rounded-2xl border-2 border-red-200 shadow-lg overflow-hidden">
            <div className="bg-red-600 text-white px-5 py-2.5 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold tracking-wide uppercase">Best match</p>
                {card.category && (
                    <p className="text-xs font-medium text-red-100">{card.category}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-8">
                <a
                    href={`/card/${card.slug}/`}
                    className="relative block bg-gradient-to-br from-gray-100 via-gray-50 to-white rounded-xl border border-gray-100"
                >
                    <div className="px-6 py-8">
                        <div className="relative mx-auto w-full max-w-[280px] aspect-[250/200]">
                            <CardImage
                                src={card.imageFile}
                                alt={`${card.creditCardName} credit card`}
                                fill
                                priority
                                width={CARD_IMAGE_WIDTH}
                                height={CARD_IMAGE_HEIGHT}
                            />
                        </div>
                    </div>
                </a>

                <div className="flex flex-col">
                    <a href={`/card/${card.slug}/`} className="block">
                        <h3 className="text-2xl font-bold text-gray-900 leading-snug hover:text-red-600 transition-colors">
                            {card.creditCardName}
                        </h3>
                    </a>
                    <p className="text-gray-500 mt-1 mb-5">by {card.issuer}</p>

                    <div className="grid grid-cols-2 gap-2 mb-5">
                        <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
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

                    <p className="text-gray-700 leading-relaxed mb-6">
                        <span className="font-semibold text-gray-900">Why this card: </span>
                        {reason}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                        <a
                            href={`/card/${card.slug}/`}
                            className="flex-1 border border-gray-300 bg-white text-gray-700 text-center py-3 px-5 rounded-lg font-semibold transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900"
                        >
                            Read review
                        </a>
                        {hasApplyLink && (
                            <a
                                href={card.productLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-center py-3 px-5 rounded-lg font-semibold transition-colors"
                            >
                                Apply
                            </a>
                        )}
                        <button
                            type="button"
                            onClick={handleCompareClick}
                            disabled={!isInCompare && !canAddToCompare}
                            className={`py-3 px-5 rounded-lg font-semibold transition-colors border-2 ${isInCompare
                                ? 'bg-red-50 border-red-600 text-red-600 hover:bg-red-100'
                                : canAddToCompare
                                    ? 'border-red-600 text-red-600 hover:bg-red-50'
                                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                            }`}
                            title={isInCompare ? 'Remove from compare' : canAddToCompare ? 'Add to compare' : 'Compare limit reached (3)'}
                        >
                            {isInCompare ? 'In compare' : 'Compare'}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
