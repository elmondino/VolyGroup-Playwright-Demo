import { test, expect } from '../../../fixtures/base.fixture';
import { URLS } from '../../../fixtures/urls';
import { hubspotForm, fillDemoForm } from '../../../components/demo-form';
import { acceptCookies } from '../../../components/cookie-banner';
import type { Frame, Locator, Page } from '@playwright/test';

/**
 * Form submission contract tests using pre-submit payload capture.
 *
 * These tests intercept the iframe form submit event before the network layer so they:
 *   - Run in ALL environments (no @submit-only-dev-staging gate needed).
 *   - Never create real CRM entries or marketing-database noise.
 *   - Prove the form serialises the expected field names and values.
 *
 * If this test fails it means the form fields were renamed, removed, or the
 * submit payload shape changed - a breaking integration change worth catching.
 */

async function selectOptionContainingText(select: Locator, visibleText: string): Promise<void> {
  await select.evaluate((element, text) => {
    const selectElement = element as HTMLSelectElement;
    const option = Array.from(selectElement.options).find((candidate) =>
      candidate.textContent?.toLowerCase().includes(text.toLowerCase()),
    );

    if (!option) {
      throw new Error(`No option containing "${text}" was found`);
    }

    selectElement.value = option.value;
    selectElement.dispatchEvent(new Event('input', { bubbles: true }));
    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
  }, visibleText);
}

async function getHubSpotContentFrame(page: Page): Promise<Frame> {
  const iframe = page.locator('iframe[id^="hs-form-iframe"]').first();
  await iframe.waitFor({ state: 'attached', timeout: 20_000 });

  const handle = await iframe.elementHandle();
  const frame = await handle?.contentFrame();
  if (!frame) {
    throw new Error('HubSpot iframe content frame was not available');
  }

  return frame;
}

async function captureSubmitPayload(frame: Frame): Promise<void> {
  await frame.evaluate(() => {
    const win = window as Window & {
      __capturedHubSpotPayload?: Record<string, string> | null;
    };
    const form = document.querySelector('form');

    if (!form) {
      throw new Error('HubSpot form element was not available');
    }

    win.__capturedHubSpotPayload = null;
    form.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const payload: Record<string, string> = {};
        const data = new FormData(form);
        data.forEach((value, key) => {
          payload[key] = String(value);
        });

        win.__capturedHubSpotPayload = payload;
      },
      { capture: true, once: true },
    );
  });
}

async function getCapturedPayload(frame: Frame): Promise<Record<string, string> | null> {
  return frame.evaluate(() => {
    const win = window as Window & {
      __capturedHubSpotPayload?: Record<string, string> | null;
    };
    return win.__capturedHubSpotPayload ?? null;
  });
}

test.describe('HubSpot form submission contract', () => {
  test(
    'Book a Demo form serialises correctly shaped field data before submit @smoke',
    async ({ page }) => {
      await page.goto(URLS.bookADemo, { waitUntil: 'domcontentloaded' });
      await acceptCookies(page);

      const frame = await getHubSpotContentFrame(page);
      const form = await hubspotForm(page);
      await captureSubmitPayload(frame);

      await fillDemoForm(page, {
        firstName: 'Contract',
        lastName: 'Test',
        email: 'contract.test@example-playwright.com',
        phone: '7700900000',
      });

      await selectOptionContainingText(form.locator('select[id^="phone_ext"]').first(), 'United Kingdom');
      await form.getByLabel(/^how did you hear about us/i).selectOption({ label: 'LinkedIn' });

      const consent = form.locator('input[type="checkbox"]').first();
      if ((await consent.count()) > 0) {
        await consent.evaluate((element) => {
          const checkbox = element as HTMLInputElement;
          checkbox.checked = true;
          checkbox.dispatchEvent(new Event('input', { bubbles: true }));
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }

      await form.locator('input[type="submit"], button[type="submit"]').first().click();

      await expect
        .poll(() => getCapturedPayload(frame), { timeout: 5_000 })
        .not.toBeNull();

      const payload = await getCapturedPayload(frame);
      expect(payload?.firstname).toBe('Contract');
      expect(payload?.lastname).toBe('Test');
      expect(payload?.email).toBe('contract.test@example-playwright.com');
      expect(payload?.phone).toContain('7700900000');
      expect(payload?.how_did_you_hear_about_us_).toBe('LinkedIn');
      expect(payload?.['LEGAL_CONSENT.subscription_type_260629382']).toBe('true');
    },
  );
});
