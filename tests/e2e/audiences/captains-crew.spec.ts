import { test, expect } from '../../../fixtures/base.fixture';
import { URLS } from '../../../fixtures/urls';

/**
 * Page-unique behavioural tests for Captains and Crew.
 * Health checks (title, heading, CTA, no-404) are covered by product-health.spec.ts.
 */
test.describe('Captains and Crew page - unique behaviours', () => {
  test.beforeEach(async ({ navigate }) => {
    await navigate(URLS.captainsAndCrew);
  });

  test('testimonials are attributed to real named crew members', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/dean harrison|captain ian jinks|ian jinks/i);
  });

  test('Tell me more CTA links to the Yacht Accounting page', async ({ page }) => {
    const link = page.getByRole('link', { name: /tell me more/i }).first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /yacht-accounting/);
  });
});
