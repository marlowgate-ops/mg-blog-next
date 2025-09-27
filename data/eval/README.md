# Evaluation Criteria Editor Guide

This guide explains how to maintain and adjust the evaluation criteria and scoring system.

## File Structure

```
data/eval/
├── criteria.json          # Base evaluation criteria
├── criteria.schema.json   # JSON schema for validation
├── overrides/             # Per-page criteria overrides
│   └── low-spread.json    # Example: adjusted weights for spread-focused pages
└── README.md             # This file
```

## Base Criteria (criteria.json)

The main criteria file defines:

- **Weights**: How much each dimension contributes to the overall score (must sum to 1.0)
- **Badges**: Score thresholds and labels for broker achievements
- **Categories**: Descriptions and metadata for each evaluation dimension

### Weights

```json
{
  "weights": {
    "cost": 0.35,        // Transaction costs, fees
    "reliability": 0.25, // Execution quality, slippage
    "app": 0.20,         // Mobile app usability
    "spread": 0.20       // Spread competitiveness
  }
}
```

**Important**: Weights must sum to 1.0 (±0.01). The system validates this on build.

### Badges

Badges are awarded when brokers meet minimum score thresholds:

```json
{
  "badges": {
    "low_spread": {
      "minScore": 4.5,
      "label": "低スプレッド",
      "description": "スプレッドが狭く、短期取引に適している"
    }
  }
}
```

## Page-Specific Overrides

Create override files in `overrides/` directory for pages that need different criteria:

### Naming Convention
- File name matches the page slug
- Example: `low-spread.json` for `/best/low-spread` page

### Override Structure
Override files use partial updates - only specify what changes:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-09-27",
  "weights": {
    "cost": 0.30,    // Reduce cost weight
    "spread": 0.35   // Emphasize spread for this page
    // Other weights inherit from base criteria
  },
  "badges": {
    "ultra_low_spread": {
      "minScore": 4.8,
      "label": "極狭スプレッド",
      "description": "業界最狭水準のスプレッドを提供"
    }
    // Existing badges are merged with base criteria
  }
}
```

## Validation

Run validation to check criteria files:

```bash
npm run validate:criteria
```

This command:
1. Validates JSON schema compliance
2. Checks weight sums equal 1.0
3. Verifies badge score thresholds are valid (0-5)
4. Reports any inconsistencies

## Making Changes

### 1. Adjust Base Weights
Edit `criteria.json` weights section. Remember:
- All weights must sum to 1.0
- Use decimals (0.35 not 35)
- Update `lastUpdated` date

### 2. Add New Badges
Add to `criteria.json` badges section:
```json
"new_badge_key": {
  "minScore": 4.0,
  "label": "Display Name", 
  "description": "Explanation for users"
}
```

### 3. Create Page Overrides
1. Create `overrides/page-slug.json`
2. Include only changed properties
3. Validate with `npm run validate:criteria`

### 4. Update Descriptions
Edit the `categories` section in `criteria.json` to update dimension descriptions shown in the UI.

## Usage in Code

The evaluation system automatically:
- Loads base criteria from `criteria.json`
- Applies page-specific overrides when available
- Falls back gracefully if files are missing

Functions accept optional `pageSlug` parameter:
```typescript
const badges = getBrokerBadges(score, 'low-spread');
const meta = getEvaluationMeta('low-spread');
```

## Best Practices

1. **Test Changes**: Always run `npm run validate:criteria` after edits
2. **Document Changes**: Update `lastUpdated` and `version` fields
3. **Weight Balance**: Avoid extreme weights (e.g., >0.5 for any single dimension)
4. **Badge Thresholds**: Use meaningful score ranges (typically 4.0-4.8 range)
5. **Consistent Naming**: Use snake_case for badge keys, descriptive labels

## Troubleshooting

### Weight Sum Error
```
Evaluation weights sum to 1.05, expected 1.0
```
**Solution**: Adjust weights to sum exactly to 1.0

### Schema Validation Failed
**Solution**: Check JSON syntax and required fields against `criteria.schema.json`

### Missing Override File
**Solution**: Normal behavior - system falls back to base criteria if override doesn't exist