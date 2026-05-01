import { Page } from '@playwright/test';

function cookieConsentButton(page: Page, label: RegExp, className: string) {
  return page
    .getByRole('button', { name: label })
    .or(page.locator(className))
    .or(page.locator('button').filter({ hasText: label }))
    .or(page.locator('[role="button"]').filter({ hasText: label }))
    .or(page.locator('a').filter({ hasText: label }))
    .first();
}

/**
 * Accepts the Squarespace cookie consent banner on volygroup.com.
 * Uses multiple selector strategies to handle Squarespace's banner markup.
 * Silently no-ops if the banner is already dismissed or not present.
 */
export async function acceptCookies(page: Page): Promise<void> {
  const btn = cookieConsentButton(page, /^accept$/i, '.sqs-cookie-banner-v2-accept');

  try {
    if (await btn.isVisible({ timeout: 5_000 })) {
      await btn.click();
    }
  } catch {
    // Banner not present or already dismissed - proceed silently
  }
}

/**
 * Declines the Squarespace cookie consent banner on volygroup.com.
 */
export async function declineCookies(page: Page): Promise<void> {
  const btn = cookieConsentButton(page, /^decline$/i, '.sqs-cookie-banner-v2-decline');

  try {
    if (await btn.isVisible({ timeout: 5_000 })) {
      await btn.click();
    }
  } catch {
    // Banner not present or already dismissed - proceed silently
  }
}

/**
 * Returns true if the cookie consent banner is currently visible.
 */
export async function isCookieBannerVisible(page: Page): Promise<boolean> {
  try {
    return await cookieConsentButton(page, /^accept$/i, '.sqs-cookie-banner-v2-accept').isVisible({
      timeout: 3_000,
    });
  } catch {
    return false;
  }
}

/**
 * Accepts the cookie banner on secure.voly.co.uk (the login app).
 * That page uses a different consent provider (CookieHub) with a different button label.
 */
export async function acceptLoginAppCookies(page: Page): Promise<void> {
  const btn = page.getByRole('button', { name: /allow all cookies/i }).first();

  try {
    if (await btn.isVisible({ timeout: 5_000 })) {
      await btn.click();
    }
  } catch {
    // Banner not present or already dismissed - proceed silently
  }
}
