import { test, expect } from '../../../fixtures/base.fixture';
import { URLS, EXTERNAL_URLS } from '../../../fixtures/urls';

/**
 * Page-unique behavioural tests for Voly Features.
 * Health checks (title, heading, CTA, no-404) are covered by product-health.spec.ts.
 */
test.describe('Voly Features page - unique behaviours', () => {
  test.beforeEach(async ({ navigate }) => {
    await navigate(URLS.volyFeatures);
  });

  test('Apple App Store link is present with the correct app ID', async ({ page }) => {
    const appleLink = page.locator(`a[href="${EXTERNAL_URLS.appleAppStore}"]`).first();
    await expect(appleLink).toHaveCount(1);
  });

  test('Google Play Store link is present', async ({ page }) => {
    const googleLink = page.locator('a[href*="play.google.com"]').first();
    await expect(googleLink).toHaveCount(1);
  });
});
