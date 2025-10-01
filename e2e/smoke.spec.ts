import { test, expect } from '@playwright/test';
import { TestHelpers } from './test-helpers';

test.describe('Smoke Tests - Critical Paths', () => {
  
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await TestHelpers.waitForPageLoad(page);
    
    // Check critical elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="main-navigation"]')).toBeVisible();
    
    // Check SEO basics
    await TestHelpers.checkSEOTags(page);
  });

  test('/news page critical functionality', async ({ page }) => {
    await page.goto('/news');
    await TestHelpers.waitForPageLoad(page);
    
    // Check page loads
    await expect(page.locator('[data-testid="news-container"]')).toBeVisible();
    
    // Quick filter test
    const providerChip = page.locator('[data-testid="provider-chip"]').first();
    if (await providerChip.isVisible()) {
      await providerChip.click();
      await expect(page).toHaveURL(/providers=/);
    }
  });

  test('/brokers/compare page critical functionality', async ({ page }) => {
    await page.goto('/brokers/compare');
    await TestHelpers.waitForPageLoad(page);
    
    // Check table loads
    await expect(page.locator('[data-testid="broker-compare-table"]')).toBeVisible();
    
    // Quick filter test
    const filterSelect = page.locator('[data-testid="filter-regulation"]');
    if (await filterSelect.isVisible()) {
      await filterSelect.selectOption({ index: 1 });
      await TestHelpers.waitForPageLoad(page);
    }
  });

  test('/brokers/[slug] page loads and has key elements', async ({ page }) => {
    await page.goto('/brokers/dmm-fx');
    await TestHelpers.waitForPageLoad(page);
    
    // Check critical elements
    await expect(page.locator('[data-testid="broker-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="broker-rating"]')).toBeVisible();
    
    // Check structured data
    await TestHelpers.checkStructuredData(page);
  });

  test('/tools/position-size calculator basic functionality', async ({ page }) => {
    await page.goto('/tools/position-size');
    await TestHelpers.waitForPageLoad(page);
    
    // Check calculator form
    await expect(page.locator('[data-testid="position-calculator"]')).toBeVisible();
    
    // Quick calculation test
    await page.locator('[data-testid="account-balance-input"]').fill('10000');
    await page.locator('[data-testid="risk-percentage-input"]').fill('2');
    
    // Check result updates
    await page.waitForTimeout(200);
    const result = await page.locator('[data-testid="position-size-result"]').textContent();
    expect(result).toBeTruthy();
  });

  test('RSS feeds are accessible', async ({ page }) => {
    // Test main RSS feed
    const rssResponse = await page.request.get('/rss.xml');
    expect(rssResponse.status()).toBe(200);
    expect(rssResponse.headers()['content-type']).toContain('xml');
    
    // Test OpenSearch descriptor
    const openSearchResponse = await page.request.get('/opensearch.xml');
    expect(openSearchResponse.status()).toBe(200);
    expect(openSearchResponse.headers()['content-type']).toContain('xml');
  });

  test('Dynamic OG cards are working', async ({ page }) => {
    // Test news OG card
    const newsOGResponse = await page.request.get('/api/og?type=news&title=Test%20News&subtitle=Test%20Source');
    expect(newsOGResponse.status()).toBe(200);
    expect(newsOGResponse.headers()['content-type']).toContain('image');
    
    // Test broker OG card
    const brokerOGResponse = await page.request.get('/api/og?type=broker&title=Test%20Broker&subtitle=Rating%3A%204.5');
    expect(brokerOGResponse.status()).toBe(200);
    expect(brokerOGResponse.headers()['content-type']).toContain('image');
  });

  test('Site build quality - no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await TestHelpers.waitForPageLoad(page);
    
    // Allow some common non-critical errors but fail on critical ones
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('Ad blocker') &&
      !error.includes('chrome-extension')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('Basic accessibility compliance', async ({ page }) => {
    await page.goto('/');
    await TestHelpers.waitForPageLoad(page);
    
    await TestHelpers.checkBasicAccessibility(page);
  });

  test('Mobile responsiveness check', async ({ page }) => {
    const keySelectors = [
      '[data-testid="main-navigation"]',
      'h1',
      'main'
    ];
    
    await page.goto('/');
    await TestHelpers.testMobileResponsiveness(page, keySelectors);
  });
});