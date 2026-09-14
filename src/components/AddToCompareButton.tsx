import { useCompare } from '../hooks/useCompare';

interface AddToCompareButtonProps {
    slug: string;
}

export default function AddToCompareButton({ slug }: AddToCompareButtonProps) {
    const { compareCards, addCard, removeCard } = useCompare();
    const isInCompare = compareCards.includes(slug);
    const canAddToCompare = compareCards.length < 3;

    const handleCompareClick = () => {
        if (isInCompare) {
            const newCards = compareCards.filter(s => s !== slug);
            removeCard(slug);
            window.location.assign(newCards.length > 0 ? `/compare/?cards=${newCards.join(',')}` : '/compare/');
        } else if (canAddToCompare) {
            const newCards = [...compareCards, slug];
            addCard(slug);
            window.location.assign(`/compare/?cards=${newCards.join(',')}`);
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
