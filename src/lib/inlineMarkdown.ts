function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderInline(escaped: string): string {
    const withLinks = escaped.replace(/\[([^\]]+)\]\((\/[^)\s]+)\)/g, (_match, label: string, href: string) => {
        const safeHref = href.replace(/"/g, '&quot;');
        return `<a href="${safeHref}" class="text-red-600 hover:text-red-700 underline underline-offset-2">${label}</a>`;
    });

    return withLinks.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/**
 * Escape HTML, then render a tiny subset of markdown used in editorial copy:
 * relative links `[label](/path/)` and `**bold**`.
 */
export function renderInlineMarkdown(text: string): string {
    return renderInline(escapeHtml(text));
}

/** Same as `renderInlineMarkdown`, wrapping double-newline blocks in `<p>` tags. */
export function renderMarkdownParagraphs(text: string): string {
    const blocks = splitIntoParagraphs(text);
    return blocks.map((block) => `<p>${renderInline(escapeHtml(block))}</p>`).join('');
}

function splitIntoParagraphs(text: string): string[] {
    if (/\n{2,}/.test(text)) {
        return text
            .split(/\n{2,}/)
            .map((block) => block.trim())
            .filter(Boolean);
    }

    const trimmed = text.trim();
    if (trimmed.length < 420) {
        return [trimmed];
    }

    const sentences = splitSentences(trimmed);
    if (sentences.length < 3) {
        return [trimmed];
    }

    const paragraphs: string[] = [];
    for (let i = 0; i < sentences.length; i += 2) {
        paragraphs.push(sentences.slice(i, i + 2).join(' ').replace(/\s+/g, ' ').trim());
    }
    return paragraphs.filter(Boolean);
}

/**
 * Split on .?! that actually end a sentence. Leave decimals (1.25x, 0.5%,
 * 21.99%) and domains (Amazon.ca, Costco.ca) intact.
 */
function splitSentences(text: string): string[] {
    const parts: string[] = [];
    let start = 0;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch !== '.' && ch !== '!' && ch !== '?') {
            continue;
        }

        const prev = text[i - 1] ?? '';
        const next = text[i + 1] ?? '';
        if (ch === '.' && /\d/.test(prev) && /\d/.test(next)) {
            continue;
        }
        if (ch === '.' && /[A-Za-z]/.test(prev) && /[a-z]/.test(next)) {
            continue;
        }

        let j = i + 1;
        while (j < text.length && /["”']/.test(text[j])) {
            j++;
        }
        const hadSpace = j < text.length && /\s/.test(text[j]);
        while (j < text.length && /\s/.test(text[j])) {
            j++;
        }
        const nextVisible = text[j] ?? '';
        const isEnd = j >= text.length || (hadSpace && /[A-Z“"]/.test(nextVisible));
        if (!isEnd) {
            continue;
        }

        const sentence = text.slice(start, j).trim();
        if (sentence) {
            parts.push(sentence);
        }
        start = j;
        i = j - 1;
    }

    const tail = text.slice(start).trim();
    if (tail) {
        parts.push(tail);
    }
    return parts;
}
