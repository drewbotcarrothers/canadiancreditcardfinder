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

    const sentences = trimmed.match(/[^.!?]+[.!?]+(?:["”']\s*|\s+|$)|[^.!?]+$/g);
    if (!sentences || sentences.length < 3) {
        return [trimmed];
    }

    const paragraphs: string[] = [];
    for (let i = 0; i < sentences.length; i += 2) {
        paragraphs.push(sentences.slice(i, i + 2).join('').trim());
    }
    return paragraphs.filter(Boolean);
}
