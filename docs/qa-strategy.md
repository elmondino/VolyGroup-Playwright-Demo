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
- Responsive smoke coverage on mobile (Pixel 7) and tablet (iPad) viewports.
- Focused visual regression for key stakeholder pages.
- Static HTML reports with traces and screenshots.

The default gate stays small so every push gets fast, high-signal feedback.

## Script List

The permanent scripts cover the commands a team would use often. Product-only, audience-only, or auth-only runs are useful while debugging, but they do not need dedicated npm scripts.

For those cases, Playwright can be called directly:

```bash
npx playwright test tests/e2e/products/ --project=chromium
npx playwright test tests/e2e/auth/ --project=chromium
```

The default gate runs in Chromium for speed. CI extends the same smoke set to Firefox, WebKit, mobile, and tablet so layout and engine differences are caught automatically.

Visual regression is available as a separate suite:

```bash
npm run test:visual
npm run test:visual -- --update-snapshots
```

It is not part of the default gate because visual differences need human review. A failing screenshot diff can be a genuine regression, a planned design change, or a content update. Keeping the suite opt-in makes it useful for stakeholder review without slowing every push.

## Visual Regression

Visual regression protects risks that functional assertions do not see: missing hero imagery, broken spacing, clipped headings, unexpected colour changes, layout shifts, and brand presentation issues on important entry points.

This project keeps visual coverage focused on the first viewport of five stakeholder-facing pages:

- Home, the public first impression.
- Book a Demo, the lead-generation journey.
- Yacht Accounting, a core product page.
- Captains and Crew, a key audience page.
- Security, a trust and assurance page.

The suite runs in one stable Chromium desktop project at 1366 x 768. It masks third-party and dynamic regions such as HubSpot iframes, video, cookie banners, and newsletter blocks because those areas can change outside this framework's control. Their behaviour is covered by dedicated functional and form tests instead.

Snapshots should be updated only when a visual change is intentional and reviewed:

```bash
npm run test:visual -- --update-snapshots
```

## Tooling Boundaries

| Area | Recommended tooling | Why |
|---|---|---|
| Broken links | Lychee, Muffet, Screaming Frog | Faster and better for crawling lots of URLs |
| SEO | Screaming Frog, Sitebulb, Google Search Console | Better for canonicals, redirects, metadata, indexing, and sitemap checks |
| Performance | Lighthouse CI, WebPageTest, PageSpeed Insights, CrUX | Better diagnostics and field data |
| Accessibility | axe DevTools, Accessibility Insights, screen reader checks | Automated checks are useful, but not enough on their own |
| Visual testing | Playwright screenshots for focused baselines; Percy, Applitools, or Chromatic for larger review workflows | Playwright is enough for this portfolio suite. Specialist tools are better when multiple people must approve baseline changes |
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
- Add mobile visual baselines later if stakeholders need responsive visual approval.

## Stakeholder Review

1. Open the portfolio page: https://elmondino.github.io/VolyGroup-Playwright-Demo/
2. Open the latest report at `/report/` to review results, traces, screenshots, timings, and failures if any exist.
3. Open the GitHub Actions workflow to review the quality gate, sharding, cross-browser smoke, and Pages publishing.
4. Run `npm run test:visual` or the `visual-regression` workflow option to review approved screenshot baselines and visual diffs.
5. Open the HubSpot pre-submit contract test to review how the payload is checked without creating production CRM records.