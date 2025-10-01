import { Page, expect } from '@playwright/test';

/**
 * Common test utilities for E2E tests
 */
export class TestHelpers {
  
  /**
   * Wait for page to be fully loaded including network idle
   */
  static async waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * Check that external links have proper security attributes
   */
  static async checkExternalLinkSecurity(page: Page, linkSelector: string) {
    const link = page.locator(linkSelector);
    
    if (await link.isVisible()) {
      const rel = await link.getAttribute('rel');
      const target = await link.getAttribute('target');
      
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
      expect(target).toBe('_blank');
    }
  }

  /**
   * Check that a URL contains specific query parameters
   */
  static async expectUrlToContainParams(page: Page, params: Record<string, string>) {
    const url = new URL(page.url());
    
    for (const [key, value] of Object.entries(params)) {
      expect(url.searchParams.get(key)).toBe(value);
    }
  }

  /**
   * Wait for an element to be visible and stable (no layout shifts)
   */
  static async waitForStableElement(page: Page, selector: string, timeout = 5000) {
    const element = page.locator(selector);
    
    await expect(element).toBeVisible({ timeout });
    
    // Wait for element to be stable (no size changes)
    let previousBox = await element.boundingBox();
    let stableCount = 0;
    
    while (stableCount < 3) {
      await page.waitForTimeout(100);
      const currentBox = await element.boundingBox();
      
      if (JSON.stringify(previousBox) === JSON.stringify(currentBox)) {
        stableCount++;
      } else {
        stableCount = 0;
        previousBox = currentBox;
      }
    }
  }

  /**
   * Check for accessibility violations
   */
  static async checkBasicAccessibility(page: Page) {
    // Check for proper heading structure
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Should have exactly one h1
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      
      // Image should have alt text or aria-label, or be decorative
      expect(alt !== null || ariaLabel !== null || await img.getAttribute('role') === 'presentation').toBeTruthy();
    }
  }

  /**
   * Verify SEO meta tags are present and valid
   */
  static async checkSEOTags(page: Page) {
    // Check title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60);
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    const description = await metaDescription.getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(120);
    expect(description!.length).toBeLessThan(160);
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href');
    
    // Check Open Graph tags
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content');
  }

  /**
   * Check for CLS (Cumulative Layout Shift) prevention
   */
  static async checkLayoutStability(page: Page, mainContentSelector: string) {
    // Get initial layout
    const initialBox = await page.locator(mainContentSelector).boundingBox();
    
    // Trigger potential layout shifts
    await page.mouse.move(100, 100);
    await page.waitForTimeout(500);
    
    // Check layout is stable
    const finalBox = await page.locator(mainContentSelector).boundingBox();
    expect(finalBox).toEqual(initialBox);
  }

  /**
   * Mock GA4 tracking for testing
   */
  static async mockGA4(page: Page) {
    await page.addInitScript(() => {
      (window as any).gtag = (...args: any[]) => {
        if (!(window as any).__ga4Events) (window as any).__ga4Events = [];
        (window as any).__ga4Events.push(args);
      };
    });
  }

  /**
   * Get GA4 events that were fired
   */
  static async getGA4Events(page: Page): Promise<any[]> {
    return await page.evaluate(() => (window as any).__ga4Events || []);
  }

  /**
   * Check that structured data is valid JSON-LD
   */
  static async checkStructuredData(page: Page) {
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const scriptCount = await jsonLdScripts.count();
    
    expect(scriptCount).toBeGreaterThanOrEqual(1);
    
    for (let i = 0; i < scriptCount; i++) {
      const script = jsonLdScripts.nth(i);
      const content = await script.textContent();
      
      expect(content).toBeTruthy();
      
      // Should be valid JSON
      const jsonData = JSON.parse(content!);
      expect(jsonData).toBeTruthy();
      expect(jsonData['@type']).toBeTruthy();
    }
  }

  /**
   * Test mobile responsiveness
   */
  static async testMobileResponsiveness(page: Page, keySelectors: string[]) {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await this.waitForPageLoad(page);
    
    // Check key elements are still visible
    for (const selector of keySelectors) {
      await expect(page.locator(selector)).toBeVisible();
    }
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await this.waitForPageLoad(page);
    
    // Check key elements are still visible
    for (const selector of keySelectors) {
      await expect(page.locator(selector)).toBeVisible();
    }
    
    // Reset to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
  }
}