/**
 * Free Voly APA signup form tests.
 *
 * Form is the standard HubSpot embed. Submission gated to dev/staging.
 */
import { test, expect } from '../../../fixtures/base.fixture';
import {
  fillDemoForm,
  hubspotForm,
  isFieldInvalid,
  submitForm,
} from '../../../components/demo-form';
import { validDemoForm } from '../../../fixtures/form-data';
import { URLS } from '../../../fixtures/urls';
import { isSubmitEnabled, SUBMIT_SKIP_REASON } from '../../../utils/env';

test.describe('Free Voly APA signup form (/free-voly-apa)', () => {
  test.beforeEach(async ({ navigate }) => {
    await navigate(URLS.freeVolyApa);
  });

  test('page loads with a heading', async ({ page }) => {
    await expect(
      page
        .getByRole('heading', { name: /free voly apa|book a demo|get started/i })
        .first(),
    ).toBeVisible();
  });

  test('page references the free APA offer or financial management content', async ({ page }) => {
    await expect(page.locator('body')).toContainText(
      /free.*charge|new voly apa clients|financial management|apa/i,
    );
  });

  test('required form fields are present in the HubSpot iframe', async ({ page }) => {
    const f = await hubspotForm(page);
    await expect(f.getByLabel(/^first name/i)).toBeVisible();
    await expect(f.getByLabel(/^last name/i)).toBeVisible();
    await expect(f.getByLabel(/^email/i)).toBeVisible();
    await expect(f.getByLabel(/^mobile phone number/i)).toBeVisible();
  });

  test('privacy or GDPR statement appears on the page', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/privacy|gdpr|protecting/i);
  });

  test('submit button is visible inside the form', async ({ page }) => {
    const f = await hubspotForm(page);
    await expect(f.locator('input[type="submit"], button[type="submit"]').first()).toBeVisible();
  });

  test('filling required fields sets a valid email state', async ({ page }) => {
    await fillDemoForm(page, validDemoForm);
    expect(await isFieldInvalid(page, 'Email')).toBe(false);
  });

  test('submitting with empty required fields keeps user on the same page', async ({ page }) => {
    const f = await hubspotForm(page);
    await f.locator('input[type="submit"], button[type="submit"]').first().click();
    await expect(page).toHaveURL(/free-voly-apa|book-a-demo/);
  });

  test('form submission @submit-only-dev-staging', async ({ page }) => {
    test.skip(!isSubmitEnabled(), SUBMIT_SKIP_REASON);
    await fillDemoForm(page, validDemoForm);
    await submitForm(page);
    const f = await hubspotForm(page);
    await expect(f.getByText(/thank you|success|submitted/i)).toBeVisible({ timeout: 15_000 });
  });
});
