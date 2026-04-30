# Voly Group QA Automation

This is a Playwright testing framework for [volygroup.com](https://www.volygroup.com). It is designed to show a practical QA approach for a public marketing site: a small release gate, safe form checks, useful browser coverage, and reports that can be opened directly in a web browser.

The framework uses Playwright where it adds the most value: real browser journeys, page routing, links and CTAs, embedded HubSpot forms, login entry points, cross-browser smoke checks, and traceable HTML reports.

## Public Links

| What | Link | Notes |
|---|---|---|
| Portfolio page | https://elmondino.github.io/VolyGroup-Playwright-Demo/ | Public summary page |
| Latest Playwright report | https://elmondino.github.io/VolyGroup-Playwright-Demo/report/ | Static HTML report, no install needed |

The Playwright HTML report is the main stakeholder view. It is hosted on GitHub Pages and opens like a normal website. It includes the latest test results, traces, screenshots, errors, retries, and timing data.

## Coverage

- Home page smoke coverage and key CTAs.
- Product and audience page routing checks.
- HubSpot iframe form loading and field checks.
- A production-safe pre-submit form contract for Book a Demo.
- Login entry point checks against the secure Voly app.
- Cookie consent behaviour.
- Footer, legal, news, and navigation checks.
- Firefox and WebKit smoke coverage in CI.
- Targeted accessibility, SEO, browser health, and performance suites.

## Test Strategy

The suite is split into a small default gate and deeper checks that run when needed.

| Suite | Purpose | Runs by default |
|---|---|---|
| Quality gate | Fast proof that the most important browser journeys still work | Yes |
| Cross-browser smoke | Firefox and WebKit confidence on key paths | Yes in CI |
| Full regression | Broader page and content checks | No |
| Forms | HubSpot iframe and safe form checks | No |
| Accessibility | Automated axe checks | No |
| SEO | Basic metadata checks | No |
| Browser health | First-party browser errors and failed requests | No |
| Performance | LCP and TTFB audit | No |

This keeps the default run useful without turning every push into a slow site crawl.

## Production Safety

The live Voly site uses HubSpot forms, so tests must avoid creating real CRM records.

The framework handles that in two ways:

1. Normal form checks validate the embedded iframe safely in production.
2. The submit contract test captures the HubSpot form payload before the network request and validates the expected field names and values.

Real submit tests remain limited to `TEST_ENV=dev` or `TEST_ENV=staging`.

## Tooling Boundaries

Playwright is not used as a replacement for every QA tool. Some checks are better handled by specialist tooling.

| Area | Better tool |
|---|---|
| Full SEO crawl | Screaming Frog, Sitebulb, Google Search Console |
| Broken links across the whole site | Lychee, Muffet, Screaming Frog |
| Performance budgets | Lighthouse CI, WebPageTest, PageSpeed Insights, CrUX |
| Deeper accessibility review | Accessibility Insights, axe DevTools, screen reader checks |
| Visual regression | Percy, Applitools, Chromatic, or owned Playwright baselines |
| Security checks | OWASP ZAP baseline, security header checks, dependency scanning |
| Analytics events | GTM preview, GA4 DebugView, vendor consoles |

More detail is in [docs/qa-strategy.md](docs/qa-strategy.md).

## Quick Start

```bash
npm ci
npx playwright install --with-deps chromium

# Run the default quality gate
npm test

# Open Playwright UI mode
npm run ui

# Run a headed local demo and open the report
npm run demo
```

## Useful Scripts

| Script | Purpose |
|---|---|
| `npm test` | Default quality gate |
| `npm run test:gate` | Same as `npm test` |
| `npm run test:regression` | Broader Chromium regression |
| `npm run test:forms` | HubSpot form checks |
| `npm run test:seo` | Basic SEO metadata checks |
| `npm run test:accessibility` | Automated axe checks |
| `npm run test:browser-health` | First-party browser health checks |
| `npm run test:performance` | LCP and TTFB audit |
| `npm run demo` | Headed quality gate plus local HTML report |
| `npm run report` | Open the latest local Playwright report |

For one-off debugging, Playwright can be called directly instead of adding more permanent scripts:

```bash
npx playwright test tests/e2e/products/ --project=chromium
```

## CI And Publishing

GitHub Actions runs on pushes and pull requests to `main`.

The workflow:

1. Runs the selected Chromium suite in four shards.
2. Runs Firefox and WebKit smoke checks for the quality gate.
3. Merges Playwright blob reports into one HTML report.
4. Publishes the portfolio page and report to GitHub Pages.

The published report is available at https://elmondino.github.io/VolyGroup-Playwright-Demo/report/ after each successful workflow run on `main`.
