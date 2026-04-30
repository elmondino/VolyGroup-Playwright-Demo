import { FrameLocator, Page } from '@playwright/test';
import { DemoFormData, NewsletterFormData } from '../fixtures/form-data';

/**
 * All Voly Group lead-capture forms (Book a Demo, Newsletter, Free APA)
 * are embedded HubSpot v2 forms rendered inside an iframe.
 * Portal: 139785675 (region eu1). Iframe id: hs-form-iframe-0.
 */
const HS_IFRAME = 'iframe[id^="hs-form-iframe"]';

/**
 * Returns a FrameLocator scoped to the HubSpot embedded form iframe.
 * Waits for the iframe element to attach before returning.
 */
export async function hubspotForm(page: Page): Promise<FrameLocator> {
  await page.locator(HS_IFRAME).first().waitFor({ state: 'attached', timeout: 20_000 });
  return page.frameLocator(HS_IFRAME).first();
}

export async function fillDemoForm(page: Page, data: DemoFormData): Promise<void> {
  const f = await hubspotForm(page);
  await f.getByLabel(/^first name/i).fill(data.firstName);
  await f.getByLabel(/^last name/i).fill(data.lastName);
  await f.getByLabel(/^email/i).fill(data.email);
  await f.getByLabel(/^mobile phone number/i).fill(data.phone);
  if (data.message) {
    await f.getByLabel(/^message/i).fill(data.message);
  }
}

export async function fillNewsletterForm(page: Page, data: NewsletterFormData): Promise<void> {
  const f = await hubspotForm(page);
  await f.getByLabel(/^first name/i).fill(data.firstName);
  await f.getByLabel(/^last name/i).fill(data.lastName);
  await f.getByLabel(/^email/i).fill(data.email);
}

export async function submitForm(page: Page): Promise<void> {
  const f = await hubspotForm(page);
  await f.locator('input[type="submit"], button[type="submit"]').first().click();
}

export async function isFieldInvalid(page: Page, label: string): Promise<boolean> {
  const f = await hubspotForm(page);
  const input = f.getByLabel(new RegExp(`^${label}`, 'i'));
  return input.evaluate((el: any) => !el.validity.valid) as Promise<boolean>;
}
