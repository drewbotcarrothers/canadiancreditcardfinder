import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Real "Updated" dates for bylines and JSON-LD, taken from git history at build time.
 *
 * - lastModified(file): date of the last commit that touched the file.
 * - firstPublished(file): date of the commit that added the file.
 *
 * If git history is missing or shallow (a depth-1 deploy clone would date every
 * file to the latest commit), both return null and the page falls back to the
 * card-data fetch date or shows no date. We never make up a date.
 */

const ROOT = process.cwd();
const cache = new Map<string, Date | null>();
let gitUsable: boolean | null = null;

function git(args: string[]): string {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

function canUseGit(): boolean {
    if (gitUsable !== null) return gitUsable;
    try {
        gitUsable = git(['rev-parse', '--is-shallow-repository']) === 'false';
    } catch {
        gitUsable = false;
    }
    return gitUsable;
}

function gitDate(file: string, mode: 'last' | 'first'): Date | null {
    const key = `${mode}:${file}`;
    if (cache.has(key)) return cache.get(key) ?? null;

    let result: Date | null = null;
    if (canUseGit() && existsSync(path.join(ROOT, file))) {
        try {
            const args =
                mode === 'last'
                    ? ['log', '-1', '--format=%cI', '--', file]
                    : ['log', '--diff-filter=A', '--follow', '--format=%cI', '--', file];
            const out = git(args).split('\n').filter(Boolean);
            const iso = mode === 'last' ? out[0] : out[out.length - 1];
            if (iso) {
                const date = new Date(iso);
                result = Number.isNaN(date.getTime()) ? null : date;
            }
        } catch {
            result = null;
        }
    }

    cache.set(key, result);
    return result;
}

export function lastModified(file: string): Date | null {
    return gitDate(file, 'last');
}

export function firstPublished(file: string): Date | null {
    return gitDate(file, 'first');
}

/** Latest of several dates, ignoring nulls. */
export function latestDate(...dates: (Date | null | undefined)[]): Date | null {
    const valid = dates.filter((d): d is Date => d instanceof Date && !Number.isNaN(d.getTime()));
    if (valid.length === 0) return null;
    return new Date(Math.max(...valid.map((d) => d.getTime())));
}

let reviewFileBySlug: Map<string, string> | null = null;

/** Repo-relative path of the editorial review file for a card slug (file names don't always match slugs). */
export function reviewSourceFile(slug: string): string | null {
    if (!reviewFileBySlug) {
        reviewFileBySlug = new Map();
        const dir = path.join(ROOT, 'src/reviews');
        if (existsSync(dir)) {
            for (const name of readdirSync(dir)) {
                if (!name.endsWith('.ts') || name === 'index.ts' || name === 'types.ts') continue;
                const text = readFileSync(path.join(dir, name), 'utf8');
                const match = text.match(/\bslug:\s*['"]([^'"]+)['"]/);
                if (match) reviewFileBySlug.set(match[1], `src/reviews/${name}`);
            }
        }
    }
    return reviewFileBySlug.get(slug) ?? null;
}

const DISPLAY_OPTIONS: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Toronto',
};

export function formatDisplayDate(date: Date): string {
    return date.toLocaleDateString('en-CA', DISPLAY_OPTIONS);
}

/** YYYY-MM-DD in Toronto time, for <time datetime>. */
export function formatIsoDate(date: Date): string {
    return date.toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
}
