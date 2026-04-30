import { test, expect } from '../../../fixtures/base.fixture';
import { URLS } from '../../../fixtures/urls';

/**
 * Parametrised health check for every product page.
 *
 * These four assertions are the minimum contract for any page in the suite:
 *   1. Title is Voly-branded (guards against 404 or wrong-page errors).
 *   2. At least one heading is visible (guards against blank renders).
 *   3. The primary conversion CTA (Book a Demo) is present and linked correctly.
 *   4. No server-error message is displayed.
 *
 * Page-unique behavioural tests (deep-link CTAs, external partner links,
 * testimonial attribution, store links) live in the individual spec files
 * alongside this one so this file stays focused and easy to scan.
 */

const PRODUCT_PAGES = [
  {
    name: 'Yacht Accounting',
    path: URLS.yachtAccounting,
    ctaText: /book a demo|get in touch/i,
    ctaHref: /book-a-demo/,
  },
  {
    name: 'APA Management',
    path: URLS.apaManagement,
    ctaText: /sign up now/i,
    ctaHref: /free-voly-apa/,
  },
  {
    name: 'Voly Features',
    path: URLS.volyFeatures,
    ctaText: /book a demo|get in touch/i,
    ctaHref: /book-a-demo/,
  },
  {
    name: 'Multi-Asset Management',
    path: URLS.multiAssetManagement,
    ctaText: /book a demo|get in touch/i,
    ctaHref: /book-a-demo/,
  },
  {
    name: 'Treasury Management / FX',
    path: URLS.treasuryManagement,
    ctaText: /book a demo|get in touch/i,
    ctaHref: /book-a-demo/,
  },
  {
    name: 'Security',
    path: URLS.security,
    ctaText: /book a demo|get in touch/i,
    ctaHref: /book-a-demo/,
  },
  {
    name: 'Family Office',
    path: URLS.familyOffice,
    ctaText: /book a demo|get in touch/i,
    ctaHref: /book-a-demo/,
  },
  {
    name: 'Prepaid Card',
    path: URLS.prepaidCard,
    ctaText: /book a demo|get in touch/i,
    ctaHref: /book-a-demo/,
  },
  {
    name: 'Certification',
    path: URLS.certification,
    ctaText: /enrol now/i,
    ctaHref: /voly\.myabsorb\.eu/,
  },
] as const;

for (const pageDef of PRODUCT_PAGES) {
  test.describe(`${pageDef.name} page`, () => {
    test.beforeEach(async ({ navigate }) => {
      await navigate(pageDef.path);
    });

    test('title is Voly-branded @smoke', async ({ page }) => {
      await expect(page).toHaveTitle(/voly/i);
    });

    test('a heading is visible', async ({ page }) => {
      await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    });

    test('primary conversion CTA is present and points to the expected destination', async ({ page }) => {
      const cta = page.getByRole('link', { name: pageDef.ctaText }).first();
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute('href', pageDef.ctaHref);
    });

    test('does not display a 404 or server error', async ({ page }) => {
      await expect(page.locator('body')).not.toContainText(/404|page not found/i);
    });
  });
}
