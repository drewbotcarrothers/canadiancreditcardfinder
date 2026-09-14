import { persistentAtom } from '@nanostores/persistent';

const MAX_COMPARE_CARDS = 3;

export const $compareCards = persistentAtom<string[]>('compareCards', [], {
    encode: JSON.stringify,
    decode: (value) => {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
        } catch {
            return [];
        }
    },
});

export function addCard(slug: string) {
    const current = $compareCards.get();
    if (current.length < MAX_COMPARE_CARDS && !current.includes(slug)) {
        $compareCards.set([...current, slug]);
    }
}

export function removeCard(slug: string) {
    $compareCards.set($compareCards.get().filter((item) => item !== slug));
}

export function clearCards() {
    $compareCards.set([]);
}

export function isInCompare(slug: string) {
    return $compareCards.get().includes(slug);
}

export function setCompareCards(slugs: string[]) {
    $compareCards.set(slugs.slice(0, MAX_COMPARE_CARDS));
}
