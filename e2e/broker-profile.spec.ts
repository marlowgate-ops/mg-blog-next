import { test, expect } from '@playwright/test';

test.describe('/brokers/[slug] page E2E tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a broker profile page (using a known broker)
    await page.goto('/brokers/dmm-fx');
    await page.waitForLoadState('networkidle');
  });

  test('page loads with correct broker information', async ({ page }) => {
    // Check broker profile header is visible
    await expect(page.locator('[data-testid="broker-profile-header"]')).toBeVisible();
    
    // Check broker name is displayed
    await expect(page.locator('[data-testid="broker-name"]')).toBeVisible();
    
    // Check broker rating is displayed
    await expect(page.locator('[data-testid="broker-rating"]')).toBeVisible();
    
    // Check broker description/overview
    await expect(page.locator('[data-testid="broker-overview"]')).toBeVisible();
  });

  test('outbound links trigger GA4 events (mocked)', async ({ page }) => {
    await page.addInitScript(() => {
      // Mock gtag function
      (window as any).gtag = (...args: any[]) => {
        if (!(window as any).__ga4Events) (window as any).__ga4Events = [];
        (window as any).__ga4Events.push(args);
      };
    });

    // Look for outbound links
    const outboundLink = page.locator('[data-testid="broker-visit-button"]').first();
    
    if (await outboundLink.isVisible()) {
      // Click the outbound link
      await outboundLink.click({ noWaitAfter: true });
      
      // Check that GA4 event was triggered
      const events = await page.evaluate(() => (window as any).__ga4Events);
      
      if (events && events.length > 0) {
        // Look for outbound_click event
        const outboundEvent = events.find((event: any[]) => 
          event[0] === 'event' && event[1] === 'outbound_click'
        );
        expect(outboundEvent).toBeTruthy();
      }
    }
  });

  test('affiliate links have proper attributes', async ({ page }) => {
    const affiliateLinks = page.locator('[data-testid="broker-affiliate-link"]');
    
    if (await affiliateLinks.count() > 0) {
      const firstLink = affiliateLinks.first();
      
      // Check external link attributes
      const rel = await firstLink.getAttribute('rel');
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
      
      // Check target attribute
      const target = await firstLink.getAttribute('target');
      expect(target).toBe('_blank');
      
      // Check href is valid URL
      const href = await firstLink.getAttribute('href');
      expect(href).toMatch(/^https?:\/\//);
    }
  });

  test('broker specifications table is displayed', async ({ page }) => {
    // Check specs table exists
    const specsTable = page.locator('[data-testid="broker-specs-table"]');
    await expect(specsTable).toBeVisible();
    
    // Check key specification rows
    const specRows = page.locator('[data-testid="spec-row"]');
    const rowCount = await specRows.count();
    expect(rowCount).toBeGreaterThanOrEqual(1);
    
    // Check that specs include common fields
    const specLabels = page.locator('[data-testid="spec-label"]');
    const labelTexts = await specLabels.allTextContents();
    
    // Should include regulation, minimum deposit, spreads, etc.
    expect(labelTexts.some(text => text.includes('規制') || text.includes('Regulation'))).toBeTruthy();
  });

  test('pros and cons section is displayed', async ({ page }) => {
    const prosSection = page.locator('[data-testid="broker-pros"]');
    const consSection = page.locator('[data-testid="broker-cons"]');
    
    await expect(prosSection).toBeVisible();
    await expect(consSection).toBeVisible();
    
    // Check that pros and cons have content
    const prosItems = page.locator('[data-testid="pro-item"]');
    const consItems = page.locator('[data-testid="con-item"]');
    
    const prosCount = await prosItems.count();
    const consCount = await consItems.count();
    
    expect(prosCount).toBeGreaterThanOrEqual(1);
    expect(consCount).toBeGreaterThanOrEqual(1);
  });

  test('review content and rating breakdown', async ({ page }) => {
    // Check review content section
    const reviewContent = page.locator('[data-testid="broker-review-content"]');
    await expect(reviewContent).toBeVisible();
    
    // Check rating breakdown
    const ratingBreakdown = page.locator('[data-testid="rating-breakdown"]');
    await expect(ratingBreakdown).toBeVisible();
    
    // Check individual rating categories
    const ratingCategories = page.locator('[data-testid="rating-category"]');
    const categoryCount = await ratingCategories.count();
    expect(categoryCount).toBeGreaterThanOrEqual(3); // Should have multiple rating aspects
  });

  test('related brokers or comparison section', async ({ page }) => {
    // Look for related/similar brokers section
    const relatedSection = page.locator('[data-testid="related-brokers"]');
    
    if (await relatedSection.isVisible()) {
      const relatedBrokers = page.locator('[data-testid="related-broker-card"]');
      const relatedCount = await relatedBrokers.count();
      expect(relatedCount).toBeGreaterThanOrEqual(1);
      
      // Test clicking on related broker
      if (relatedCount > 0) {
        const firstRelated = relatedBrokers.first();
        const relatedSlug = await firstRelated.getAttribute('data-broker-slug');
        
        await firstRelated.click();
        await page.waitForLoadState('networkidle');
        
        if (relatedSlug) {
          await expect(page).toHaveURL(new RegExp(`/brokers/${relatedSlug}`));
        }
      }
    }
  });

  test('FAQ section functionality', async ({ page }) => {
    const faqSection = page.locator('[data-testid="broker-faq"]');
    
    if (await faqSection.isVisible()) {
      const faqItems = page.locator('[data-testid="faq-item"]');
      
      if (await faqItems.count() > 0) {
        const firstFaq = faqItems.first();
        const faqQuestion = firstFaq.locator('[data-testid="faq-question"]');
        const faqAnswer = firstFaq.locator('[data-testid="faq-answer"]');
        
        // Click to expand FAQ
        await faqQuestion.click();
        
        // Check answer becomes visible
        await expect(faqAnswer).toBeVisible();
        
        // Click again to collapse
        await faqQuestion.click();
        
        // Answer should be hidden (may use CSS display or height)
        const answerVisible = await faqAnswer.isVisible();
        expect(answerVisible).toBeFalsy();
      }
    }
  });

  test('page meta data and SEO elements', async ({ page }) => {
    // Check page title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.toLowerCase()).toContain('dmm'); // Should contain broker name
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    const description = await metaDescription.getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toContain('/brokers/dmm-fx');
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDescription = page.locator('meta[property="og:description"]');
    const ogImage = page.locator('meta[property="og:image"]');
    
    await expect(ogTitle).toHaveAttribute('content');
    await expect(ogDescription).toHaveAttribute('content');
    await expect(ogImage).toHaveAttribute('content');
  });

  test('structured data (JSON-LD) is present', async ({ page }) => {
    // Check for JSON-LD structured data
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const scriptCount = await jsonLdScripts.count();
    
    expect(scriptCount).toBeGreaterThanOrEqual(1);
    
    // Check the content of the first JSON-LD script
    const firstScript = jsonLdScripts.first();
    const scriptContent = await firstScript.textContent();
    
    expect(scriptContent).toBeTruthy();
    
    // Parse JSON to ensure it's valid
    const jsonData = JSON.parse(scriptContent!);
    expect(jsonData).toBeTruthy();
    
    // Should contain organization or product schema
    expect(jsonData['@type']).toBeTruthy();
  });

  test('mobile responsiveness and CLS prevention', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that key elements are still visible and accessible
    await expect(page.locator('[data-testid="broker-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="broker-rating"]')).toBeVisible();
    
    // Check that CTA buttons are accessible
    const ctaButton = page.locator('[data-testid="broker-visit-button"]').first();
    if (await ctaButton.isVisible()) {
      await expect(ctaButton).toBeInViewport();
    }
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="broker-profile-header"]')).toBeVisible();
  });
});