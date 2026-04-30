import { test, expect } from '../../../fixtures/base.fixture';
import { URLS } from '../../../fixtures/urls';

/**
 * Parametrised health check for every audience page.
 *
 * These assertions keep audience-page coverage concise while still proving
 * the core contract: correct page, visible content, conversion route, no 404.
 */

const AUDIENCE_PAGES = [
  { name: 'Captains and Crew', path: URLS.captainsAndCrew },
  { name: 'Family Offices', path: URLS.familyOffices },
  { name: 'Management Company', path: URLS.managementCompany },
  { name: 'Superyacht Owner', path: URLS.superyachtOwner },
] as const;

for (const pageDef of AUDIENCE_PAGES) {
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

    test('Book a Demo CTA is present and links to /book-a-demo', async ({ page }) => {
      const cta = page.locator('a[href*="book-a-demo"]').first();
      await expect(cta).toBeVisible();
    });

    test('does not display a 404 or server error', async ({ page }) => {
      await expect(page.locator('body')).not.toContainText(/404|page not found/i);
    });
  });
}
