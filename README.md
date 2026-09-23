# AssetFold website

A one-page, mobile-first presentation of the accepted AssetFold design and forward model. Verdict: **works under conditions**. This is a protocol proposal and scenario analysis, not a live protocol, investment recommendation, backtest or promised return.

## Deliverables

- `dist/index.html` and `dist/assets/`: complete static publication export, including downloadable research. Serve this directory without rebuilding.
- `web/src/`: HTML, CSS and typed JavaScript source. There is no runtime dependency, backend, wallet connection, remote font or analytics.
- `web/package.json`, `web/package-lock.json`: build scripts and pinned TypeScript tooling. The lockfile is deliberately inside `web/`, not at repository root.
- `report.md`, `sources.md`, `model.py`, `data/scenarios.csv`: accepted previous work, preserved unchanged.
- `artifacts/validation.md`: actual checks, review and limitations.

The small Node build copies the source and research into `dist/`, then packages the unchanged CSV as a local JavaScript module. Both charts and all changing figures read that CSV. This avoids a runtime data request. The design uses native HTML disclosures and SVG charts, so React/Vite would add no required functionality here.

## Install, typecheck and rebuild

Use Node 22+ and npm; Python 3 is needed for the model and local preview. From the repository root:

```sh
npm ci --prefix web
npm run typecheck --prefix web
npm run build --prefix web
npm run preview --prefix web
```

Preview at `http://localhost:4173`. `npm ci` installs only development tooling; no dependency directory belongs in the submission. The build itself works with Node alone. Do not include `node_modules`, caches, downloaded test tools or dependency archives in publication/submission. No ignore files were added or changed.

Typecheck uses TypeScript's `--allowJs --checkJs --noEmit` on the JSDoc-typed client. The generated CSV module is exempted at its import only. To reproduce the accepted model, run `python3 model.py`; it uses the standard library and writes the CSV without any network/RPC call. Rebuild the site afterward to copy the CSV.

## Publish

Upload **the contents of `dist/`**, including `assets/`, to the static publisher's document root. For the contributor publisher, select `dist` as the export directory; no remote build is necessary. Asset links are relative (`./assets/...`), navigation uses section hashes, and scenario state uses `?scenario=...`, so gateway subpaths work without route rewrites. Set HTML, CSS and JavaScript MIME types normally; serve Python and Markdown downloads as static files, never execute them on a server. Only the website is published; no protocol deployment is performed.

After publication, open the public URL at 390px and desktop width, select “Trading fades,” refresh to check retained state, and download the CSV. This session produced and locally served the export, but supplied no external publisher credentials, callable deployment tool or public destination. **A public deployment URL has not been created or verified here.** Git metadata was not modified because this assignment prohibits touching `.git/`; the deliverable files are ready for the contributor submission process.

## Validation performed

Production build and typecheck passed. Chromium 145, via Playwright 1.58.2, checked the actual export at 390×900 and 1440×900: nine ordered sections; no horizontal overflow; all five scenarios; every displayed monthly value against CSV; charts; state after reload; Enter-key selection; disclosures; anchor navigation; and research asset HTTP responses. No page, console or resource errors were observed. Full-page and viewport screenshots were inspected locally. The model reproduced all 60 saved rows exactly, and export copies match the accepted inputs byte-for-byte.

Optional browser regression script (run from repository root with preview running):

```sh
mkdir -p test/scratch
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node web/scripts/validate-browser.mjs
```

The script accepts a separately installed Playwright module and browser; it is not a production dependency. During this session TypeScript and Playwright tarballs, Chromium and missing system libraries were extracted under `/tmp`, without installing repository dependency directories. See validation notes for exact worker commands. Screenshots are written to disposable `test/scratch/`.

The Vercel Web Interface Guidelines were fetched and reviewed on 2026-09-23. Review evidence and remaining limitations are in `artifacts/validation.md`. Browser checks are worker observations, not independent certification; Safari, Firefox, real devices and screen-reader announcements were not tested.
