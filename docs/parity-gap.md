# Parity Gap Analysis: Marlowgate vs Minkabu

## Executive Summary

Analysis of structural and UX parity between [marlowgate.com](https://marlowgate.com/) and [minkabu.jp](https://minkabu.jp/) to identify gaps in information architecture, content density, and user experience optimization.

**Assessment Date:** September 29, 2025  
**Target Pages:** Homepage (`/`) and Primary Ranking (`/best/forex-brokers-jp`)  
**Scope:** IA, navigation, content layout, data density, sidebar widgets, ranking presentation

---

## Key Findings & Priority Gaps

### 1. **Data Density & Information Architecture** ⭐ HIGH PRIORITY
- **Gap**: Minkabu shows 10+ data sections on homepage vs our 3 sections
- **Issue**: Sparse content layout, underutilized screen real estate
- **Action**: Add market data widgets, more ranking previews, recent news density

### 2. **Homepage Content Hierarchy** ⭐ HIGH PRIORITY  
- **Gap**: Missing ranking tables, market indicators, realtime data
- **Current**: Simple hero + 3 article cards + basic sidebar
- **Target**: Dense tabular data + multiple ranking previews + market widgets
- **Action**: Implement ranking table previews, add market data sections

### 3. **Sidebar Widget Density** ⭐ MEDIUM PRIORITY
- **Gap**: Their sidebar has 6+ widget types vs our 2-3
- **Missing**: Recent rankings, market data, tools, category quick-nav
- **Action**: Add ranking widgets, market data displays, navigation shortcuts

### 4. **Navigation Depth** ⭐ MEDIUM PRIORITY
- **Gap**: Minkabu has deeper categorization in header nav
- **Current**: 4 main nav items (best/reviews/guides/news)
- **Target**: Sub-navigation menus, category drill-downs
- **Action**: Add dropdown menus with sub-categories

### 5. **Ranking Page Information Density** ⭐ HIGH PRIORITY
- **Gap**: Our ranking lacks comparison tables, technical specs, charts
- **Current**: Cards + basic specs table
- **Target**: Dense comparison matrix + multiple data views
- **Action**: Enhance comparison table, add technical specification views

---

## Specific Implementation Actions

### Action 1: Homepage Data Density Enhancement
**File**: `app/page.tsx`
**Change**: Add 3 new content sections
```tsx
// Add market data preview section
<section className="market-data-preview">
  <MarketDataWidget />
  <TopRankingsPreview />
  <RecentNewsGrid />
</section>
```

### Action 2: Sidebar Widget Expansion  
**File**: `components/Sidebar.tsx`  
**Change**: Add 4 new widget components
```tsx
// Add to sidebar stack
<PopularRankings />
<MarketIndicators />  
<CategoryQuickNav />
<RecentUpdates />
```

### Action 3: Ranking Table Enhancement
**File**: `app/best/forex-brokers-jp/page.tsx`
**Change**: Replace basic table with dense comparison matrix
```tsx
// Enhance comparison table density
<ComparisonTableDense 
  viewMode="detailed" 
  showTechnicalSpecs={true}
  includePriceData={true} 
/>
```

### Action 4: Navigation Menu Depth
**File**: `components/Header.tsx`  
**Change**: Add dropdown submenus
```tsx
<DropdownMenu title="比較">
  <MenuItem href="/best/forex-brokers-jp">国内FX業者</MenuItem>
  <MenuItem href="/best/insurance">保険比較</MenuItem>
  <MenuItem href="/best/low-spread">低スプレッド</MenuItem>
</DropdownMenu>
```

### Action 5: Content Section Ordering
**File**: `app/best/forex-brokers-jp/page.tsx`  
**Change**: Reorder sections to match target flow
```tsx
// Target order: Hero → RankingList → CompareTable → EvaluationRules → EditorialBlock → LongForm → FAQ → Recirculation → Disclaimer
```

### Action 6: Market Data Integration
**Files**: `components/MarketDataWidget.tsx` (new)  
**Change**: Create realtime data display component
```tsx
export function MarketDataWidget() {
  // USDJPY, market indices, trend indicators
}
```

### Action 7: Ranking Preview Cards
**File**: `components/TopRankingsPreview.tsx` (new)
**Change**: Add condensed ranking displays for homepage
```tsx
export function TopRankingsPreview() {
  // Top 3 from each category in card grid
}
```

### Action 8: News Grid Density  
**File**: `components/NewsGrid.tsx` (new)
**Change**: Increase news item density (8-10 items vs current 3)
```tsx
<NewsGrid items={newsItems.slice(0, 10)} layout="dense" />
```

### Action 9: Breadcrumb Enhancement
**File**: `components/Breadcrumbs.tsx`
**Change**: Add structured data markup, consistent styling
```tsx
// Add JSON-LD BreadcrumbList schema
// Ensure consistent styling across all pages
```

### Action 10: Mobile Responsiveness Parity
**File**: Global CSS and component modules
**Change**: Ensure mobile layouts match desktop information density
```css
/* Maintain data density on mobile viewports */
@media (max-width: 768px) {
  .ranking-table { overflow-x: auto; }
  .sidebar-widgets { transform: none; }
}
```

---

## Priority Implementation Order

1. **P0** (This Sprint): Actions 1, 2, 5 - Homepage content density
2. **P1** (Next Sprint): Actions 3, 4 - Navigation and ranking tables  
3. **P2** (Future): Actions 6, 7, 8 - Market data integration
4. **P3** (Polish): Actions 9, 10 - Schema and mobile optimization

---

## Success Metrics

- **Content Density**: 8+ homepage sections (current: 3)
- **Sidebar Widgets**: 5+ widget types (current: 2) 
- **Ranking Data Points**: 10+ comparison columns (current: 6)
- **Navigation Depth**: 3-level menu hierarchy (current: 2)
- **Page Load Time**: Maintain <2s despite increased density

---

## Notes & Constraints

- Must maintain current performance metrics (CLS < 0.05)
- All additions must follow existing design system
- Preserve current SEO performance and schema markup
- Market data integration requires external API evaluation
- Mobile experience must not degrade with increased density