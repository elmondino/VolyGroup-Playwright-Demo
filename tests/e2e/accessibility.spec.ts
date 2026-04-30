import { test, expect } from '../../fixtures/base.fixture';
import { URLS } from '../../fixtures/urls';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility audit against the live volygroup.com using axe-core,
 * targeting WCAG 2.1 AA.
 *
 * Policy enforced here:
 *  - Critical violations FAIL the test (showstopper accessibility bugs).
 *  - Serious / moderate / minor violations are attached to the report for
 *    the team to action, but do not break the build - these often involve
 *    third-party content or design system decisions outside QA's control.
 *
 * Third-party iframes (HubSpot, analytics) are excluded from scans because
 * we do not own their markup and cannot fix their violations.
 */

const KEY_PAGES = [
  { name: 'Home', path: URLS.home, excludeIframe: false },
  { name: 'Book a Demo', path: URLS.bookADemo, excludeIframe: true },
  { name: 'Yacht Accounting', path: URLS.yachtAccounting, excludeIframe: false },
  { name: 'APA Management', path: URLS.apaManagement, excludeIframe: false },
  { name: 'Security', path: URLS.security, excludeIframe: false },
  { name: 'Certification', path: URLS.certification, excludeIframe: false },
  { name: 'Captains and Crew', path: URLS.captainsAndCrew, excludeIframe: false },
  { name: 'News', path: URLS.news, excludeIframe: false },
] as const;

for (const pageDef of KEY_PAGES) {
  test(`${pageDef.name} page has no critical WCAG 2.1 AA violations @accessibility`, async ({
    page,
    navigate,
  }, testInfo) => {
    await navigate(pageDef.path);

    const builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']);

    // Exclude third-party iframes - we cannot fix their markup
    if (pageDef.excludeIframe) {
      builder.exclude('iframe[id^="hs-form-iframe"]');
    }

    const results = await builder.analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical');
    const nonCritical = results.violations.filter((v) => v.impact !== 'critical');

    // Attach full violation detail to the Playwright report for triage
    if (results.violations.length > 0) {
      const summary = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.length,
      }));
      console.log(
        `[a11y] ${pageDef.name} - ${results.violations.length} violation type(s):`,
        JSON.stringify(summary, null, 2),
      );
      await testInfo.attach(`a11y-${pageDef.name}.json`, {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
      });
    }

    // Serious/moderate/minor: log and attach for the team, do not block CI
    if (nonCritical.length > 0) {
      console.warn(
        `[a11y] ${pageDef.name} has ${nonCritical.length} non-critical violation(s): ` +
          nonCritical.map((v) => `${v.id} (${v.impact})`).join(', '),
      );
    }

    // Critical violations must be zero - these are showstopper accessibility bugs
    expect(
      critical,
      `Critical WCAG violations on "${pageDef.name}": ${critical.map((v) => v.id).join(', ')}`,
    ).toHaveLength(0);
  });
}
