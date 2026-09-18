const CARDS_PREFIX = '/images/cards/';
const PLACEHOLDER_FILE = 'placeholder.png';

/** Intrinsic size of files in `public/images/cards/` (used for CLS). */
export const CARD_IMAGE_WIDTH = 250;
export const CARD_IMAGE_HEIGHT = 200;

/**
 * Sheet filenames that exist on disk only as a placeholder copy,
 * while a real asset is stored under a nearby name.
 */
const IMAGE_FILE_ALIASES: Record<string, string> = {
    'Triangle World Elite Mastercard.png': 'Triangle® World Elite Mastercard.png',
};

export const PLACEHOLDER_IMAGE_SRC = `${CARDS_PREFIX}${encodeURIComponent(PLACEHOLDER_FILE)}`;

export function cardImageSrc(imageFileOrPath: string | undefined | null): string {
    const raw = (imageFileOrPath ?? '').trim();
    if (!raw) {
        return PLACEHOLDER_IMAGE_SRC;
    }

    let filename = raw;
    if (raw.startsWith(CARDS_PREFIX)) {
        filename = safeDecode(raw.slice(CARDS_PREFIX.length));
    } else if (raw.startsWith('/')) {
        return raw;
    }

    filename = IMAGE_FILE_ALIASES[filename] ?? filename;
    return `${CARDS_PREFIX}${encodeURIComponent(filename)}`;
}

function safeDecode(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}
