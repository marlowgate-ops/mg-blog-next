const { test } = require('@playwright/test');
const { execSync } = require('child_process');

/**
 * Smoke tests for forex-brokers-jp page
 * Usage: npm run test:smoke
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Forex Brokers JP - Visual Smoke Tests', () => {
  test.beforeAll('Ensure dev server is running', async () => {
    try {
      // Try to reach the development server
      const response = await fetch(`${BASE_URL}/api/health`).catch(() => null);
      if (!response || !response.ok) {
        console.log('🚀 Starting development server...');
        // Start dev server in background (in real CI, this would be handled separately)
        execSync('npm run dev', { detached: true, stdio: 'ignore' });
        
        // Wait a bit for server to start
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.warn('Could not verify dev server status:', error.message);
      console.log('Assuming server is running or will be started separately');
    }
  });

  test('Desktop - Full page screenshot', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Navigate to forex brokers page
    await page.goto(`${BASE_URL}/best/forex-brokers-jp`, { 
      waitUntil: 'networkidle' 
    });
    
    // Wait for key elements to load
    await page.waitForSelector('[data-testid="ranking-card"]', { timeout: 10000 });
    await page.waitForSelector('.section-band', { timeout: 5000 });
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'screenshots/desktop-full.png', 
      fullPage: true 
    });
    
    console.log('📸 Desktop full page screenshot saved');
  });

  test('Mobile - Full page screenshot', async ({ page }) => {
    // Set mobile viewport (iPhone 13)
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Navigate to forex brokers page
    await page.goto(`${BASE_URL}/best/forex-brokers-jp`, { 
      waitUntil: 'networkidle' 
    });
    
    // Wait for key elements to load
    await page.waitForSelector('[data-testid="ranking-card"]', { timeout: 10000 });
    await page.waitForSelector('.section-band', { timeout: 5000 });
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'screenshots/mobile-full.png', 
      fullPage: true 
    });
    
    console.log('📸 Mobile full page screenshot saved');
  });

  test('Desktop - Above fold screenshot', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Navigate to forex brokers page
    await page.goto(`${BASE_URL}/best/forex-brokers-jp`, { 
      waitUntil: 'networkidle' 
    });
    
    // Wait for hero content and first ranking card
    await page.waitForSelector('h1', { timeout: 10000 });
    await page.waitForSelector('[data-testid="ranking-card"]', { timeout: 10000 });
    
    // Take viewport screenshot (above fold)
    await page.screenshot({ 
      path: 'screenshots/desktop-above-fold.png',
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });
    
    console.log('📸 Desktop above-fold screenshot saved');
  });

  test('Mobile - Above fold screenshot', async ({ page }) => {
    // Set mobile viewport (iPhone 13)
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Navigate to forex brokers page
    await page.goto(`${BASE_URL}/best/forex-brokers-jp`, { 
      waitUntil: 'networkidle' 
    });
    
    // Wait for hero content and first ranking card
    await page.waitForSelector('h1', { timeout: 10000 });
    await page.waitForSelector('[data-testid="ranking-card"]', { timeout: 10000 });
    
    // Take viewport screenshot (above fold)
    await page.screenshot({ 
      path: 'screenshots/mobile-above-fold.png',
      clip: { x: 0, y: 0, width: 390, height: 844 }
    });
    
    console.log('📸 Mobile above-fold screenshot saved');
  });

  test('Core elements are present', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Navigate to forex brokers page
    await page.goto(`${BASE_URL}/best/forex-brokers-jp`, { 
      waitUntil: 'networkidle' 
    });
    
    // Check for essential page elements
    await page.waitForSelector('h1', { timeout: 10000 });
    await page.waitForSelector('[data-testid="ranking-card"]', { timeout: 10000 });
    await page.waitForSelector('.section-band', { timeout: 5000 });
    
    // Check for badges (if any)
    const badges = await page.locator('.badge').count();
    console.log(`🏅 Found ${badges} badge(s) on page`);
    
    // Check for scoring disclosure
    const disclosure = await page.locator('[data-testid="scoring-disclosure"]').count();
    console.log(`📊 Scoring disclosure present: ${disclosure > 0 ? 'Yes' : 'No'}`);
    
    // Check for TOC
    const toc = await page.locator('[data-testid="toc-card"]').count();
    console.log(`📑 Table of contents present: ${toc > 0 ? 'Yes' : 'No'}`);
    
    console.log('✅ All core elements found');
  });
});