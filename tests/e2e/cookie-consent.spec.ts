/**
 * Cookie consent tests.
 *
 * These tests intentionally use page.goto directly (not the navigate fixture)
 * so the banner is observed in its natural state before any interaction.
 */
import { test, expect } from '@playwright/test';
import {
  acceptCookies,
  declineCookies,
  isCookieBannerVisible,
} from '../../components/cookie-banner';

test.describe('Cookie consent banner @cookie', () => {
  test('banner is visible on first visit before any interaction', async ({ page }) => {
    await page.goto('/');
    const visible = await isCookieBannerVisible(page);
    expect(visible).toBe(true);
  });

  test('banner disappears after clicking Accept', async ({ page }) => {
    await page.goto('/');
    await acceptCookies(page);
    const visible = await isCookieBannerVisible(page);
    expect(visible).toBe(false);
  });

  test('banner disappears after clicking Decline', async ({ page }) => {
    await page.goto('/');
    await declineCookies(page);
    const visible = await isCookieBannerVisible(page);
    expect(visible).toBe(false);
  });

  test('banner does not reappear when navigating to a second page after Accept', async ({
    page,
  }) => {
    await page.goto('/');
    await acceptCookies(page);

    await page.goto('/yacht-accounting');
    const visible = await isCookieBannerVisible(page);
    expect(visible).toBe(false);
  });

  test('banner does not reappear when navigating to a second page after Decline', async ({
    page,
  }) => {
    await page.goto('/');
    await declineCookies(page);

    await page.goto('/book-a-demo');
    const visible = await isCookieBannerVisible(page);
    expect(visible).toBe(false);
  });

  test('Accept and Decline buttons are both visible on the banner', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /^accept$/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /^decline$/i }).first()).toBeVisible();
  });

  test('banner contains the expected consent message text', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/by using this website/i)).toBeVisible();
  });
});
