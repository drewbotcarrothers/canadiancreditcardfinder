/**
 * Paid ebook: The Canadian Credit Card Playbook 2027.
 * Checkout and buyer download URLs come from GitHub Actions repository variables at build time
 * (Hostinger env vars never reach this static FTP build). Paid files are never stored in this repo.
 */
export const PLAYBOOK_PATH = '/playbook/';
export const PLAYBOOK_THANK_YOU_PATH = '/playbook/thank-you/';
export const CHECKLIST_PATH = '/card-fit-checklist/';
export const CHECKLIST_PDF = '/downloads/card-fit-checklist.pdf';
export const PLAYBOOK_PRICE = 29;
export const BUNDLE_PRICE = 49;
export const SCRIPTS_PRICE = 9;

const env = import.meta.env;
export const PLAYBOOK_LINKS = {
    corePaymentLink: (env.PUBLIC_PLAYBOOK_PAYMENT_LINK as string | undefined) || '',
    bundlePaymentLink: (env.PUBLIC_PLAYBOOK_BUNDLE_PAYMENT_LINK as string | undefined) || '',
    scriptsPaymentLink: (env.PUBLIC_PLAYBOOK_SCRIPTS_PAYMENT_LINK as string | undefined) || '',
    coreFolder: (env.PUBLIC_PLAYBOOK_FOLDER_URL as string | undefined) || '',
    coreZip: (env.PUBLIC_PLAYBOOK_DOWNLOAD_URL as string | undefined) || '',
    bundleFolder: (env.PUBLIC_PLAYBOOK_BUNDLE_FOLDER_URL as string | undefined) || '',
    bundleZip: (env.PUBLIC_PLAYBOOK_BUNDLE_DOWNLOAD_URL as string | undefined) || '',
    scriptsFolder: (env.PUBLIC_PLAYBOOK_SCRIPTS_FOLDER_URL as string | undefined) || '',
    scriptsZip: (env.PUBLIC_PLAYBOOK_SCRIPTS_DOWNLOAD_URL as string | undefined) || '',
};

/** Sales-page URL with UTMs. `content` names the placement (nav, finder, stack, best, guide, review, footer). */
export function playbookUrl(content: string, source = 'site', medium = 'cta'): string {
    const p = new URLSearchParams({ utm_source: source, utm_medium: medium, utm_campaign: 'ebook', utm_content: content });
    return `${PLAYBOOK_PATH}?${p.toString()}`;
}
export function checklistUrl(content: string): string {
    const p = new URLSearchParams({ utm_source: 'site', utm_medium: 'cta', utm_campaign: 'leadmagnet', utm_content: content });
    return `${CHECKLIST_PATH}?${p.toString()}`;
}
