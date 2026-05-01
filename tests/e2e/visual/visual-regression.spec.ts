import type { Locator, Page } from '@playwright/test';
import { test, expect } from '../../../fixtures/base.fixture';
import { URLS } from '../../../fixtures/urls';

const VISUAL_PAGES = [
  {
    name: 'Home',
    path: URLS.home,
    snapshot: 'home-first-viewport.png',
  },
  {
    name: 'Book a Demo',
    path: URLS.bookADemo,
    snapshot: 'book-a-demo-first-viewport.png',
  },
  {
    name: 'Yacht Accounting',
    path: URLS.yachtAccounting,
    snapshot: 'yacht-accounting-first-viewport.png',
  },
  {
    name: 'Captains and Crew',
    path: URLS.captainsAndCrew,
    snapshot: 'captains-and-crew-first-viewport.png',
  },
  {
    name: 'Security',
    path: URLS.security,
    snapshot: 'security-first-viewport.png',
  },
] as const;

async function stabiliseForVisualCheck(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }

      .sqs-cookie-banner-v2,
      [class*="sqs-cookie" i],
      [id*="sqs-cookie" i],
      [class*="cookie-banner" i],
      [id*="cookie-banner" i],
      [id*="zsiq" i],
      [class*="zsiq" i],
      [id*="salesiq" i],
      [class*="salesiq" i] {
        display: none !important;
        visibility: hidden !important;
      }
    `,
  });

  await page.evaluate(async () => {
    window.scrollTo(0, 0);

    await Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 2_000)),
    ]);
  });
}

function visualMasks(page: Page): Locator[] {
  return [
    page.locator('iframe'),
    page.locator('video'),
    page.locator('.sqs-cookie-banner-v2'),
    page.locator('[class*="sqs-cookie" i]'),
    page.locator('[id*="sqs-cookie" i]'),
    page.locator('[class*="cookie-banner" i]'),
    page.locator('[id*="cookie-banner" i]'),
    page.locator('.sqs-announcement-bar'),
    page.locator('[id*="hubspot" i]'),
    page.locator('[id*="hs-form" i]'),
    page.locator('[class*="newsletter" i]'),
    page.locator('[id*="zsiq" i]'),
    page.locator('[class*="zsiq" i]'),
    page.locator('[id*="salesiq" i]'),
    page.locator('[class*="salesiq" i]'),
  ];
}

test.describe('Stakeholder visual regression', () => {
  for (const pageDef of VISUAL_PAGES) {
    test(`${pageDef.name} first viewport matches the approved visual baseline @visual`, async ({
      page,
      navigate,
    }) => {
      await navigate(pageDef.path);
      await stabiliseForVisualCheck(page);

      await expect(page).toHaveScreenshot(pageDef.snapshot, {
        animations: 'disabled',
        caret: 'hide',
        mask: visualMasks(page),
      });
    });
  }
});