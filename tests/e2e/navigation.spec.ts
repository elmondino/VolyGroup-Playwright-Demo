import { test, expect } from '../../fixtures/base.fixture';
import { URLS, EXTERNAL_URLS } from '../../fixtures/urls';

test.describe('Navigation', () => {
  test.describe('Product links from home page features section', () => {
    const productPages: { name: RegExp; url: string }[] = [
      { name: /yacht accounting/i, url: URLS.yachtAccounting },
      { name: /apa management/i, url: URLS.apaManagement },
      { name: /voly features/i, url: URLS.volyFeatures },
      { name: /multi-asset management/i, url: URLS.multiAssetManagement },
      { name: /treasury management/i, url: URLS.treasuryManagement },
      { name: /security/i, url: URLS.security },
      { name: /family office/i, url: URLS.familyOffice },
      { name: /voly prepaid card/i, url: URLS.prepaidCard },
      { name: /voly certification/i, url: URLS.certification },
    ];

    for (const product of productPages) {
      test(`clicking "${product.name.source}" navigates to ${product.url}`, async ({
        page,
        navigate,
      }) => {
        await navigate(URLS.home);
        await page.getByRole('link', { name: product.name }).first().click();
        await expect(page).toHaveURL(new RegExp(product.url));
      });
    }
  });

  test.describe('Audience links from home page', () => {
    const audiencePages: { name: RegExp; url: string }[] = [
      { name: /captains.*crew/i, url: URLS.captainsAndCrew },
      { name: /family offices/i, url: URLS.familyOffices },
      { name: /management companies/i, url: URLS.managementCompany },
      { name: /owners/i, url: URLS.superyachtOwner },
    ];

    for (const audience of audiencePages) {
      test(`clicking "${audience.name.source}" navigates to ${audience.url}`, async ({
        page,
        navigate,
      }) => {
        await navigate(URLS.home);
        await page.getByRole('link', { name: audience.name }).first().click();
        await expect(page).toHaveURL(new RegExp(audience.url));
      });
    }
  });

  test('Voly Group logo navigates back to home page', async ({ page, navigate }) => {
    await navigate(URLS.yachtAccounting);
    await page.getByRole('link', { name: /voly group/i }).first().click();
    await expect(page).toHaveURL('/');
  });

  test('Log In button opens secure.voly.co.uk in a new tab', async ({ page, navigate }) => {
    await navigate(URLS.home);

    const [newTab] = await Promise.all([
      page.context().waitForEvent('page'),
      page.getByRole('link', { name: /log in/i }).click(),
    ]);

    await newTab.waitForLoadState('domcontentloaded');
    expect(newTab.url()).toContain(EXTERNAL_URLS.login);
    await newTab.close();
  });

  test('Book a Demo CTA from a product page navigates to the demo form', async ({
    page,
    navigate,
  }) => {
    await navigate(URLS.yachtAccounting);
    await page.locator('a[href*="book-a-demo"]').first().click();
    await expect(page).toHaveURL(/book-a-demo/);
  });

  test('Get in Touch CTA from a product page navigates to the demo form', async ({
    page,
    navigate,
  }) => {
    await navigate(URLS.multiAssetManagement);
    await page.getByRole('link', { name: /get in touch/i }).first().click();
    await expect(page).toHaveURL(/book-a-demo/);
  });

  test('News link in footer navigates to the news page', async ({ page, navigate }) => {
    await navigate(URLS.home);
    await page.getByRole('link', { name: /^news$/i }).first().click();
    await expect(page).toHaveURL(URLS.news);
  });

  test('Legal link in footer navigates to the legal page', async ({ page, navigate }) => {
    await navigate(URLS.home);
    await page.getByRole('link', { name: /^legal$/i }).click();
    await expect(page).toHaveURL(URLS.legal);
  });

  test('GDPR Policy link in footer navigates to the GDPR page', async ({ page, navigate }) => {
    await navigate(URLS.home);
    // Use href-based selector - more resilient than role/name in headless CI
    await page.locator('a[href*="/gdpr"]').first().click();
    await expect(page).toHaveURL(URLS.gdpr);
  });
});
