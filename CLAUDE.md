# CLAUDE.md

## Project

This is the [coraza.io](https://www.coraza.io) website — a Hugo static site using the @thulite/doks-core theme, deployed to GitHub Pages.

## Build & Dev

```bash
npm install          # install dependencies
npm run dev          # start dev server (localhost:1313)
npm run build        # production build
npm test             # run headless browser tests (requires hugo server on :1313)
```

## Testing

Headless browser tests live in `tests/navigation.test.js` and use Puppeteer.
They require a Hugo dev server running on `localhost:1313`.

**When modifying the site, keep tests in sync:**

- If you add or change interactive UI components (dropdowns, modals, tabs, menus), add or update the corresponding test in `tests/navigation.test.js`.
- If you add a new page or section, add a basic navigation test for it.
- If you change the language configuration, update the language switching tests.
- Run `npm test` after changes to verify nothing is broken.

## Known Pitfalls

- **Do not import the full `bootstrap` package in individual JS bundles.** Use individual module imports like `import Modal from 'bootstrap/js/dist/modal.js'` instead of `import { Modal } from 'bootstrap'`. The latter bundles all of Bootstrap including duplicate event handlers that break other components (like the Dropdown `clearMenus` conflict). See `assets/js/search-modal.js` for the correct pattern.
- The production base URL is `https://www.coraza.io/` — all CNAME files and config must use `www.coraza.io`.
