/**
 * The site's single author. Public name only: never add a surname.
 * The bio below is Andrew's approved wording; keep it verbatim.
 */
export const AUTHOR_NAME = 'Andrew';
export const AUTHOR_PATH = '/about/#andrew';
export const AUTHOR_BIO =
    'Andrew is a personal finance expert, DIY investor and life optimizer based in Toronto, Canada. With over 19 years of corporate experience at a leading Canadian company, Andrew combines deep industry knowledge with a passion for technology to help others navigate personal finance and streamline their daily lives.';

const DEFAULT_SITE = 'https://canadiancreditcardfinder.com';

/** schema.org Person for JSON-LD `author` fields. */
export function authorJsonLd(site: URL | string | undefined) {
    return {
        '@type': 'Person',
        name: AUTHOR_NAME,
        url: new URL(AUTHOR_PATH, site ?? DEFAULT_SITE).href,
        description: AUTHOR_BIO,
        homeLocation: {
            '@type': 'Place',
            name: 'Toronto, Ontario, Canada',
        },
    };
}

/** schema.org Organization for JSON-LD `publisher` fields. */
export function publisherJsonLd(site: URL | string | undefined) {
    const base = site ?? DEFAULT_SITE;
    return {
        '@type': 'Organization',
        '@id': `${new URL('/', base).href}#organization`,
        name: 'Canadian Credit Card Finder',
        url: new URL('/', base).href,
        logo: {
            '@type': 'ImageObject',
            url: new URL('/images/logo-512.png', base).href,
            width: 512,
            height: 512,
        },
    };
}
