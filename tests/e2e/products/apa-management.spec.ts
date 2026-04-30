import { test, expect } from '../../../fixtures/base.fixture';
import { URLS } from '../../../fixtures/urls';

/**
 * Page-unique behavioural tests for APA Management.
 * Health checks (title, heading, CTA, no-404) are covered by product-health.spec.ts.
 */
test.describe('APA Management page - unique behaviours', () => {
  test.beforeEach(async ({ navigate }) => {
    await navigate(URLS.apaManagement);
  });

  test('Sign up now CTA links to the free APA sign-up page', async ({ page }) => {
    const cta = page.getByRole('link', { name: /sign up now/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /free-voly-apa/);
  });

  test('captain testimonial is attributed to Ian Jinks', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/captain ian jinks|ian jinks/i);
  });
});
