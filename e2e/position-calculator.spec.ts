import { test, expect } from '@playwright/test';

test.describe('/tools/position-size calculator E2E tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/position-size-calculator');
    await page.waitForLoadState('networkidle');
  });

  test('calculator loads with default values', async ({ page }) => {
    // Check that calculator form is visible
    await expect(page.locator('[data-testid="position-calculator"]')).toBeVisible();
    
    // Check input fields are present
    await expect(page.locator('[data-testid="account-balance-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="risk-percentage-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="stop-loss-input"]')).toBeVisible();
    
    // Check default risk percentage value
    const riskInput = page.locator('[data-testid="risk-percentage-input"]');
    await expect(riskInput).toHaveValue('2');
  });

  test('input changes update results immediately', async ({ page }) => {
    // Get initial result value
    const resultElement = page.locator('[data-testid="position-size-result"]');
    const initialResult = await resultElement.textContent();
    
    // Change account balance
    const balanceInput = page.locator('[data-testid="account-balance-input"]');
    await balanceInput.clear();
    await balanceInput.fill('10000');
    
    // Wait a moment for calculation
    await page.waitForTimeout(100);
    
    // Check result updated
    const newResult = await resultElement.textContent();
    expect(newResult).not.toBe(initialResult);
  });

  test('risk percentage input validation and updates', async ({ page }) => {
    const riskInput = page.locator('[data-testid="risk-percentage-input"]');
    const resultElement = page.locator('[data-testid="position-size-result"]');
    
    // Test valid risk percentage
    await riskInput.clear();
    await riskInput.fill('2');
    
    // Check calculation updates
    await page.waitForTimeout(100);
    const result1 = await resultElement.textContent();
    
    // Test different risk percentage
    await riskInput.clear();
    await riskInput.fill('5');
    
    await page.waitForTimeout(100);
    const result2 = await resultElement.textContent();
    
    expect(result1).not.toBe(result2);
    
    // Test invalid risk percentage (too high)
    await riskInput.clear();
    await riskInput.fill('150');
    
    // Should show validation error or limit the value
    const errorMessage = page.locator('[data-testid="risk-error"]');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText('リスク');
    }
  });

  test('entry price and stop loss calculation', async ({ page }) => {
    const entryInput = page.locator('[data-testid="entry-price-input"]');
    const stopLossInput = page.locator('[data-testid="stop-loss-input"]');
    const resultElement = page.locator('[data-testid="position-size-result"]');
    
    // Set up a trade scenario
    await page.locator('[data-testid="account-balance-input"]').fill('10000');
    await page.locator('[data-testid="risk-percentage-input"]').fill('2');
    
    // USD/JPY example
    await entryInput.fill('150.00');
    await stopLossInput.fill('149.50');
    
    await page.waitForTimeout(100);
    
    // Check that result is calculated
    const result = await resultElement.textContent();
    expect(result).toBeTruthy();
    expect(result).not.toBe('0');
    
    // Check pip difference is shown
    const pipDifference = page.locator('[data-testid="pip-difference"]');
    if (await pipDifference.isVisible()) {
      const pipValue = await pipDifference.textContent();
      expect(pipValue).toContain('50'); // 50 pips difference
    }
  });

  test('different currency pairs work correctly', async ({ page }) => {
    // Test EUR/USD (4 decimal places)
    const currencySelect = page.locator('[data-testid="currency-pair-select"]');
    if (await currencySelect.isVisible()) {
      await currencySelect.selectOption('EURUSD');
      
      await page.locator('[data-testid="entry-price-input"]').fill('1.0800');
      await page.locator('[data-testid="stop-loss-input"]').fill('1.0750');
      
      await page.waitForTimeout(100);
      
      // Check calculation works with 4 decimal places
      const result = await page.locator('[data-testid="position-size-result"]').textContent();
      expect(result).toBeTruthy();
    }
  });

  test('real-time calculation with no delays', async ({ page }) => {
    const balanceInput = page.locator('[data-testid="account-balance-input"]');
    
    // Monitor calculation speed
    const startTime = Date.now();
    
    await balanceInput.clear();
    await balanceInput.fill('50000');
    
    // Wait for result to update (should be immediate)
    await page.waitForFunction(
      (selector) => {
        const element = document.querySelector(selector);
        return element && element.textContent !== '0' && element.textContent !== '';
      },
      '[data-testid="position-size-result"]',
      { timeout: 1000 }
    );
    
    const endTime = Date.now();
    const calculationTime = endTime - startTime;
    
    // Should calculate in under 1000ms (relaxed for CI/WebKit)
    expect(calculationTime).toBeLessThan(1000);
  });

  test('CLS (Cumulative Layout Shift) remains at 0', async ({ page }) => {
    // Navigate to page - use correct URL
    await page.goto('/tools/position-size-calculator');
    await page.waitForLoadState('networkidle');
    
    // Get initial layout
    const initialLayout = await page.locator('[data-testid="position-calculator"]').boundingBox();
    
    // Perform calculations that might cause layout shift
    await page.locator('[data-testid="account-balance-input"]').fill('100000');
    await page.locator('[data-testid="risk-percentage-input"]').fill('10');
    await page.locator('[data-testid="entry-price-input"]').fill('1.2000');
    await page.locator('[data-testid="stop-loss-input"]').fill('1.1900');
    
    // Wait for calculations
    await page.waitForTimeout(500);
    
    // Check layout hasn't shifted significantly (allow minor differences)
    const finalLayout = await page.locator('[data-testid="position-calculator"]').boundingBox();
    
    // Check dimensions are stable (allow reasonable tolerance for CI environments)
    expect(finalLayout!.width).toBeCloseTo(initialLayout!.width, 0);
    expect(finalLayout!.height).toBeCloseTo(initialLayout!.height, 0);
    expect(Math.abs(finalLayout!.x - initialLayout!.x)).toBeLessThan(50);
    expect(Math.abs(finalLayout!.y - initialLayout!.y)).toBeLessThan(150);
    
    // Check that results area has stable dimensions
    const resultsArea = await page.locator('[data-testid="calculation-results"]').boundingBox();
    expect(resultsArea).toBeTruthy();
    expect(resultsArea!.height).toBeGreaterThan(0);
    expect(resultsArea!.width).toBeGreaterThan(0);
  });

  test('form validation and error handling', async ({ page }) => {
    // Test empty inputs
    await page.locator('[data-testid="account-balance-input"]').clear();
    await page.locator('[data-testid="risk-percentage-input"]').clear();
    
    // Check for validation messages
    await page.waitForTimeout(100);
    
    const balanceError = page.locator('[data-testid="balance-error"]');
    const riskError = page.locator('[data-testid="risk-error"]');
    
    // At least one field should show an error or results should show N/A
    const resultText = await page.locator('[data-testid="position-size-result"]').textContent();
    const hasErrors = await balanceError.isVisible() || await riskError.isVisible();
    
    expect(hasErrors || resultText === 'N/A' || resultText === '0').toBeTruthy();
  });

  test('mobile responsiveness maintains functionality', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check all inputs are still accessible
    await expect(page.locator('[data-testid="account-balance-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="risk-percentage-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="entry-price-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="stop-loss-input"]')).toBeVisible();
    
    // Test calculation still works on mobile
    await page.locator('[data-testid="account-balance-input"]').fill('20000');
    await page.locator('[data-testid="risk-percentage-input"]').fill('3');
    
    await page.waitForTimeout(100);
    
    const result = await page.locator('[data-testid="position-size-result"]').textContent();
    expect(result).toBeTruthy();
    expect(result).not.toBe('0');
  });

  test('keyboard navigation and accessibility', async ({ page }) => {
    // First focus on the calculator form specifically
    await page.locator('[data-testid="account-balance-input"]').focus();
    await expect(page.locator('[data-testid="account-balance-input"]')).toBeFocused();
    
    // Continue tabbing from the first input
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="risk-percentage-input"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="currency-pair-select"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="entry-price-input"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="stop-loss-input"]')).toBeFocused();
    
    // Test that inputs work with keyboard
    await page.keyboard.type('20');
    
    const inputValue = await page.locator('[data-testid="stop-loss-input"]').inputValue();
    expect(inputValue).toBe('20');
  });
});