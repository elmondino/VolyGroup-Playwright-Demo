import { test, expect, type BrowserIssue } from '../../fixtures/base.fixture';
import { URLS } from '../../fixtures/urls';

/**
 * Browser health checks for first-party JavaScript and network failures.
 *
 * The `browserIssues` fixture captures browser console errors, uncaught page
 * errors, and failed first-party requests for every test. This spec only fails
 * on first-party issues because third-party scripts are outside Voly's control.
 *
 * Third-party findings still attach to the report for visibility.
 */

const KEY_PAGES = [
  { name: 'Home', path: URLS.home },
  { name: 'Yacht Accounting', path: URLS.yachtAccounting },
  { name: 'Book a Demo', path: URLS.bookADemo },
  { name: 'News', path: URLS.news },
] as const;

function isActionableFirstPartyIssue(issue: BrowserIssue): boolean {
  if (!issue.firstParty) return false;

  const knownSquarespaceConsoleNoise =
    issue.source === 'console.error' &&
    issue.url.includes('/api/1/website-component-definitions') &&
    issue.message.includes('401');

  return !knownSquarespaceConsoleNoise;
}

for (const pageDef of KEY_PAGES) {
  test(
    `${pageDef.name} page has no first-party console errors or failed network requests`,
    async ({ navigate, browserIssues }) => {
      await navigate(pageDef.path);
      const firstPartyIssues = browserIssues.filter(isActionableFirstPartyIssue);

      expect(
        firstPartyIssues,
        `First-party browser issues on ${pageDef.name}:\n${firstPartyIssues
          .map((issue) => `${issue.source} ${issue.url} ${issue.message}`)
          .join('\n')}`,
      ).toHaveLength(0);
    },
  );
}
