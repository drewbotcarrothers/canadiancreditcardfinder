#!/usr/bin/env node
// Submit every sitemap URL to IndexNow (Bing, Yandex, Seznam, Naver and other participating engines).
// Run after a deploy: `npm run indexnow`. Add `-- --dry-run` to print the payload without sending it.
//
// URL source: dist/sitemap.xml when a build is present, otherwise the live sitemap.
// The key file public/<key>.txt is copied to the site root by the build; IndexNow fetches it to verify ownership.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SITE = 'https://canadiancreditcardfinder.com';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dryRun = process.argv.includes('--dry-run');

function findKey() {
    if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY.trim();
    const publicDir = path.join(root, 'public');
    for (const file of readdirSync(publicDir)) {
        const match = file.match(/^([a-f0-9]{32})\.txt$/);
        if (match && readFileSync(path.join(publicDir, file), 'utf8').trim() === match[1]) return match[1];
    }
    throw new Error('No IndexNow key file (public/<32 hex chars>.txt containing the key) found.');
}

async function loadSitemap() {
    const local = path.join(root, 'dist', 'sitemap.xml');
    if (existsSync(local)) return { xml: readFileSync(local, 'utf8'), source: 'dist/sitemap.xml' };
    const res = await fetch(`${SITE}/sitemap.xml`);
    if (!res.ok) throw new Error(`Could not fetch ${SITE}/sitemap.xml (${res.status})`);
    return { xml: await res.text(), source: `${SITE}/sitemap.xml` };
}

const key = findKey();
const { xml, source } = await loadSitemap();
const urlList = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
    .map((m) => m[1])
    .filter((url) => url.startsWith(`${SITE}/`));

if (urlList.length === 0) throw new Error(`No ${SITE} URLs found in ${source}`);

const host = new URL(SITE).host;
const payload = { host, key, keyLocation: `${SITE}/${key}.txt`, urlList };
console.log(`IndexNow: ${urlList.length} URLs from ${source}`);

if (dryRun) {
    console.log(JSON.stringify({ ...payload, urlList: [...urlList.slice(0, 5), '…'] }, null, 2));
    process.exit(0);
}

// IndexNow accepts up to 10,000 URLs per request.
for (let i = 0; i < urlList.length; i += 10000) {
    const batch = urlList.slice(i, i + 10000);
    const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ ...payload, urlList: batch }),
    });
    const body = await res.text();
    console.log(`IndexNow: HTTP ${res.status} for ${batch.length} URLs${body ? ` — ${body.slice(0, 300)}` : ''}`);
    // 200 = accepted, 202 = accepted while the key is being verified.
    if (res.status !== 200 && res.status !== 202) process.exit(1);
}
