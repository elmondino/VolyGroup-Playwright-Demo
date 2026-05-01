import { test as base, expect } from '@playwright/test';
import { acceptCookies } from '../components/cookie-banner';

const FIRST_PARTY_ORIGINS = ['volygroup.com', 'secure.voly.co.uk'];

type BrowserIssue = {
  source: 'console.error' | 'pageerror' | 'requestfailed';
  message: string;
  url: string;
  firstParty: boolean;
};

function isFirstPartyUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return FIRST_PARTY_ORIGINS.some(
      (origin) => hostname === origin || hostname.endsWith(`.${origin}`),
    );
  } catch {
    return false;
  }
}

function formatIssue(issue: BrowserIssue): string {
  const ownership = issue.firstParty ? 'first-party' : 'third-party';
  return `[${issue.source}][${ownership}] ${issue.url} ${issue.message}`;
}

type VolyFixtures = {
  /**
   * Navigates to a path relative to baseURL and automatically accepts
   * the Voly cookie consent banner. Use this in all tests except those
   * specifically testing cookie consent behaviour (those should use
   * page.goto directly to observe the banner in its natural state).
   */
  navigate: (path: string) => Promise<void>;

  /**
   * Browser console errors, page errors, and failed first-party requests
   * collected during the test. Populated automatically for every test and
   * attached to the report when any issue is found.
   */
  browserIssues: BrowserIssue[];
};

export const test = base.extend<VolyFixtures>({
  browserIssues: [
    async ({ page }, use, testInfo) => {
      const issues: BrowserIssue[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const url = msg.location().url || page.url();
          issues.push({
            source: 'console.error',
            message: msg.text(),
            url,
            firstParty: isFirstPartyUrl(url),
          });
        }
      });

      page.on('pageerror', (error) => {
        const url = page.url();
        issues.push({
          source: 'pageerror',
          message: error.message,
          url,
          firstParty: isFirstPartyUrl(url),
        });
      });

      page.on('requestfailed', (req) => {
        const url = req.url();
        if (isFirstPartyUrl(url)) {
          const failure = req.failure()?.errorText ?? 'request failed';
          issues.push({
            source: 'requestfailed',
            message: `${req.method()} ${failure}`,
            url,
            firstParty: true,
          });
        }
      });

      await use(issues);

      if (issues.length > 0) {
        await testInfo.attach('browser-errors.txt', {
          body: issues.map(formatIssue).join('\n'),
          contentType: 'text/plain',
        });
      }
    },
    { auto: true },
  ],

  navigate: async ({ page }, use) => {
    await use(async (path: string) => {
      // Live marketing pages can keep the load event open on third-party media.
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await acceptCookies(page);
    });
  },
});

export { expect };
export type { BrowserIssue };
