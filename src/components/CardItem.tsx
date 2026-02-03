'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard } from '@/lib/types';
import { truncateText } from '@/lib/utils';
import CardImage from './CardImage';

interface CardItemProps {
    card: CreditCard;
}

export default function CardItem({ card }: CardItemProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const compareCards = searchParams.get('cards')?.split(',').filter(Boolean) || [];
    const isInCompare = compareCards.includes(card.slug);
    const canAddToCompare = compareCards.length < 3;

    const handleCompareClick = () => {
        if (isInCompare) {
            const newCards = compareCards.filter(s => s !== card.slug);
            router.push(`/compare?cards=${newCards.join(',')}`);
        } else if (canAddToCompare) {
            const newCards = [...compareCards, card.slug];
            router.push(`/compare?cards=${newCards.join(',')}`);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden group">
            {/* Card Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-6">
                <div className="relative w-full h-full">
                    <CardImage
                        src={`/images/cards/${card.imageFile}`}
                        alt={`${card.creditCardName} credit card`}
                        fill
                        className="object-contain"
                    />
                </div>
                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                    {card.category}
                </span>
            </div>

            {/* Card Content */}
            <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                    {card.creditCardName}
                </h3>
                <p className="text-gray-500 text-sm mb-4">by {card.issuer}</p>

                <div className="space-y-2 mb-5">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Annual Fee</span>
                        <span className="font-semibold text-gray-900">{card.annualFeeDisplay}</span>
                    </div>
                    {card.welcomeBonus && (
                        <div className="flex justify-between items-start">
                            <span className="text-gray-600 text-sm">Welcome Bonus</span>
                            <span className="text-sm text-gray-700 text-right max-w-[60%]">
                                {truncateText(card.welcomeBonus, 60)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Link
                        href={`/card/${card.slug}`}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white text-center py-2.5 px-4 rounded-lg font-medium transition-colors text-sm"
                    >
                        View Details
                    </Link>
                    <button
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
        </div>
    );
}
