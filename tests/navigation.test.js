/**
 * Headless browser navigation tests for coraza.io
 *
 * These tests verify that core site functionality works correctly:
 * - Page navigation
 * - Desktop and mobile menus
 * - Language switching
 * - Theme toggling
 * - Dropdown components
 *
 * Prerequisites: Hugo dev server must be running on localhost:1313
 *   $ hugo server --port 1313 --disableLiveReload
 *
 * Run: npm test
 */

const puppeteer = require('puppeteer');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:1313';
let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}, 30000);

afterAll(async () => {
  if (browser) await browser.close();
});

async function newPage(viewport = { width: 1280, height: 800 }) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  return page;
}

describe('Page Navigation', () => {
  test('homepage loads successfully', async () => {
    const page = await newPage();
    const response = await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    expect(response.status()).toBe(200);

    const title = await page.title();
    expect(title).toContain('Coraza');
    await page.close();
  });

  test('docs page loads successfully', async () => {
    const page = await newPage();
    const response = await page.goto(`${BASE_URL}/docs/tutorials/quick-start/`, { waitUntil: 'networkidle0' });
    expect([200, 304]).toContain(response.status());
    await page.close();
  });

  test('navigation links work', async () => {
    const page = await newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('a[href="/docs/tutorials/quick-start/"]'),
    ]);

    expect(page.url()).toContain('/docs/tutorials/quick-start/');
    await page.close();
  });

  test('no JavaScript errors on homepage', async () => {
    const page = await newPage();
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    expect(errors).toHaveLength(0);
    await page.close();
  });

  test('all scripts load successfully', async () => {
    const page = await newPage();
    const failedScripts = [];
    page.on('requestfailed', (req) => {
      if (req.resourceType() === 'script' && !req.url().includes('livereload')) {
        failedScripts.push(req.url());
      }
    });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    expect(failedScripts).toHaveLength(0);
    await page.close();
  });
});

describe('Desktop Menu', () => {
  test('language dropdown opens on click', async () => {
    const page = await newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const btn = await page.$('#doks-languages');
    expect(btn).not.toBeNull();

    await page.click('#doks-languages');
    await new Promise((r) => setTimeout(r, 300));

    const hasShow = await page.evaluate(() => {
      const menu = document.querySelector('.dropdown-menu[aria-labelledby=doks-languages]');
      return menu?.classList.contains('show');
    });
    expect(hasShow).toBe(true);
    await page.close();
  });

  test('language dropdown closes on second click', async () => {
    const page = await newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    await page.click('#doks-languages');
    await new Promise((r) => setTimeout(r, 300));
    await page.click('#doks-languages');
    await new Promise((r) => setTimeout(r, 300));

    const hasShow = await page.evaluate(() => {
      const menu = document.querySelector('.dropdown-menu[aria-labelledby=doks-languages]');
      return menu?.classList.contains('show');
    });
    expect(hasShow).toBe(false);
    await page.close();
  });
});

describe('Mobile Menu', () => {
  test('hamburger menu opens offcanvas on mobile', async () => {
    const page = await newPage({ width: 375, height: 812 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const toggler = await page.$('[data-bs-target="#offcanvasNavMain"]');
    expect(toggler).not.toBeNull();

    await toggler.click();
    await new Promise((r) => setTimeout(r, 500));

    const offcanvasVisible = await page.evaluate(() => {
      const offcanvas = document.getElementById('offcanvasNavMain');
      return offcanvas?.classList.contains('show') || offcanvas?.classList.contains('showing');
    });
    expect(offcanvasVisible).toBe(true);
    await page.close();
  });
});

describe('Language Switching', () => {
  test('can switch to Spanish', async () => {
    const page = await newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Open language dropdown
    await page.click('#doks-languages');
    await new Promise((r) => setTimeout(r, 300));

    // Click Spanish link
    const esLink = await page.$('.dropdown-menu[aria-labelledby=doks-languages] a[hreflang="es"]');
    expect(esLink).not.toBeNull();

    await esLink.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    expect(page.url()).toContain('/es/');
    await page.close();
  });

  test('Spanish homepage loads', async () => {
    const page = await newPage();
    const response = await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle0' });
    expect([200, 304]).toContain(response.status());
    await page.close();
  });
});

describe('Theme Toggle', () => {
  test('theme toggle button exists and switches theme', async () => {
    const page = await newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const toggleBtn = await page.$('#buttonColorMode');
    expect(toggleBtn).not.toBeNull();

    const initialTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-bs-theme');
    });

    await toggleBtn.click();
    await new Promise((r) => setTimeout(r, 300));

    const newTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-bs-theme');
    });

    expect(newTheme).not.toBe(initialTheme);
    await page.close();
  });
});

describe('Deploy Anywhere Section', () => {
  test('connector tabs switch code panel content', async () => {
    const page = await newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const defaultFilename = await page.evaluate(() => {
      return document.getElementById('cp-filename')?.textContent;
    });
    expect(defaultFilename).toBe('envoy.yaml');

    const caddyTab = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('.connector-tab')).find(
        (el) => el.textContent.includes('Caddy')
      );
    });
    await caddyTab.click();
    await new Promise((r) => setTimeout(r, 200));

    const newFilename = await page.evaluate(() => {
      return document.getElementById('cp-filename')?.textContent;
    });
    expect(newFilename).toBe('Caddyfile');
    await page.close();
  });

  test('Traefik tabs show the Proxy plugin and Hub middleware configs', async () => {
    const page = await newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const cases = [
      { tab: 'Traefik Proxy', filename: 'traefik.yaml', snippet: 'github.com/jcchavezs/coraza-http-wasm-traefik' },
      { tab: 'Traefik Hub', filename: 'waf.yaml', snippet: 'crsEnabled: true' },
    ];

    for (const { tab, filename, snippet } of cases) {
      const tabHandle = await page.evaluateHandle((text) => {
        return Array.from(document.querySelectorAll('.connector-tab')).find(
          (el) => el.textContent.includes(text)
        );
      }, tab);
      await tabHandle.click();
      await new Promise((r) => setTimeout(r, 200));

      const state = await page.evaluate(() => ({
        filename: document.getElementById('cp-filename')?.textContent,
        code: document.getElementById('cp-code')?.textContent,
        active: document.querySelector('.connector-tab.active')?.textContent,
      }));
      expect(state.filename).toBe(filename);
      expect(state.code).toContain(snippet);
      expect(state.active).toContain(tab);
    }
    await page.close();
  });
});

describe('Connectors Page', () => {
  test('Traefik Hub card links to its docs, Traefik Proxy card to its source', async () => {
    const page = await newPage();
    await page.goto(`${BASE_URL}/connectors/`, { waitUntil: 'networkidle0' });

    const cards = await page.evaluate(() => {
      const find = (title) => Array.from(document.querySelectorAll('.card')).find(
        (c) => c.querySelector('h2')?.textContent.trim() === title
      );
      return ['Traefik Proxy', 'Traefik Hub'].map((title) => {
        const card = find(title);
        const footerLink = card?.querySelector('.border-top a');
        return {
          title,
          titleHref: card?.querySelector('h2 a')?.href,
          href: footerLink?.href,
          label: footerLink?.textContent.trim(),
        };
      });
    });

    const proxyRepo = 'https://github.com/jcchavezs/coraza-http-wasm-traefik';
    const hubDocs = 'https://doc.traefik.io/traefik-hub/api-gateway/secure/middleware/waf-guide';
    expect(cards[0]).toEqual({ title: 'Traefik Proxy', titleHref: proxyRepo, href: proxyRepo, label: 'Source' });
    expect(cards[1]).toEqual({ title: 'Traefik Hub', titleHref: hubDocs, href: hubDocs, label: 'Docs' });
    await page.close();
  });
});
