import { test, expect } from '../../fixtures/base.fixture';
import { URLS } from '../../fixtures/urls';

test.describe('Legal pages', () => {
  test.describe('/legal', () => {
    test.beforeEach(async ({ navigate }) => {
      await navigate(URLS.legal);
    });

    test('page loads without server errors', async ({ page }) => {
      await expect(page.getByText(/404|page not found/i)).not.toBeVisible();
    });

    test('page title contains Voly', async ({ page }) => {
      await expect(page).toHaveTitle(/voly/i);
    });

    test('a heading is visible', async ({ page }) => {
      await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    });

    test('page contains legal content text', async ({ page }) => {
      await expect(page.locator('body')).toContainText(/terms|legal|conditions|policy/i);
    });
  });

  test.describe('/gdpr', () => {
    test.beforeEach(async ({ navigate }) => {
      await navigate(URLS.gdpr);
    });

    test('page loads without server errors', async ({ page }) => {
      await expect(page.getByText(/404|page not found/i)).not.toBeVisible();
    });

    test('page title contains Voly', async ({ page }) => {
      await expect(page).toHaveTitle(/voly/i);
    });

    test('a heading is visible', async ({ page }) => {
      await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    });

    test('GDPR content references data or privacy', async ({ page }) => {
      await expect(page.locator('body')).toContainText(/gdpr|data protection|personal data|privacy/i);
    });

  });
});
