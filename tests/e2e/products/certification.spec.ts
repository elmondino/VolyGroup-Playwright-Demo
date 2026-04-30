import { test, expect } from '../../../fixtures/base.fixture';
import { URLS, EXTERNAL_URLS } from '../../../fixtures/urls';

/**
 * Page-unique behavioural tests for Certification.
 * Health checks (title, heading, CTA, no-404) are covered by product-health.spec.ts.
 */
test.describe('Certification page - unique behaviours', () => {
  test.beforeEach(async ({ navigate }) => {
    await navigate(URLS.certification);
  });

  test('Enrol Now button is visible and links to the external LMS', async ({ page }) => {
    const enrolBtn = page.getByRole('link', { name: /enrol now/i }).first();
    await expect(enrolBtn).toBeVisible();
    await expect(enrolBtn).toHaveAttribute('href', new RegExp(EXTERNAL_URLS.enrolNow));
  });
});
