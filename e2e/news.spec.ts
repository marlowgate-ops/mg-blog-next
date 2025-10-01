import { test, expect } from '@playwright/test';

test.describe('/news page E2E tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/news');
    await page.waitForLoadState('networkidle');
  });

  test('provider chips reflect in URL and filter content', async ({ page }) => {
    // Test provider chip selection
    const reutersChip = page.locator('[data-testid="provider-chip-reuters"]').first();
    await reutersChip.click();
    
    // Check URL reflects the provider filter
    await expect(page).toHaveURL(/providers=reuters/);
    
    // Verify filtered content
    const newsItems = page.locator('[data-testid="news-item"]');
    const itemCount = await newsItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(1);
    
    // Check that news items show Reuters as source
    const firstItem = newsItems.first();
    await expect(firstItem.locator('[data-testid="news-source"]')).toContainText('Reuters');
  });

  test('period filter reflects in URL and updates content', async ({ page }) => {
    // Test period dropdown
    const periodSelect = page.locator('[data-testid="period-select"]');
    await periodSelect.selectOption('day');
    
    // Check URL reflects the period
    await expect(page).toHaveURL(/period=day/);
    
    // Wait for content to update
    await page.waitForLoadState('networkidle');
    
    // Verify news items are from today
    const newsItems = page.locator('[data-testid="news-item"]');
    const itemCount = await newsItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(1);
  });

  test('search functionality updates URL and filters results', async ({ page }) => {
    const searchInput = page.locator('[data-testid="news-search-input"]');
    const searchTerm = 'FX';
    
    await searchInput.fill(searchTerm);
    await searchInput.press('Enter');
    
    // Check URL reflects the search query
    await expect(page).toHaveURL(new RegExp(`q=${encodeURIComponent(searchTerm)}`));
    
    // Wait for search results
    await page.waitForLoadState('networkidle');
    
    // Verify search results contain the search term
    const newsItems = page.locator('[data-testid="news-item"]');
    const itemCount = await newsItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(1);
    
    // Check that first item contains search term
    const firstItemText = await newsItems.first().textContent();
    expect(firstItemText?.toLowerCase()).toContain(searchTerm.toLowerCase());
  });

  test('load more button functionality', async ({ page }) => {
    // Count initial items
    const initialItems = await page.locator('[data-testid="news-item"]').count();
    
    // Click load more if it exists
    const loadMoreButton = page.locator('[data-testid="load-more-button"]');
    if (await loadMoreButton.isVisible()) {
      await loadMoreButton.click();
      await page.waitForLoadState('networkidle');
      
      // Verify more items loaded
      const newItemsCount = await page.locator('[data-testid="news-item"]').count();
      expect(newItemsCount).toBeGreaterThan(initialItems);
      
      // Check URL reflects pagination
      await expect(page).toHaveURL(/offset=\d+/);
    }
  });

  test('combined filters (provider + period + search) work together', async ({ page }) => {
    // Apply multiple filters
    await page.locator('[data-testid="provider-chip-bloomberg"]').first().click();
    await page.locator('[data-testid="period-select"]').selectOption('week');
    
    const searchInput = page.locator('[data-testid="news-search-input"]');
    await searchInput.fill('market');
    await searchInput.press('Enter');
    
    // Check URL contains all parameters
    await expect(page).toHaveURL(/providers=bloomberg/);
    await expect(page).toHaveURL(/period=week/);
    await expect(page).toHaveURL(/q=market/);
    
    // Verify filtered results
    await page.waitForLoadState('networkidle');
    const newsItems = page.locator('[data-testid="news-item"]');
    
    if (await newsItems.count() > 0) {
      // Check that first item matches filters
      const firstItem = newsItems.first();
      await expect(firstItem.locator('[data-testid="news-source"]')).toContainText('Bloomberg');
    }
  });

  test('external links open with noopener', async ({ page }) => {
    const externalLink = page.locator('[data-testid="news-external-link"]').first();
    
    if (await externalLink.isVisible()) {
      // Check rel attribute
      const relAttribute = await externalLink.getAttribute('rel');
      expect(relAttribute).toContain('noopener');
      expect(relAttribute).toContain('noreferrer');
      
      // Check target attribute
      const targetAttribute = await externalLink.getAttribute('target');
      expect(targetAttribute).toBe('_blank');
    }
  });

  test('URL parameters persist on page reload', async ({ page }) => {
    // Set up filters
    await page.locator('[data-testid="provider-chip-reuters"]').first().click();
    await page.locator('[data-testid="period-select"]').selectOption('day');
    
    const searchInput = page.locator('[data-testid="news-search-input"]');
    await searchInput.fill('investment');
    await searchInput.press('Enter');
    
    // Wait a bit for URL update to complete
    await page.waitForTimeout(500);
    await page.waitForLoadState('networkidle');
    const urlBeforeReload = page.url();
    console.log('URL before reload:', urlBeforeReload);
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check URL parameters persist
    expect(page.url()).toBe(urlBeforeReload);
    console.log('URL after reload:', page.url());
    
    // Check filters are still applied in UI
    await expect(page.locator('[data-testid="provider-chip-reuters"]').first()).toHaveClass(/active|selected/);
    await expect(page.locator('[data-testid="period-select"]')).toHaveValue('day');
    await expect(page.locator('[data-testid="news-search-input"]')).toHaveValue('investment');
  });
});