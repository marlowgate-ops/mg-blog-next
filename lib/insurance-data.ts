import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';
import { InsuranceProduct, InsuranceCategory, InsuranceCompareFilters } from '../content_source/insurance/insurance.schema';

const INSURANCE_DATA_DIR = path.join(process.cwd(), 'content_source', 'insurance');

let insuranceCache: InsuranceProduct[] | null = null;

export function loadInsuranceProducts(): InsuranceProduct[] {
  if (insuranceCache) {
    return insuranceCache;
  }

  const products: InsuranceProduct[] = [];
  
  try {
    const files = fs.readdirSync(INSURANCE_DATA_DIR);
    
    for (const file of files) {
      if (file.endsWith('.yml') || file.endsWith('.yaml')) {
        const filePath = path.join(INSURANCE_DATA_DIR, file);
        
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const parsed = parse(content) as InsuranceProduct[];
          
          if (Array.isArray(parsed)) {
            for (const product of parsed) {
              if (product && product.slug) {
                // Calculate score_total if scores exist
                if (product.scores && !product.score_total) {
                  const scores = product.scores;
                  const validScores = [scores.cost, scores.coverage, scores.service, scores.claim].filter(s => typeof s === 'number');
                  if (validScores.length > 0) {
                    product.score_total = validScores.reduce((a, b) => a + b, 0) / validScores.length;
                  }
                }
                products.push(product);
              }
            }
          }
        } catch (parseError) {
          console.warn(`Failed to parse insurance document in ${file}:`, parseError);
        }
      }
    }
    
    insuranceCache = products;
    return products;
  } catch (error) {
    console.error('Failed to load insurance products:', error);
    return [];
  }
}

export function getInsuranceProduct(slug: string): InsuranceProduct | null {
  const products = loadInsuranceProducts();
  return products.find(p => p.slug === slug) || null;
}

export function getInsuranceProductsByCategory(category: InsuranceCategory): InsuranceProduct[] {
  const products = loadInsuranceProducts();
  return products.filter(p => p.category === category);
}

export function filterInsuranceProducts(filters: InsuranceCompareFilters): InsuranceProduct[] {
  let products = getInsuranceProductsByCategory(filters.category);
  
  // Apply coverage filter
  if (filters.coverage && filters.coverage.length > 0) {
    products = products.filter(p => 
      filters.coverage!.some(c => p.coverage.some(pc => pc.toLowerCase().includes(c.toLowerCase())))
    );
  }
  
  // Apply age range filter
  if (filters.age_range) {
    products = products.filter(p => {
      if (filters.age_range!.min && p.age_range.max < filters.age_range!.min) return false;
      if (filters.age_range!.max && p.age_range.min > filters.age_range!.max) return false;
      return true;
    });
  }
  
  // Apply deductible filter
  if (filters.deductible_max && typeof filters.deductible_max === 'number') {
    products = products.filter(p => !p.deductible || p.deductible <= filters.deductible_max!);
  }
  
  // Apply premium filter
  if (filters.premium_max && typeof filters.premium_max === 'number') {
    products = products.filter(p => p.premium_from <= filters.premium_max!);
  }
  
  // Apply methods filter
  if (filters.apply_methods && filters.apply_methods.length > 0) {
    products = products.filter(p => 
      filters.apply_methods!.some(m => p.apply_methods.includes(m as any))
    );
  }
  
  // Apply search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    products = products.filter(p => 
      p.brand.toLowerCase().includes(searchTerm) ||
      p.coverage.some(c => c.toLowerCase().includes(searchTerm)) ||
      (p.notes && p.notes.toLowerCase().includes(searchTerm)) ||
      (p.special_features && p.special_features.some(f => f.toLowerCase().includes(searchTerm)))
    );
  }
  
  // Apply sorting
  if (filters.sort) {
    products = [...products].sort((a, b) => {
      switch (filters.sort) {
        case 'cost_asc':
          return a.premium_from - b.premium_from;
        case 'cost_desc':
          return b.premium_from - a.premium_from;
        case 'score_desc':
          return (b.score_total || 0) - (a.score_total || 0);
        case 'coverage_desc':
          return b.coverage.length - a.coverage.length;
        case 'brand_asc':
          return a.brand.localeCompare(b.brand, 'ja');
        default:
          return 0;
      }
    });
  }
  
  return products;
}

export function getInsuranceCategories(): { value: InsuranceCategory; label: string }[] {
  return [
    { value: 'life', label: '生命保険' },
    { value: 'medical', label: '医療保険' },
    { value: 'auto', label: '自動車保険' },
    { value: 'property', label: '火災保険' },
    { value: 'travel', label: '海外旅行保険' },
  ];
}

export function getCoverageOptions(category: InsuranceCategory): string[] {
  const products = getInsuranceProductsByCategory(category);
  const allCoverage = products.flatMap(p => p.coverage);
  return [...new Set(allCoverage)].sort();
}

export function getApplyMethodOptions(): { value: string; label: string }[] {
  return [
    { value: 'online', label: 'オンライン' },
    { value: 'phone', label: '電話' },
    { value: 'agent', label: '代理店' },
    { value: 'mail', label: '郵送' },
  ];
}

// Invalidate cache (useful for development)
export function invalidateInsuranceCache(): void {
  insuranceCache = null;
}