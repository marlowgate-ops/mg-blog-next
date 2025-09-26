#!/usr/bin/env node
// scripts/validate-criteria.js
// Development validation script for evaluation criteria JSON

const fs = require('fs');
const path = require('path');

const CRITERIA_PATH = path.join(__dirname, '../data/eval/criteria.json');

function validateCriteria() {
  console.log('🔍 Validating evaluation criteria...');
  
  try {
    // Load JSON
    const rawData = fs.readFileSync(CRITERIA_PATH, 'utf8');
    const criteria = JSON.parse(rawData);
    
    // Validate required fields
    if (!criteria.version) {
      throw new Error('Missing required field: version');
    }
    
    if (!criteria.weights) {
      throw new Error('Missing required field: weights');
    }
    
    // Validate weights
    const requiredWeights = ['cost', 'reliability', 'app', 'spread'];
    const presentWeights = Object.keys(criteria.weights);
    
    for (const required of requiredWeights) {
      if (!(required in criteria.weights)) {
        throw new Error(`Missing required weight: ${required}`);
      }
      
      const weight = criteria.weights[required];
      if (typeof weight !== 'number' || weight < 0 || weight > 1) {
        throw new Error(`Invalid weight for ${required}: ${weight} (must be 0-1)`);
      }
    }
    
    // Validate weight sum
    const weightSum = Object.values(criteria.weights).reduce((sum, w) => sum + w, 0);
    if (Math.abs(weightSum - 1.0) > 0.01) {
      throw new Error(`Weights sum to ${weightSum}, expected 1.0 (±0.01)`);
    }
    
    // Validate badges (if present)
    if (criteria.badges) {
      for (const [badgeKey, badge] of Object.entries(criteria.badges)) {
        if (!/^[a-z][a-z0-9_]*$/.test(badgeKey)) {
          throw new Error(`Invalid badge key format: ${badgeKey}`);
        }
        
        if (typeof badge.minScore !== 'number' || badge.minScore < 0 || badge.minScore > 5) {
          throw new Error(`Invalid minScore for badge ${badgeKey}: ${badge.minScore}`);
        }
        
        if (!badge.label || typeof badge.label !== 'string') {
          throw new Error(`Missing or invalid label for badge ${badgeKey}`);
        }
      }
    }
    
    console.log('✅ Criteria validation passed');
    console.log(`   Version: ${criteria.version}`);
    console.log(`   Weights: ${Object.entries(criteria.weights).map(([k,v]) => `${k}=${v}`).join(', ')}`);
    console.log(`   Weight sum: ${weightSum.toFixed(3)}`);
    
    if (criteria.badges) {
      console.log(`   Badges: ${Object.keys(criteria.badges).length} defined`);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Criteria validation failed:');
    console.error(`   ${error.message}`);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  const isValid = validateCriteria();
  process.exit(isValid ? 0 : 1);
}

module.exports = { validateCriteria };