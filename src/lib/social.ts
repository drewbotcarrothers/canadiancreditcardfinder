/** Official social profiles, used in the footer, the About page and Organization `sameAs`. */
export const SOCIAL_PROFILES = [
    {
        name: 'YouTube',
        label: 'Canadian Credit Card Finder on YouTube',
        url: 'https://www.youtube.com/@CanadianCreditCardFinder',
    },
    {
        name: 'Instagram',
        label: 'Canadian Credit Card Finder on Instagram',
        url: 'https://www.instagram.com/canadiancreditcardfinder/',
    },
] as const;

export const SOCIAL_SAME_AS: string[] = SOCIAL_PROFILES.map((profile) => profile.url);
