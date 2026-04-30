import { test, expect } from '../../fixtures/base.fixture';
import { URLS } from '../../fixtures/urls';

/**
 * SEO tests verify that every key page has the essential meta tags and
 * structured data needed for search engine indexing and social sharing.
 * A missing or empty title/description is a direct conversion risk.
 *
 * Pages where meta descriptions are currently absent on the live site are
 * marked test.fixme() so they appear as known gaps in the report rather
 * than silently passing. These should be removed as the content team fixes
 * each page.
 */

/** Pages confirmed to be missing a meta description on the live site. */
const KNOWN_MISSING_META_DESCRIPTION: readonly string[] = [
  URLS.volyFeatures,
  URLS.captainsAndCrew,
  URLS.familyOffices,
  URLS.managementCompany,
  URLS.superyachtOwner,
];

const ALL_PAGES = [
  { name: 'Home', path: URLS.home },
  { name: 'Yacht Accounting', path: URLS.yachtAccounting },
  { name: 'APA Management', path: URLS.apaManagement },
  { name: 'Voly Features', path: URLS.volyFeatures },
  { name: 'Multi-Asset Management', path: URLS.multiAssetManagement },
  { name: 'Security', path: URLS.security },
  { name: 'Family Office', path: URLS.familyOffice },
  { name: 'Prepaid Card', path: URLS.prepaidCard },
  { name: 'Certification', path: URLS.certification },
  { name: 'Captains and Crew', path: URLS.captainsAndCrew },
  { name: 'Family Offices', path: URLS.familyOffices },
  { name: 'Management Company', path: URLS.managementCompany },
  { name: 'Superyacht Owner', path: URLS.superyachtOwner },
  { name: 'Book a Demo', path: URLS.bookADemo },
  { name: 'News', path: URLS.news },
  { name: 'Legal', path: URLS.legal },
  { name: 'GDPR', path: URLS.gdpr },
] as const;

for (const pageDef of ALL_PAGES) {
  test.describe(`SEO - ${pageDef.name} (${pageDef.path})`, () => {
    test.beforeEach(async ({ navigate }) => {
      await navigate(pageDef.path);
    });

    test('page title is set and non-empty', async ({ page }) => {
      const title = await page.title();
      expect(title.trim().length).toBeGreaterThan(0);
    });

    test('meta description is set and non-empty', async ({ page }) => {
      // Known gaps on the live site - flagged as fixme so they show up clearly
      // in the report. Remove each entry when the marketing team fixes the page.
      test.fixme(
        KNOWN_MISSING_META_DESCRIPTION.includes(pageDef.path),
        `Meta description is missing on ${pageDef.path} - known issue, tracked for fix by Voly marketing team`,
      );

      const description = (
        await page.locator('meta[name="description"]').getAttribute('content')
      )?.trim();

      expect(
        description?.length ?? 0,
        `${pageDef.name}: meta description must be present and non-empty`,
      ).toBeGreaterThan(0);
    });
  });
}

test.describe('SEO - Open Graph tags on the Home page', () => {
  test.beforeEach(async ({ navigate }) => {
    await navigate(URLS.home);
  });

  test('og:title is set', async ({ page }) => {
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute('content');
    expect(ogTitle?.trim().length).toBeGreaterThan(0);
  });

  test('og:description is set', async ({ page }) => {
    const ogDesc = await page
      .locator('meta[property="og:description"]')
      .getAttribute('content');
    expect(ogDesc?.trim().length).toBeGreaterThan(0);
  });

  test('og:image is set', async ({ page }) => {
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute('content');
    expect(ogImage?.trim().length).toBeGreaterThan(0);
  });
});

test.describe('SEO - Page titles are unique across key pages', () => {
  test('home and yacht accounting pages have different titles', async ({ page, navigate }) => {
    await navigate(URLS.home);
    const homeTitle = await page.title();

    await navigate(URLS.yachtAccounting);
    const yachtTitle = await page.title();

    expect(homeTitle).not.toBe(yachtTitle);
  });

  test('home and book-a-demo pages have different titles', async ({ page, navigate }) => {
    await navigate(URLS.home);
    const homeTitle = await page.title();

    await navigate(URLS.bookADemo);
    const demoTitle = await page.title();

    expect(homeTitle).not.toBe(demoTitle);
  });
});
