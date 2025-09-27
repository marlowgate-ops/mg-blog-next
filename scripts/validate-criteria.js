#!/usr/bin/env node
// scripts/validate-criteria.js
// Development validation script for evaluation criteria JSON

const fs = require('fs');
const path = require('path');

const CRITERIA_PATH = path.join(__dirname, '../data/eval/criteria.json');
const OVERRIDES_DIR = path.join(__dirname, '../data/eval/overrides');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function validateCriteriaFile(filePath) {
  const errors = [];
  const warnings = [];
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      errors.push(`File not found: ${filePath}`);
      return { errors, warnings, data: null };
    }
    
    // Parse JSON
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Validate required fields
    if (!data.version) {
      errors.push('Missing required field: version');
    }
    
    if (!data.lastUpdated) {
      errors.push('Missing required field: lastUpdated');
    } else {
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.lastUpdated)) {
        warnings.push(`lastUpdated should be in YYYY-MM-DD format, got: ${data.lastUpdated}`);
      }
    }
    
    if (!data.weights) {
      errors.push('Missing required field: weights');
    } else {
      // Validate weights
      const weights = data.weights;
      const expectedKeys = ['cost', 'reliability', 'app', 'spread'];
      
      // Check for all required weight keys
      for (const key of expectedKeys) {
        if (!(key in weights)) {
          errors.push(`Missing weight: ${key}`);
        } else if (typeof weights[key] !== 'number') {
          errors.push(`Weight ${key} must be a number`);
        } else if (weights[key] < 0 || weights[key] > 1) {
          errors.push(`Weight ${key} must be between 0 and 1`);
        }
      }
      
      // Check weight sum
      const weightSum = Object.values(weights).reduce((sum, weight) => {
        return sum + (typeof weight === 'number' ? weight : 0);
      }, 0);
      
      if (Math.abs(weightSum - 1.0) > 0.01) {
        errors.push(`Weights must sum to 1.0, got: ${weightSum.toFixed(3)}`);
      }
    }
    
    // Validate badges
    if (data.badges) {
      for (const [badgeKey, badge] of Object.entries(data.badges)) {
        if (!badge.minScore) {
          errors.push(`Badge ${badgeKey}: missing minScore`);
        } else if (typeof badge.minScore !== 'number') {
          errors.push(`Badge ${badgeKey}: minScore must be a number`);
        } else if (badge.minScore < 0 || badge.minScore > 5) {
          errors.push(`Badge ${badgeKey}: minScore must be between 0 and 5`);
        }
        
        if (!badge.label) {
          errors.push(`Badge ${badgeKey}: missing label`);
        }
        
        if (!badge.description) {
          errors.push(`Badge ${badgeKey}: missing description`);
        }
      }
    }
    
    return { errors, warnings, data };
    
  } catch (e) {
    if (e instanceof SyntaxError) {
      errors.push(`JSON syntax error: ${e.message}`);
    } else {
      errors.push(`Validation error: ${e.message}`);
    }
    return { errors, warnings, data: null };
  }
}

function main() {
  log(colors.blue + colors.bold, '🔍 Validating evaluation criteria files...\n');
  
  let totalErrors = 0;
  let totalWarnings = 0;
  
  // Validate base criteria
  log(colors.bold, '📋 Base criteria (criteria.json):');
  const baseResult = validateCriteriaFile(CRITERIA_PATH);
  
  if (baseResult.errors.length > 0) {
    baseResult.errors.forEach(error => {
      log(colors.red, `  ❌ ${error}`);
    });
    totalErrors += baseResult.errors.length;
  }
  
  if (baseResult.warnings.length > 0) {
    baseResult.warnings.forEach(warning => {
      log(colors.yellow, `  ⚠️  ${warning}`);
    });
    totalWarnings += baseResult.warnings.length;
  }
  
  if (baseResult.errors.length === 0 && baseResult.warnings.length === 0) {
    log(colors.green, '  ✅ Valid');
  }
  
  console.log();
  
  // Validate overrides
  if (fs.existsSync(OVERRIDES_DIR)) {
    log(colors.bold, '📝 Override files:');
    const overrideFiles = fs.readdirSync(OVERRIDES_DIR).filter(file => file.endsWith('.json'));
    
    if (overrideFiles.length === 0) {
      log(colors.blue, '  📁 No override files found');
    } else {
      overrideFiles.forEach(fileName => {
        const filePath = path.join(OVERRIDES_DIR, fileName);
        const result = validateCriteriaFile(filePath);
        
        log(colors.bold, `  ${fileName}:`);
        
        if (result.errors.length > 0) {
          result.errors.forEach(error => {
            log(colors.red, `    ❌ ${error}`);
          });
          totalErrors += result.errors.length;
        }
        
        if (result.warnings.length > 0) {
          result.warnings.forEach(warning => {
            log(colors.yellow, `    ⚠️  ${warning}`);
          });
          totalWarnings += result.warnings.length;
        }
        
        if (result.errors.length === 0 && result.warnings.length === 0) {
          log(colors.green, '    ✅ Valid');
        }
      });
    }
  }
  
  console.log();
  
  // Summary
  log(colors.bold, '📊 Summary:');
  if (totalErrors === 0 && totalWarnings === 0) {
    log(colors.green, '🎉 All criteria files are valid!');
    process.exit(0);
  } else {
    if (totalErrors > 0) {
      log(colors.red, `❌ ${totalErrors} error(s) found`);
    }
    if (totalWarnings > 0) {
      log(colors.yellow, `⚠️  ${totalWarnings} warning(s) found`);
    }
    
    if (totalErrors > 0) {
      log(colors.red, '\n💡 Fix errors before proceeding. See data/eval/README.md for guidance.');
      process.exit(1);
    } else {
      log(colors.yellow, '\n💡 Consider addressing warnings for better consistency.');
      process.exit(0);
    }
  }
}

// Legacy export for compatibility
function validateCriteria() {
  const result = validateCriteriaFile(CRITERIA_PATH);
  if (result.errors.length > 0) {
    console.error('❌ Criteria validation failed:');
    result.errors.forEach(error => console.error(`   ${error}`));
    return false;
  }
  
  console.log('✅ Criteria validation passed');
  if (result.data) {
    console.log(`   Version: ${result.data.version}`);
    if (result.data.weights) {
      console.log(`   Weights: ${Object.entries(result.data.weights).map(([k,v]) => `${k}=${v}`).join(', ')}`);
    }
  }
  return true;
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateCriteria };