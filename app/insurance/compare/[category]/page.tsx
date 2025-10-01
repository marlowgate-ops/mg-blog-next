import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InsuranceCompareClient from './InsuranceCompareClient';
import { 
  getInsuranceCategories, 
  getInsuranceProductsByCategory,
  getCoverageOptions,
  getApplyMethodOptions
} from '../../../../lib/insurance-data';
import { InsuranceCategory } from '../../../../content_source/insurance/insurance.schema';

interface PageProps {
  params: { category: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateStaticParams() {
  const categories = getInsuranceCategories();
  return categories.map((category) => ({
    category: category.value,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = params.category as InsuranceCategory;
  const categories = getInsuranceCategories();
  const categoryInfo = categories.find(c => c.value === category);
  
  if (!categoryInfo) {
    return {
      title: '保険比較 - Marlow Gate',
    };
  }

  const title = `${categoryInfo.label}比較 - 保険料・保障内容を徹底比較`;
  const description = `${categoryInfo.label}の保険料、保障内容、サービスを比較。各社の特徴、メリット・デメリットを詳しく解説し、あなたに最適な保険選びをサポートします。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/insurance/compare/${category}`,
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    },
  };
}

export default function InsuranceComparePage({ params, searchParams }: PageProps) {
  const category = params.category as InsuranceCategory;
  const categories = getInsuranceCategories();
  const categoryInfo = categories.find(c => c.value === category);
  
  if (!categoryInfo) {
    notFound();
  }

  // Get initial data for the page
  const initialProducts = getInsuranceProductsByCategory(category);
  const coverageOptions = getCoverageOptions(category);
  const applyMethodOptions = getApplyMethodOptions();
  
  // Parse search params
  const filters = {
    category,
    coverage: typeof searchParams.coverage === 'string' ? searchParams.coverage.split(',') : undefined,
    age_range: {
      min: searchParams.age_min ? parseInt(searchParams.age_min as string) : undefined,
      max: searchParams.age_max ? parseInt(searchParams.age_max as string) : undefined,
    },
    deductible_max: searchParams.deductible_max ? parseInt(searchParams.deductible_max as string) : undefined,
    premium_max: searchParams.premium_max ? parseInt(searchParams.premium_max as string) : undefined,
    apply_methods: typeof searchParams.apply_methods === 'string' ? searchParams.apply_methods.split(',') : undefined,
    sort: searchParams.sort as any,
    search: searchParams.search as string,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {categoryInfo.label}比較
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              {categoryInfo.label}の保険料、保障内容、サービス品質を詳しく比較。
              あなたのライフスタイルに最適な保険を見つけましょう。
            </p>
          </div>
        </div>
      </div>

      <InsuranceCompareClient
        category={category}
        categoryLabel={categoryInfo.label}
        initialProducts={initialProducts}
        coverageOptions={coverageOptions}
        applyMethodOptions={applyMethodOptions}
        initialFilters={filters}
      />
    </div>
  );
}