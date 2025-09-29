import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const urls = [
  { path: '/', name: 'home' },
  { path: '/best/forex-brokers-jp', name: 'forex-brokers' }
];

const viewports = [
  { width: 1280, height: 900, name: 'desktop' },
  { width: 390, height: 844, name: 'mobile' }
];

async function captureScreenshots() {
  const browser = await chromium.launch();
  
  // Create shots directory
  await fs.mkdir('docs/shots', { recursive: true });
  
  // Capture "Before" screenshots from main branch
  console.log('Capturing "Before" screenshots from production...');
  for (const url of urls) {
    for (const viewport of viewports) {
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height }
      });
      
      await page.goto(`https://marlowgate.com${url.path}`);
      await page.waitForLoadState('networkidle');
      
      const filename = `before-${url.name}-${viewport.name}.png`;
      await page.screenshot({ 
        path: path.join('docs/shots', filename),
        fullPage: true
      });
      
      console.log(`✓ Captured ${filename}`);
      await page.close();
    }
  }
  
  // Capture "After" screenshots from localhost (would need dev server running)
  console.log('Note: "After" screenshots require local dev server running');
  console.log('Run: npm run dev, then manually capture localhost:3000 screenshots');
  
  await browser.close();
}

captureScreenshots().catch(console.error);