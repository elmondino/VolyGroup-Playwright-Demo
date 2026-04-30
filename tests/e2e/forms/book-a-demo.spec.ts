/**
 * Book a Demo form tests.
 *
 * Form is an embedded HubSpot iframe. All field assertions target the
 * iframe via FrameLocator. Actual submission is gated to dev/staging
 * via TEST_ENV to keep test data out of the production CRM.
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

test.describe('Book a Demo form (/book-a-demo)', () => {
  test.beforeEach(async ({ navigate }) => {
    await navigate(URLS.bookADemo);
  });

  test('page loads with the correct heading @smoke', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /book a demo|get started/i }).first(),
    ).toBeVisible();
  });

  test('form section heading is visible', async ({ page }) => {
    await expect(page.locator('body')).toContainText(
      /world class financial management for superyachts/i,
    );
  });

  test('all required form fields are present', async ({ page }) => {
    const f = await hubspotForm(page);
    await expect(f.getByLabel(/^first name/i)).toBeVisible();
    await expect(f.getByLabel(/^last name/i)).toBeVisible();
    await expect(f.getByLabel(/^email/i)).toBeVisible();
    await expect(f.getByLabel(/^mobile phone number/i)).toBeVisible();
  });

  test('optional message field is present', async ({ page }) => {
    const f = await hubspotForm(page);
    await expect(f.getByLabel(/^message/i)).toBeVisible();
  });

  test('required fields carry the required attribute', async ({ page }) => {
    const f = await hubspotForm(page);
    await expect(f.getByLabel(/^first name/i)).toHaveAttribute('required', '');
    await expect(f.getByLabel(/^last name/i)).toHaveAttribute('required', '');
    await expect(f.getByLabel(/^email/i)).toHaveAttribute('required', '');
  });

  test('GDPR privacy policy reference is on the page', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/privacy|gdpr/i);
  });

  test('marketing consent checkbox text is present in the form', async ({ page }) => {
    const f = await hubspotForm(page);
    await expect(
      f.getByText(/agree to receive|news.*marketing|marketing.*communication/i).first(),
    ).toBeVisible();
  });

  test('submit button is visible inside the form', async ({ page }) => {
    const f = await hubspotForm(page);
    await expect(f.locator('input[type="submit"], button[type="submit"]').first()).toBeVisible();
  });

  test('filling required fields with valid data sets a valid email state', async ({ page }) => {
    await fillDemoForm(page, validDemoForm);
    expect(await isFieldInvalid(page, 'Email')).toBe(false);
  });

  test('email field rejects malformed email addresses', async ({ page }) => {
    const f = await hubspotForm(page);
    const email = f.getByLabel(/^email/i);
    await email.fill('not-an-email');
    await email.blur();
    expect(await isFieldInvalid(page, 'Email')).toBe(true);
  });

  test('submitting with empty required fields keeps user on the form page', async ({ page }) => {
    const f = await hubspotForm(page);
    await f.locator('input[type="submit"], button[type="submit"]').first().click();
    await expect(page).toHaveURL(/book-a-demo/);
  });

  test('form submission @submit-only-dev-staging', async ({ page }) => {
    test.skip(!isSubmitEnabled(), SUBMIT_SKIP_REASON);
    await fillDemoForm(page, validDemoForm);
    await submitForm(page);
    const f = await hubspotForm(page);
    await expect(f.getByText(/thank you|success|submitted/i)).toBeVisible({ timeout: 15_000 });
  });
});
