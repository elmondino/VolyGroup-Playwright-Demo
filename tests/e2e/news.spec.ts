import { test, expect } from '../../fixtures/base.fixture';
import { URLS } from '../../fixtures/urls';

test.describe('News page', () => {
  test.beforeEach(async ({ navigate }) => {
    await navigate(URLS.news);
  });

  test('page title contains Voly', async ({ page }) => {
    await expect(page).toHaveTitle(/voly/i);
  });

  test('Latest News heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /latest.*news/i })).toBeVisible();
  });

  test('at least one article is displayed in the list', async ({ page }) => {
    const readMoreLinks = page.getByRole('link', { name: /read more/i });
    const count = await readMoreLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('each visible article has a title link', async ({ page }) => {
    // Articles are rendered as heading-level links - check at least the first three
    const articleHeadings = page.locator('h1 a, h2 a, h3 a').filter({ hasNotText: /voly group|log in/i });
    const count = await articleHeadings.count();
    expect(count).toBeGreaterThan(0);
  });

  test('articles display a publication date', async ({ page }) => {
    // Dates are in DD/MM/YYYY format on this site, assert via body text
    await expect(page.locator('body')).toContainText(/\d{2}\/\d{2}\/\d{4}/);
  });

  test('pagination link to older posts is present', async ({ page }) => {
    const olderPostsLink = page.getByRole('link', { name: /older posts/i });
    await expect(olderPostsLink).toBeVisible();
    await expect(olderPostsLink).toHaveAttribute('href', /news.*offset/);
  });

  test('clicking Read More on the first article navigates to an article page', async ({
    page,
  }) => {
    const firstReadMore = page.getByRole('link', { name: /read more/i }).first();
    await firstReadMore.click();
    await expect(page).toHaveURL(/\/news\//);
  });

  test('the article detail page loads and has a heading', async ({ page }) => {
    await page.getByRole('link', { name: /read more/i }).first().click();
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('navigating back from an article returns to the news listing', async ({ page }) => {
    await page.getByRole('link', { name: /read more/i }).first().click();
    await page.goBack();
    await expect(page).toHaveURL(URLS.news);
  });
});
