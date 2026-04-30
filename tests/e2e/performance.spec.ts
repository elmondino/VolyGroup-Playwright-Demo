import { test, expect } from '../../fixtures/base.fixture';
import { URLS } from '../../fixtures/urls';

/**
 * Core Web Vitals and page timing tests.
 *
 * Targets: Largest Contentful Paint (LCP) and Time to First Byte (TTFB)
 * on the two highest-traffic pages: Home and Book a Demo.
 *
 * Thresholds are aligned with Google's "Good" band:
 *   LCP  < 2500 ms  (Google Good: <= 2.5s)
 *   TTFB < 800 ms   (Google Good: <= 800ms)
 *
 * These tests run on Chromium only because PerformanceObserver / navigation
 * timing accuracy varies across browser engines in lab conditions.
 *
 * Tag: @performance - exclude from cross-browser runs via --grep-invert.
 */

/** Declare the global augmentation so TypeScript accepts window.__lcp */
declare global {
  interface Window {
    __lcpValue: number;
  }
}

const PERF_PAGES = [
  { name: 'Home', path: URLS.home },
  { name: 'Book a Demo', path: URLS.bookADemo },
] as const;

for (const pageDef of PERF_PAGES) {
  test.describe(`${pageDef.name} - Core Web Vitals @performance`, () => {
    test('LCP is within the 2500 ms Good threshold', async ({ page }) => {
      // Inject the observer BEFORE navigation so it captures paint entries
      await page.addInitScript(() => {
        window.__lcpValue = 0;
        try {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              window.__lcpValue = entries[entries.length - 1].startTime;
            }
          // 'largest-contentful-paint' is a Chrome-only extension not yet in the TS DOM lib
          }).observe({ type: 'largest-contentful-paint' as string, buffered: true });
        } catch {
          // PerformanceObserver not supported in this browser - value stays 0
        }
      });

      await page.goto(pageDef.path);
      await page.waitForLoadState('networkidle');

      const lcp = await page.evaluate(() => window.__lcpValue);
      console.log(`[perf] ${pageDef.name} LCP: ${Math.round(lcp)} ms`);

      // 0 means the observer did not fire (browser does not support LCP entries).
      // Skip instead of failing to keep the test meaningful on supported browsers.
      test.skip(lcp === 0, 'LCP observer did not fire - browser may not support this entry type');

      expect(lcp, `LCP ${Math.round(lcp)} ms exceeds the 2500 ms Good threshold`).toBeLessThan(2500);
    });

    test('TTFB is within the 800 ms Good threshold', async ({ page }) => {
      await page.goto(pageDef.path);
      await page.waitForLoadState('domcontentloaded');

      const ttfb = await page.evaluate((): number => {
        const [entry] = performance.getEntriesByType(
          'navigation' as string,
        ) as PerformanceNavigationTiming[];
        return entry ? Math.round(entry.responseStart - entry.requestStart) : -1;
      });

      console.log(`[perf] ${pageDef.name} TTFB: ${ttfb} ms`);
      test.skip(ttfb < 0, 'Navigation timing not available');

      expect(ttfb, `TTFB ${ttfb} ms exceeds the 800 ms Good threshold`).toBeLessThan(800);
    });
  });
}
