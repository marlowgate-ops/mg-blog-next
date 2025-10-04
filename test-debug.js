/* eslint-disable @typescript-eslint/no-var-requires */
const { chromium } = require('playwright');

async function debugCombinedFilters() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://127.0.0.1:3000/news');
  await page.waitForLoadState('networkidle');
  console.log('1. Initial URL:', page.url());
  
  // Step 1: Apply provider filter
  console.log('2. Clicking bloomberg provider chip...');
  await page.locator('[data-testid="provider-chip-bloomberg"]').first().click();
  await page.waitForTimeout(1000); // Wait for URL update
  console.log('3. URL after provider:', page.url());
  
  // Step 2: Apply period filter  
  console.log('4. Selecting week period...');
  await page.locator('[data-testid="period-select"]').selectOption('week');
  await page.waitForTimeout(1000); // Wait for URL update
  console.log('5. URL after period:', page.url());
  
  // Step 3: Apply search
  console.log('6. Entering search term...');
  const searchInput = page.locator('[data-testid="news-search-input"]');
  await searchInput.fill('market');
  await searchInput.press('Enter');
  await page.waitForTimeout(1000); // Wait for URL update
  console.log('7. URL after search:', page.url());
  
  await page.waitForTimeout(5000); // Wait to observe
  await browser.close();
}

debugCombinedFilters().catch(console.error);