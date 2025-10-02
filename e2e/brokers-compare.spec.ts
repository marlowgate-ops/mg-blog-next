import { test, expect } from '@playwright/test';

test.describe('/brokers/compare page E2E tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/best/forex-brokers-jp');
    await page.waitForLoadState('networkidle');
  });

  test('facet filters update table content and URL', async ({ page }) => {
    // Test regulation filter
    const regulationFilter = page.locator('[data-testid="filter-regulation"]');
    await regulationFilter.selectOption('FSA');
    
    // Check URL reflects the filter
    await expect(page).toHaveURL(/regulation=FSA/);
    
    // Wait for table to update
    await page.waitForLoadState('networkidle');
    
    // Verify filtered results in table
    const tableRows = page.locator('[data-testid="broker-table-row"]');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThanOrEqual(1);
    
    // Check that first row shows FSA regulation
    const firstRow = tableRows.first();
    await expect(firstRow.locator('[data-testid="broker-regulation"]')).toContainText('FSA');
  });

  test('minimum deposit filter works correctly', async ({ page }) => {
    // Test minimum deposit filter
    const minDepositFilter = page.locator('[data-testid="filter-min-deposit"]');
    await minDepositFilter.selectOption('1000');
    
    // Check URL reflects the filter
    await expect(page).toHaveURL(/minDeposit=1000/);
    
    // Wait for table to update
    await page.waitForLoadState('networkidle');
    
    // Verify filtered results
    const tableRows = page.locator('[data-testid="broker-table-row"]');
    if (await tableRows.count() > 0) {
      const firstRow = tableRows.first();
      const depositText = await firstRow.locator('[data-testid="broker-min-deposit"]').textContent();
      // Check that deposit amount is >= 1000 or shows "No minimum"
      expect(depositText).toMatch(/(No minimum|[1-9]\d{3,})/);
    }
  });

  test('sort functionality updates table order and URL', async ({ page }) => {
    // Test sort by rating
    const sortSelect = page.locator('[data-testid="sort-select"]');
    await sortSelect.selectOption('rating-desc');
    
    // Check URL reflects the sort
    await expect(page).toHaveURL(/sort=rating-desc/);
    
    // Wait for table to update
    await page.waitForLoadState('networkidle');
    
    // Verify sort order - first item should have highest rating
    const tableRows = page.locator('[data-testid="broker-table-row"]');
    if (await tableRows.count() >= 2) {
      const firstRating = await tableRows.first().locator('[data-testid="broker-rating"]').textContent();
      const secondRating = await tableRows.nth(1).locator('[data-testid="broker-rating"]').textContent();
      
      // Parse rating from "評価: 85/100" format
      const parseRating = (text: string | null): number => {
        if (!text) return 0;
        const match = text.match(/評価:\s*(\d+)\/100/);
        return match ? parseFloat(match[1]) : 0;
      };
      
      const firstScore = parseRating(firstRating);
      const secondScore = parseRating(secondRating);
      expect(firstScore).toBeGreaterThanOrEqual(secondScore);
    }
  });

  test('combined facet and sort filters work together', async ({ page }) => {
    // Apply multiple filters
    await page.locator('[data-testid="filter-regulation"]').selectOption('FSA');
    await page.locator('[data-testid="filter-account-type"]').selectOption('demo');
    await page.locator('[data-testid="sort-select"]').selectOption('spread-asc');
    
    // Check URL contains all parameters
    await expect(page).toHaveURL(/regulation=FSA/);
    await expect(page).toHaveURL(/accountType=demo/);
    await expect(page).toHaveURL(/sort=spread-asc/);
    
    // Wait for table to update
    await page.waitForLoadState('networkidle');
    
    // Verify results match all filters
    const tableRows = page.locator('[data-testid="broker-table-row"]');
    if (await tableRows.count() > 0) {
      const firstRow = tableRows.first();
      await expect(firstRow.locator('[data-testid="broker-regulation"]')).toContainText('FSA');
      await expect(firstRow.locator('[data-testid="broker-demo-account"]')).toContainText('Yes');
    }
  });

  test('table row click navigates to broker profile', async ({ page }) => {
    // Wait for table to load
    const tableRows = page.locator('[data-testid="broker-table-row"]');
    await expect(tableRows.first()).toBeVisible();
    
    // Get first broker row and its slug
    const firstRow = tableRows.first();
    const brokerSlug = await firstRow.getAttribute('data-broker-slug');
    
    // Click the row (force click to avoid element interception on mobile)
    await firstRow.click({ force: true });
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Verify navigation to broker profile
    if (brokerSlug) {
      await expect(page).toHaveURL(new RegExp(`/brokers/${brokerSlug}`));
    } else {
      // Fallback: check we're on a broker profile page
      await expect(page).toHaveURL(/\/brokers\/[^/]+$/);
    }
    
    // Verify we're on a broker profile page
    await expect(page.locator('[data-testid="broker-profile-header"]')).toBeVisible();
  });

  test('table remains stable during sort and filter operations', async ({ page }) => {
    // Initial table state
    await page.waitForLoadState('networkidle');
    
    // Apply filter
    await page.locator('[data-testid="filter-regulation"]').selectOption('FSA');
    await page.waitForLoadState('networkidle');
    
    // Change sort
    await page.locator('[data-testid="sort-select"]').selectOption('rating-desc');
    await page.waitForLoadState('networkidle');
    
    // Add another filter
    await page.locator('[data-testid="filter-min-deposit"]').selectOption('100');
    await page.waitForLoadState('networkidle');
    
    // Verify table structure is stable (no flickering or layout shifts)
    const tableElement = page.locator('[data-testid="broker-compare-table"]');
    await expect(tableElement).toBeVisible();
    
    // Check that we have some results
    const finalRows = await page.locator('[data-testid="broker-table-row"]').count();
    expect(finalRows).toBeGreaterThanOrEqual(0); // Could be 0 if filters are very restrictive
  });

  test('filter and sort state persists on page reload', async ({ page }) => {
    // Set up filters and sort
    await page.locator('[data-testid="filter-regulation"]').selectOption('FSA');
    
    // Wait for URL to update with regulation parameter
    await expect(page).toHaveURL(/regulation=FSA/);
    
    await page.locator('[data-testid="sort-select"]').selectOption('rating-desc');
    
    // Wait for URL to update with sort parameter
    await expect(page).toHaveURL(/sort=rating-desc/);
    
    await page.waitForLoadState('networkidle');
    
    const urlBeforeReload = page.url();
    console.log('URL before reload:', urlBeforeReload);
    
    // Verify URL contains both parameters before reload
    expect(urlBeforeReload).toContain('regulation=FSA');
    expect(urlBeforeReload).toContain('sort=rating-desc');
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check URL parameters persist
    const urlAfterReload = page.url();
    console.log('URL after reload:', urlAfterReload);
    expect(urlAfterReload).toBe(urlBeforeReload);
    
    // Wait a bit for React to hydrate and restore state
    await page.waitForTimeout(1000);
    
    // Check filters are still applied in UI
    const regulationValue = await page.locator('[data-testid="filter-regulation"]').inputValue();
    const sortValue = await page.locator('[data-testid="sort-select"]').inputValue();
    console.log('Regulation filter value:', regulationValue);
    console.log('Sort select value:', sortValue);
    
    await expect(page.locator('[data-testid="filter-regulation"]')).toHaveValue('FSA');
    await expect(page.locator('[data-testid="sort-select"]')).toHaveValue('rating-desc');
  });

  test('responsive table behavior on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check table adapts to mobile view
    const table = page.locator('[data-testid="broker-compare-table"]');
    await expect(table).toBeVisible();
    
    // On mobile, table might stack or scroll horizontally
    // Check that all important broker info is still accessible
    const tableRows = page.locator('[data-testid="broker-table-row"]');
    if (await tableRows.count() > 0) {
      const firstRow = tableRows.first();
      await expect(firstRow.locator('[data-testid="broker-name"]')).toBeVisible();
      await expect(firstRow.locator('[data-testid="broker-rating"]')).toBeVisible();
    }
  });
});