# E2E Testing with Playwright

This directory contains end-to-end tests for the mg-blog-next application using Playwright.

## 🎯 Test Coverage

### Critical User Journeys

1. **News Page (`/news`)**
   - Provider chips filtering with URL reflection
   - Period filter functionality
   - Search functionality with URL parameters
   - Load more pagination
   - Combined filters working together
   - External links security (noopener/noreferrer)

2. **Broker Comparison (`/brokers/compare`)**
   - Facet filtering (regulation, deposit, etc.)
   - Sort functionality
   - Combined facet + sort operations
   - Table row navigation to profiles
   - Table stability during operations
   - URL parameter persistence

3. **Broker Profiles (`/brokers/[slug]`)**
   - Page load with correct broker information
   - Outbound link GA4 event tracking (mocked)
   - Affiliate link security attributes
   - Specification tables and content
   - Pros/cons sections
   - SEO meta tags and structured data

4. **Position Size Calculator (`/tools/position-size`)**
   - Real-time calculation updates
   - Input validation and error handling
   - CLS (Cumulative Layout Shift) prevention
   - Mobile responsiveness
   - Keyboard navigation and accessibility

## 🚀 Running Tests

### Local Development

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug specific test
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### Specific Test Suites

```bash
# Run only smoke tests
npx playwright test smoke

# Run only news page tests
npx playwright test news

# Run only broker tests
npx playwright test broker

# Run only calculator tests
npx playwright test position-calculator
```

### Browser-Specific Testing

```bash
# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📁 Test Structure

```
e2e/
├── global-setup.ts         # Global test setup
├── global-teardown.ts      # Global test cleanup
├── test-helpers.ts         # Common utilities
├── smoke.spec.ts           # Quick smoke tests
├── news.spec.ts           # News page tests
├── brokers-compare.spec.ts # Broker comparison tests
├── broker-profile.spec.ts  # Broker profile tests
└── position-calculator.spec.ts # Calculator tests
```

## 🛠 Configuration

### Playwright Config (`playwright.config.ts`)

- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Reporters**: HTML, JSON, JUnit, GitHub Actions
- **Timeouts**: 30s test, 10s action, 30s navigation
- **Screenshots**: On failure only
- **Videos**: Retain on failure
- **Traces**: On first retry

### Test Data Attributes

Tests use `data-testid` attributes for reliable element selection:

```html
<!-- News page -->
<div data-testid="news-container">
<button data-testid="provider-chip-reuters">
<input data-testid="news-search-input">
<button data-testid="load-more-button">

<!-- Broker comparison -->
<table data-testid="broker-compare-table">
<tr data-testid="broker-table-row">
<select data-testid="filter-regulation">
<select data-testid="sort-select">

<!-- Broker profile -->
<h1 data-testid="broker-name">
<div data-testid="broker-rating">
<a data-testid="broker-visit-button">
<section data-testid="broker-specs-table">

<!-- Position calculator -->
<form data-testid="position-calculator">
<input data-testid="account-balance-input">
<div data-testid="position-size-result">
```

## 🤖 CI/CD Integration

### GitHub Actions Workflow

The E2E tests run automatically on:
- Push to `main`, `develop`, or `feat/**` branches
- Pull requests to `main` or `develop`

### Workflow Features

1. **Multi-browser Testing**: Tests run on Chromium, Firefox, and WebKit
2. **Parallel Execution**: Browsers run in parallel for faster feedback
3. **Artifact Storage**: HTML reports and test results saved for 30 days
4. **Quality Gates**: TypeScript, lint, and build checks
5. **Consolidated Reports**: Combined results from all browsers

### Artifacts

- `playwright-report-{browser}`: Individual browser reports
- `test-results-{browser}`: Raw test results and traces
- `consolidated-playwright-report`: Combined HTML report

## 🔍 Debugging Tests

### Local Debugging

```bash
# Run with debug mode
npm run test:e2e:debug

# Run specific test with debug
npx playwright test news.spec.ts --debug

# View trace for failed tests
npx playwright show-trace test-results/path-to-trace.zip
```

### CI Debugging

1. Download artifacts from GitHub Actions
2. Extract `playwright-report` artifacts
3. Open `index.html` in browser to view detailed results
4. Use trace viewer for step-by-step debugging

## 📊 Test Helpers

### Common Utilities (`test-helpers.ts`)

- `waitForPageLoad()`: Ensure page is fully loaded
- `checkExternalLinkSecurity()`: Verify noopener/noreferrer
- `expectUrlToContainParams()`: URL parameter validation
- `waitForStableElement()`: CLS prevention testing
- `checkBasicAccessibility()`: Basic a11y checks
- `checkSEOTags()`: SEO meta tag validation
- `mockGA4()`: Mock Google Analytics for testing
- `checkStructuredData()`: JSON-LD validation
- `testMobileResponsiveness()`: Multi-viewport testing

## 🎯 Quality Gates

All tests must pass for PR approval:

✅ **Browser Compatibility**: Chrome, Firefox, Safari  
✅ **Mobile Responsiveness**: Phone and tablet viewports  
✅ **Performance**: CLS < 0.05, fast calculations  
✅ **Accessibility**: Basic WCAG compliance  
✅ **SEO**: Meta tags, structured data, sitemaps  
✅ **Security**: External link attributes, CSP compliance  
✅ **Functionality**: All user journeys working  

## 🚨 Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeouts in config or use `waitForLoadState`
2. **Element not found**: Check `data-testid` attributes in components
3. **Flaky tests**: Add proper waits and stability checks
4. **Browser installation**: Run `npx playwright install`

### Performance Issues

- Use `waitForLoadState('networkidle')` for dynamic content
- Add `page.waitForTimeout()` sparingly for animations
- Check for layout shifts with helper functions
- Monitor console errors in tests

### CI-Specific Issues

- Check artifact downloads for detailed reports
- Verify environment variables are set correctly
- Ensure proper Node.js version (20.x)
- Review GitHub Actions logs for setup issues