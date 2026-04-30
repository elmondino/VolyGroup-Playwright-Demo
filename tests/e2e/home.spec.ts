import { test, expect } from '../../fixtures/base.fixture';
import { URLS, EXTERNAL_URLS } from '../../fixtures/urls';

test.describe('Home page', () => {
  test('has correct page title @smoke', async ({ page, navigate }) => {
    await navigate(URLS.home);
    await expect(page).toHaveTitle(/voly/i);
  });

  test('displays hero section with main heading @smoke', async ({ page, navigate }) => {
    await navigate(URLS.home);
    await expect(page.getByRole('heading', { name: /one team/i })).toBeVisible();
  });

  test('hero section has a working Get in Touch CTA @smoke', async ({ page, navigate }) => {
    await navigate(URLS.home);
    const cta = page.getByRole('link', { name: /get in touch/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /book-a-demo/);
  });

  test('Log In button is visible in the header @smoke', async ({ page, navigate }) => {
    await navigate(URLS.home);
    const loginLink = page.getByRole('link', { name: /log in/i });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', new RegExp(EXTERNAL_URLS.login));
  });

  test('displays all nine product feature links', async ({ page, navigate }) => {
    await navigate(URLS.home);

    const expectedLinks = [
      { name: /yacht accounting/i },
      { name: /apa management/i },
      { name: /voly features/i },
      { name: /multi-asset management/i },
      { name: /treasury management/i },
      { name: /security/i },
      { name: /family office/i },
      { name: /voly prepaid card/i },
      { name: /voly certification/i },
    ];

    for (const link of expectedLinks) {
      await expect(page.getByRole('link', { name: link.name }).first()).toBeVisible();
    }
  });

  test('displays audience section with four audience links', async ({ page, navigate }) => {
    await navigate(URLS.home);

    const audienceLinks = [
      /captains.*crew/i,
      /family offices/i,
      /management companies/i,
      /owners/i,
    ];

    for (const name of audienceLinks) {
      await expect(page.getByRole('link', { name }).first()).toBeVisible();
    }
  });

  test('news section displays at least one article', async ({ page, navigate }) => {
    await navigate(URLS.home);
    const newsSection = page.getByRole('heading', { name: /voly news/i });
    await expect(newsSection).toBeVisible();
    const readMoreLinks = page.getByRole('link', { name: /read more/i });
    await expect(readMoreLinks.first()).toBeVisible();
  });

  test('footer is present with company address', async ({ page, navigate }) => {
    await navigate(URLS.home);
    await expect(page.getByText(/voly limited/i)).toBeVisible();
    await expect(page.getByText(/cheadle/i)).toBeVisible();
  });
});
