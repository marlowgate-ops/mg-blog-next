export interface InsuranceProduct {
  slug: string;
  brand: string;
  category: 'life' | 'medical' | 'auto' | 'property' | 'travel';
  coverage: string[];
  exclusions: string[];
  premium_from: number;
  deductible?: number;
  age_range: {
    min: number;
    max: number;
  };
  apply_methods: ('online' | 'phone' | 'agent' | 'mail')[];
  notes?: string;
  urls: {
    official: string;
    apply: string;
  };
  scores?: {
    cost: number;      // 1-5 scale
    coverage: number;  // 1-5 scale
    service: number;   // 1-5 scale
    claim: number;     // 1-5 scale
  };
  score_total?: number; // Calculated average
  
  // Additional metadata
  company_size?: 'large' | 'medium' | 'small';
  established_year?: number;
  customer_base?: number;
  special_features?: string[];
}

export type InsuranceCategory = InsuranceProduct['category'];

export interface InsuranceCompareFilters {
  category: InsuranceCategory;
  coverage?: string[];
  age_range?: {
    min?: number;
    max?: number;
  };
  deductible_max?: number;
  premium_max?: number;
  apply_methods?: string[];
  sort?: 'cost_asc' | 'cost_desc' | 'score_desc' | 'coverage_desc' | 'brand_asc';
  search?: string;
}