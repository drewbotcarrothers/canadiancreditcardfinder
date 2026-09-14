'use client';

import { useRouter } from 'next/navigation';
import { useCompare } from '@/context/CompareContext';

interface AddToCompareButtonProps {
    slug: string;
}

export default function AddToCompareButton({ slug }: AddToCompareButtonProps) {
    const router = useRouter();
    const { compareCards, addCard, removeCard } = useCompare();
    const isInCompare = compareCards.includes(slug);
    const canAddToCompare = compareCards.length < 3;

    const handleCompareClick = () => {
        if (isInCompare) {
            const newCards = compareCards.filter(s => s !== slug);
            removeCard(slug);
            router.push(`/compare?cards=${newCards.join(',')}`);
        } else if (canAddToCompare) {
            const newCards = [...compareCards, slug];
            addCard(slug);
            router.push(`/compare?cards=${newCards.join(',')}`);
        }
    };

    return (
        <button
            onClick={handleCompareClick}
            disabled={!isInCompare && !canAddToCompare}
            className={`border-2 py-3 px-8 rounded-lg font-semibold transition-colors ${isInCompare
                ? 'bg-red-50 border-red-600 text-red-600 hover:bg-red-100'
                : canAddToCompare
                    ? 'border-red-600 text-red-600 hover:bg-red-50'
                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
        >
            {isInCompare ? '✓ In Compare' : '+ Add to Compare'}
        </button>
    );
}
