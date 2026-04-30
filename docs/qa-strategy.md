# QA Strategy

This document explains the testing choices behind the framework. The goal is not to maximise the number of tests. The goal is to use the right tool for each risk and keep the default feedback loop useful.

## Playwright Scope

Playwright is used for browser behaviour that needs a real page:

- Key user journeys, such as home page CTAs and Book a Demo.
- HubSpot iframe form checks.
- Safe pre-submit form payload checks.
- Login entry point checks.
- Cookie banner behaviour.
- Basic page routing and page identity checks.
- Cross-browser smoke coverage in Firefox and WebKit.
- Static HTML reports with traces and screenshots.

The default gate stays small so every push gets fast, high-signal feedback.

## Script List

The permanent scripts cover the commands a team would use often. Product-only, audience-only, or auth-only runs are useful while debugging, but they do not need dedicated npm scripts.

For those cases, Playwright can be called directly:

```bash
npx playwright test tests/e2e/products/ --project=chromium
npx playwright test tests/e2e/auth/ --project=chromium
```

Targeted scripts run in Chromium by default. Cross-browser coverage is added where browser differences are meaningful.

## Tooling Boundaries

| Area | Recommended tooling | Why |
|---|---|---|
| Broken links | Lychee, Muffet, Screaming Frog | Faster and better for crawling lots of URLs |
| SEO | Screaming Frog, Sitebulb, Google Search Console | Better for canonicals, redirects, metadata, indexing, and sitemap checks |
| Performance | Lighthouse CI, WebPageTest, PageSpeed Insights, CrUX | Better diagnostics and field data |
| Accessibility | axe DevTools, Accessibility Insights, screen reader checks | Automated checks are useful, but not enough on their own |
| Visual testing | Percy, Applitools, Chromatic | Better review workflow for visual baselines |
| Security | OWASP ZAP baseline, security headers, dependency scanning | Security needs specialist tooling |
| Analytics | GTM preview, GA4 DebugView, vendor consoles | Better for validating event payloads |

## Recommended Next Steps

The next step would be a balanced quality setup rather than a much larger Playwright suite:

- Run real submit tests only in staging or a HubSpot sandbox.
- Add API or contract tests for form endpoints and auth redirects.
- Add scheduled post-deploy smoke checks and alerting.
- Add a proper performance budget with Lighthouse CI or WebPageTest.
- Add a real SEO crawl outside Playwright.
- Add manual accessibility checks for keyboard and screen reader use.
- Add visual tests only if the team owns the baseline review process.

## Stakeholder Review

1. Open the portfolio page: https://elmondino.github.io/VolyGroup-Playwright-Demo/
2. Open the latest report at `/report/` to review results, traces, screenshots, timings, and failures if any exist.
3. Open the GitHub Actions workflow to review the quality gate, sharding, cross-browser smoke, and Pages publishing.
4. Open the HubSpot pre-submit contract test to review how the payload is checked without creating production CRM records.