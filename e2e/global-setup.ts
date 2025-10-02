import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E tests global setup...');
  
  // Launch browser for initial setup if needed
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Wait for the app to be ready
  const baseURL = config.projects[0].use.baseURL || process.env.BASE_URL || 'http://localhost:3100';
  
  try {
    // Health check - wait for the app to respond
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    console.log('✅ Application is ready for testing');
    
    // You can add any global setup here like:
    // - Authentication setup
    // - Database seeding
    // - Mock service setup
    
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;