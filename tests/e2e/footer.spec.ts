import { test, expect } from '../../fixtures/base.fixture';
import { URLS, EXTERNAL_URLS } from '../../fixtures/urls';

test.describe('Footer', () => {
  test.beforeEach(async ({ navigate }) => {
    await navigate(URLS.home);
  });

  test('displays company name and address', async ({ page }) => {
    await expect(page.getByText(/voly limited/i)).toBeVisible();
    await expect(page.getByText(/cheadle royal business park/i)).toBeVisible();
    await expect(page.getByText(/sk8 3td/i)).toBeVisible();
  });

  test('displays contact email link', async ({ page }) => {
    const emailLink = page.getByRole('link', { name: /hello@voly\.co\.uk/i });
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', 'mailto:hello@voly.co.uk');
  });

  test('displays contact phone link', async ({ page }) => {
    const phoneLink = page.getByRole('link', { name: /3300 536373/ });
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute('href', /tel:/);
  });

  test.describe('Our Companies links', () => {
    test('has Voly Crew Solutions link pointing to voyonic.com', async ({ page }) => {
      const link = page.getByRole('link', { name: /voly crew solutions/i });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', new RegExp(EXTERNAL_URLS.voyonic));
    });

    test('has Pinpoint Works link pointing to pinpointworks.com', async ({ page }) => {
      const link = page.getByRole('link', { name: /pinpoint works/i });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', new RegExp(EXTERNAL_URLS.pinpointWorks));
    });

    test('has Voly Entertainment link pointing to volyentertainment.com', async ({ page }) => {
      const link = page.getByRole('link', { name: /voly entertainment/i });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', new RegExp(EXTERNAL_URLS.volyEntertainment));
    });
  });

  test.describe('Social media links', () => {
    const socialLinks: { name: RegExp; href: RegExp }[] = [
      { name: /instagram/i, href: /instagram\.com/ },
      { name: /facebook/i, href: /facebook\.com/ },
      { name: /linkedin/i, href: /linkedin\.com/ },
    ];

    for (const social of socialLinks) {
      test(`has ${social.name.source} link`, async ({ page }) => {
        const link = page.getByRole('link', { name: social.name }).first();
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', social.href);
      });
    }

    test('has X (Twitter) link', async ({ page }) => {
      const link = page.getByRole('link', { name: /^x$/i }).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', /x\.com/);
    });
  });

  test.describe('Legal and certification links', () => {
    test('has Legal page link', async ({ page }) => {
      const link = page.getByRole('link', { name: /^legal$/i });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', /\/legal\/?$/);
    });

    test('has GDPR Policy link', async ({ page }) => {
      const link = page.getByRole('link', { name: /gdpr policy/i });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', /\/gdpr\/?$/);
    });

    test('has ISO 27001 certification link', async ({ page }) => {
      const link = page.getByRole('link', { name: /27001/i }).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', /isoqsltd\.com/);
    });

    test('has Carbon Neutral certification PDF link', async ({ page }) => {
      const link = page.locator('a[href*="Carbon-Neutral"]');
      await expect(link.first()).toBeVisible();
      await expect(link.first()).toHaveAttribute('href', /\.pdf/);
    });
  });

  test('displays copyright text with current year range', async ({ page }) => {
    await expect(page.getByText(/2006.*2026/)).toBeVisible();
  });
});
