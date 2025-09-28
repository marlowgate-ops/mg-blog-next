# Live Popular Rankings - Manual Test Plan

## Prerequisites
- Vercel KV configured (optional - app should work without it)
- @vercel/kv dependency installed
- App deployed to Vercel or running locally

## Test Cases

### 1. Page View Tracking
**Steps:**
1. Navigate to various pages (/, /guides, /reviews, /topics, /best)
2. Check browser DevTools Network tab for POST requests to `/api/metrics/view`
3. Verify requests return `{ ok: true }`
4. Navigate to same page again in same session
5. Verify no duplicate request (session deduplication working)

**Expected:**
- API requests fire on first visit per session
- No duplicate requests in same session
- 400 error for invalid paths
- Graceful handling if API unavailable

### 2. Popular Rankings Display
**Steps:**
1. Visit any page with sidebar (/, /guides, /reviews, /topics, /search, /popular)
2. Check "Popular Articles" widget in sidebar
3. Click on popular article links
4. Visit `/popular` full ranking page

**Expected:**
- Sidebar shows 5 popular items with ranking numbers (#1-#5)
- Items show title and view count
- "すべて見る →" link to `/popular`
- GA4 tracking on clicks
- Fallback data if KV unavailable

### 3. KV Availability Scenarios
**Scenario A - KV Available:**
1. With KV configured, generate some page views
2. Check `/api/metrics/top?limit=10` 
3. Verify live data appears in sidebar

**Scenario B - KV Unavailable:**
1. Without KV configured (or KV down)
2. Check `/api/metrics/view` returns `{ ok: false }`
3. Check `/api/metrics/top` returns fallback data
4. Verify sidebar still works with static data

**Expected:**
- Graceful degradation in both scenarios
- No app crashes or blank states
- API always returns valid JSON

### 4. IP Deduplication
**Steps:**
1. Visit same page multiple times quickly
2. Check API logs for deduplication working
3. Wait 1+ hour and revisit
4. Verify new view tracked

**Expected:**
- Same IP+path deduplicated for 1 hour
- Different paths from same IP tracked separately
- Different IPs always tracked

### 5. Performance & Caching
**Steps:**
1. Check `/api/metrics/top` response headers
2. Verify appropriate cache-control headers
3. Test server-side rendering performance
4. Check build succeeds with 0 warnings

**Expected:**
- Proper cache headers (5min cache, 1min stale-while-revalidate)
- Fast SSR with fallback data
- No build errors or warnings
- Client tracking doesn't block rendering

## Post-Deployment Validation
1. Navigate 3-5 different pages on production
2. Wait 5-10 minutes 
3. Refresh page with sidebar
4. Confirm popular items update (if KV working) or show fallback data
5. Check Vercel Functions logs for API activity