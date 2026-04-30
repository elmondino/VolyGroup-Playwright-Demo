import { test, expect } from '../../../fixtures/base.fixture';
import { acceptLoginAppCookies } from '../../../components/cookie-banner';
import { URLS, EXTERNAL_URLS } from '../../../fixtures/urls';

test.describe('Login page contract', () => {
  test('Log In button on volygroup.com opens the login app in a new tab @smoke', async ({
    page,
    navigate,
  }, testInfo) => {
    await navigate(URLS.home);

    const isMobile = (testInfo.project.use.viewport?.width ?? 1280) < 900;
    if (isMobile) {
      await page.getByRole('button', { name: /menu|navigation/i }).first().click();
    }

    const [loginTab] = await Promise.all([
      page.context().waitForEvent('page'),
      page.getByRole('link', { name: /log in/i }).first().click(),
    ]);

    await loginTab.waitForLoadState('domcontentloaded');
    expect(loginTab.url()).toContain(EXTERNAL_URLS.login);
    await loginTab.close();
  });

  test.describe('Login page at secure.voly.co.uk', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(EXTERNAL_URLS.login);
      await acceptLoginAppCookies(page);
    });

    test('login page loads and displays the main heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /login to your account/i }),
      ).toBeVisible();
    });

    test('login form contains email address field', async ({ page }) => {
      const emailField =
        page.getByLabel(/email address/i).or(page.locator('input[type="email"]')).first();
      await expect(emailField).toBeVisible();
    });

    test('login form contains password field', async ({ page }) => {
      const passwordField =
        page.getByLabel(/password/i).or(page.locator('input[type="password"]')).first();
      await expect(passwordField).toBeVisible();
    });

    test('login form has a submit button', async ({ page }) => {
      const submitBtn = page
        .getByRole('button', { name: /log in/i })
        .or(page.locator('input[type="submit"]'))
        .first();
      await expect(submitBtn).toBeVisible();
    });

    test('forgot password link is visible and points to the reset URL', async ({ page }) => {
      const forgotLink = page.getByRole('link', {
        name: /new user|forgotten.*password|forgot.*password/i,
      }).first();
      await expect(forgotLink).toBeVisible();
      await expect(forgotLink).toHaveAttribute('href', /flo\.php/);
    });

    test('submitting an empty form does not navigate away from the login page', async ({
      page,
    }) => {
      const submitBtn = page
        .getByRole('button', { name: /log in/i })
        .or(page.locator('input[type="submit"]'))
        .first();

      await submitBtn.click();

      // Should remain on the login page - HTML5 validation or server-side keeps us here
      await expect(page).toHaveURL(new RegExp(EXTERNAL_URLS.login));
    });

    test('entering an invalid email format shows a validation error on submit', async ({
      page,
    }) => {
      const emailField =
        page.getByLabel(/email address/i).or(page.locator('input[type="email"]')).first();
      const submitBtn = page
        .getByRole('button', { name: /log in/i })
        .or(page.locator('input[type="submit"]'))
        .first();

      await emailField.fill('not-a-valid-email');
      await submitBtn.click();

      // The browser's HTML5 email validation or the app's own validation rejects the input
      const isInvalid = await emailField.evaluate(
        (el) => !(el as HTMLInputElement).validity.valid,
      );
      expect(isInvalid).toBe(true);
    });
  });
});
