import { NextRequest, NextResponse } from 'next/server';
import { filterInsuranceProducts } from '../../../../lib/insurance-data';
import { InsuranceCompareFilters } from '../../../../content_source/insurance/insurance.schema';

export async function POST(request: NextRequest) {
  try {
    const filters: InsuranceCompareFilters = await request.json();
    
    // Validate category
    if (!filters.category || !['life', 'medical', 'auto', 'property', 'travel'].includes(filters.category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }
    
    const filteredProducts = filterInsuranceProducts(filters);
    
    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error('Insurance filter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  try {
    const filters: InsuranceCompareFilters = {
      category: (searchParams.get('category') as any) || 'life',
      coverage: searchParams.get('coverage')?.split(','),
      age_range: {
        min: searchParams.get('age_min') ? parseInt(searchParams.get('age_min')!) : undefined,
        max: searchParams.get('age_max') ? parseInt(searchParams.get('age_max')!) : undefined,
      },
      deductible_max: searchParams.get('deductible_max') ? parseInt(searchParams.get('deductible_max')!) : undefined,
      premium_max: searchParams.get('premium_max') ? parseInt(searchParams.get('premium_max')!) : undefined,
      apply_methods: searchParams.get('apply_methods')?.split(','),
      sort: searchParams.get('sort') as any,
      search: searchParams.get('search') || undefined,
    };
    
    const filteredProducts = filterInsuranceProducts(filters);
    
    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error('Insurance filter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}