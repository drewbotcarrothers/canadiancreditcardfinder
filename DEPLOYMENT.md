# Deploying to Hostinger

The site is a static Astro build. Hostinger does not need a Node server at runtime. Use GitHub auto-deploy (or upload the `dist/` folder) with the settings below.

## Hostinger GitHub auto-deploy

In the Hostinger website / Git deployment settings:

| Setting | Value |
| --- | --- |
| Repository | `drewbotcarrothers/canadiancreditcardfinder` |
| Branch | `main` (or the branch you deploy from) |
| Build command | `npm install && npm run build` |
| Node version | 20 or newer |
| Publish / output directory | `dist` |

After a successful build, Hostinger should publish the contents of `dist/` to `public_html`.

The production output includes:

* `index.html` — homepage
* `compare/index.html` — compare page
* `card/<slug>/index.html` — individual card pages (trailing-slash URLs)
* `sitemap.xml`
* `_astro/` — hashed CSS and JS
* `images/` — logo and card images
* `ads.txt`

## Manual upload (optional)

1. Run `npm install` and `npm run build` locally.
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
