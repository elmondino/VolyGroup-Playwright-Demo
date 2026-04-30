import { test, expect } from '../../../fixtures/base.fixture';
import { URLS } from '../../../fixtures/urls';

/**
 * Page-unique behavioural tests for Security.
 * Health checks (title, heading, CTA, no-404) are covered by product-health.spec.ts.
 */
test.describe('Security page - unique behaviours', () => {
  test.beforeEach(async ({ navigate }) => {
    await navigate(URLS.security);
  });

  test('View Certification link points to an ISO PDF', async ({ page }) => {
    const certLink = page.getByRole('link', { name: /view.*certification/i }).first();
    await expect(certLink).toBeVisible();
    await expect(certLink).toHaveAttribute('href', /\.pdf/);
  });
});
