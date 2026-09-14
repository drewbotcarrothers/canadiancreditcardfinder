import { useStore } from '@nanostores/react';
import { $compareCards, addCard, clearCards, isInCompare, removeCard, setCompareCards } from '../stores/compare';

export function useCompare() {
    const compareCards = useStore($compareCards);

    return {
        compareCards,
        addCard,
        removeCard,
        clearCards,
        setCompareCards,
        isInCompare: (slug: string) => compareCards.includes(slug) || isInCompare(slug),
    };
}
