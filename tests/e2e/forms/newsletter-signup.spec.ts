/**
 * Newsletter signup form tests.
 *
 * Note: at the time of writing, the live /newsletter-signup page redirects to
 * the same Book a Demo HubSpot embed. We assert the HubSpot form is present
 * and the required newsletter fields render correctly inside the iframe.
 */
import { test, expect } from '../../../fixtures/base.fixture';
import {
  fillNewsletterForm,
  hubspotForm,
  isFieldInvalid,
  submitForm,
} from '../../../components/demo-form';
import { validNewsletterForm } from '../../../fixtures/form-data';
import { URLS } from '../../../fixtures/urls';
import { isSubmitEnabled, SUBMIT_SKIP_REASON } from '../../../utils/env';

test.describe('Newsletter signup form (/newsletter-signup)', () => {
  test.beforeEach(async ({ navigate }) => {
    await navigate(URLS.newsletterSignup);
  });

  test('page loads with a heading', async ({ page }) => {
    await expect(
      page
        .getByRole('heading', { name: /sign up.*voly news|newsletter|book a demo|get started/i })
        .first(),
    ).toBeVisible();
  });

  test('required form fields are present in the HubSpot iframe', async ({ page }) => {
    const f = await hubspotForm(page);
    await expect(f.getByLabel(/^first name/i)).toBeVisible();
    await expect(f.getByLabel(/^last name/i)).toBeVisible();
    await expect(f.getByLabel(/^email/i)).toBeVisible();
  });

  test('required fields carry the required attribute', async ({ page }) => {
    const f = await hubspotForm(page);
    await expect(f.getByLabel(/^first name/i)).toHaveAttribute('required', '');
    await expect(f.getByLabel(/^last name/i)).toHaveAttribute('required', '');
    await expect(f.getByLabel(/^email/i)).toHaveAttribute('required', '');
  });

  test('privacy or GDPR statement appears on the page', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/privacy|gdpr|protecting/i);
  });

  test('marketing consent text appears inside the form', async ({ page }) => {
    const f = await hubspotForm(page);
    await expect(
      f.getByText(/agree to receive|marketing communication|news.*marketing/i).first(),
    ).toBeVisible();
  });

  test('submit button is visible inside the form', async ({ page }) => {
    const f = await hubspotForm(page);
    await expect(f.locator('input[type="submit"], button[type="submit"]').first()).toBeVisible();
  });

  test('filling fields with valid data sets a valid email state', async ({ page }) => {
    await fillNewsletterForm(page, validNewsletterForm);
    expect(await isFieldInvalid(page, 'Email')).toBe(false);
  });

  test('submitting with empty required fields keeps user on the same page', async ({ page }) => {
    const f = await hubspotForm(page);
    await f.locator('input[type="submit"], button[type="submit"]').first().click();
    await expect(page).toHaveURL(/newsletter-signup|book-a-demo/);
  });

  test('form submission @submit-only-dev-staging', async ({ page }) => {
    test.skip(!isSubmitEnabled(), SUBMIT_SKIP_REASON);
    await fillNewsletterForm(page, validNewsletterForm);
    await submitForm(page);
    const f = await hubspotForm(page);
    await expect(f.getByText(/thank you|success|submitted/i)).toBeVisible({ timeout: 15_000 });
  });
});
