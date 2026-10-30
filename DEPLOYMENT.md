# Deploying to Hostinger

## Automatic deploy (current setup)

`.github/workflows/deploy.yml` builds the site on GitHub (Node 22) and uploads `dist/` to Hostinger over FTP:

* Every push to `main` (a merged PR) builds and deploys, live in about 3 minutes.
* A daily run at 13:30 UTC rebuilds so card-data sheet edits go live without a code change.
* Pull requests only build, to catch broken builds before merge.
* It can be run by hand from the Actions tab ("Run workflow").

It needs these GitHub repo secrets (Settings > Secrets and variables > Actions), taken from hPanel > Files > FTP Accounts:

| Secret | Value |
| --- | --- |
| `FTP_SERVER` | FTP host (IP or `ftp.canadiancreditcardfinder.com`) |
| `FTP_USERNAME` | FTP username |
| `FTP_PASSWORD` | FTP password |

If the FTP account's root is not the site's `public_html`, set the repo variable `FTP_SERVER_DIR` to the path of `public_html` relative to the FTP root, ending in `/`.

Hostinger's own Git auto-deploy should be disconnected so the two don't overwrite each other. The workflow never deletes server files that aren't in `dist/`.

The rest of this document describes the older Hostinger Git deploy and a manual upload, kept for reference.

The site is a static Astro build. Hostinger does not need a Node server at runtime. Use GitHub auto-deploy (or upload the `dist/` folder) with the settings below.

## Hostinger GitHub auto-deploy

In the Hostinger website / Git deployment settings:

| Setting | Value |
| --- | --- |
| Repository | `drewbotcarrothers/canadiancreditcardfinder` |
| Branch | `main` (or the branch you deploy from) |
| Build command | `npm install && npm run build` |
| Node version | **22.x** (22.12.0 or newer) or **24.x**. Node 18 and 20 will fail: Astro 7 requires Node >= 22.12.0 |
| Publish / output directory | `dist` |

After a successful build, Hostinger should publish the contents of `dist/` to `public_html`.

`package.json` declares `"engines": { "node": ">=22.12.0" }` and `.nvmrc` pins `22`, so Hostinger's auto-detection should preselect Node 22. Check the Node version selector in the deployment settings anyway.

The production output includes:

* `index.html` — homepage
* `compare/index.html` — compare page
* `card/<slug>/index.html` — individual card pages (trailing-slash URLs)
* `sitemap.xml`
* `robots.txt`
* `_astro/` — hashed CSS and JS
* `images/` — logo and card images
* `ads.txt`

## Manual upload (optional)

1. Use Node 22.12.0+ (or 24), then run `npm install` and `npm run build` locally.
2. In Hostinger File Manager, open `public_html`.
3. Upload the **contents** of the `dist/` folder (not the folder itself).
4. Remove leftover default files such as `default.php` if they are present.

## Verify deployment

1. Open `https://canadiancreditcardfinder.com`.
2. Confirm the homepage listing and filters load.
3. Open a card page such as `/card/westjet-rbc-mastercard/`.
4. Use **Add to Compare** and open `/compare/`.

## Troubleshooting

* **404 on card or compare pages:** Confirm the publish directory is `dist` (not `out` or `.next`) and that directory-style paths (`compare/index.html`, `card/<slug>/index.html`) were uploaded.
* **Missing styles or scripts:** Upload the `_astro/` folder from `dist/`.
* **Missing images:** Confirm `images/` from `dist/` is on the server.
* **Stale site:** Clear the browser cache and Hostinger cache if enabled.

## Future updates

Push to the connected GitHub branch. Hostinger will run `npm install && npm run build` and publish `dist/`.

If you deploy manually, rebuild locally and replace the contents of `public_html` with the new `dist/` files.

## Paid ebook (Playbook 2027) variables

The sales page `/playbook/` and the noindexed `/playbook/thank-you/` read checkout and buyer-download URLs at build time.
Hostinger env vars do not reach this static FTP build, so set these under **GitHub → Settings → Secrets and variables → Actions → Variables**
(they must be passed to `npm run build` in `.github/workflows/deploy.yml` with an `env:` block; see the PR description). Leave them empty locally. Paid files are never committed here.

| Variable | Value |
|---|---|
| `PUBLIC_PLAYBOOK_PAYMENT_LINK` | Stripe Payment Link, Playbook $29 CAD |
| `PUBLIC_PLAYBOOK_BUNDLE_PAYMENT_LINK` | Stripe Payment Link, Bundle $49 CAD |
| `PUBLIC_PLAYBOOK_SCRIPTS_PAYMENT_LINK` | Stripe Payment Link, Call Script Pack $9 CAD |
| `PUBLIC_PLAYBOOK_FOLDER_URL` / `PUBLIC_PLAYBOOK_DOWNLOAD_URL` | Drive folder / zip download for the $29 tier |
| `PUBLIC_PLAYBOOK_BUNDLE_FOLDER_URL` / `PUBLIC_PLAYBOOK_BUNDLE_DOWNLOAD_URL` | Drive folder / zip for the $49 tier |
| `PUBLIC_PLAYBOOK_SCRIPTS_FOLDER_URL` / `PUBLIC_PLAYBOOK_SCRIPTS_DOWNLOAD_URL` | Drive folder / zip for the $9 tier |

Until a Payment Link variable is set, its buy buttons fall back to `#buy`. After changing variables, re-run the deploy workflow on main.
