import { NextRequest, NextResponse } from 'next/server';
import { allPosts, allNewInsuranceProducts } from 'contentlayer/generated';
import { getAllBrokers } from '@/lib/score/brokers';
import { providers } from '@/lib/news/providers';
import Fuse from 'fuse.js';

export const runtime = 'nodejs';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'post' | 'broker' | 'insurance' | 'tool' | 'tag' | 'provider';
  url: string;
  excerpt?: string;
  category?: string;
  score: number;
}

// Cache for search indices
let searchIndices: Map<string, Fuse<any>> | null = null;
let lastIndexUpdate = 0;
const INDEX_TTL = 5 * 60 * 1000; // 5 minutes

function buildSearchIndices() {
  const now = Date.now();
  if (searchIndices && (now - lastIndexUpdate) < INDEX_TTL) {
    return searchIndices;
  }

  const indices = new Map();

  // Posts index
  const posts = allPosts.filter(p => !p.draft).map(post => ({
    id: post.slug,
    title: post.title,
    excerpt: post.description || '',
    type: 'post',
    url: `/blog/${post.slug}`,
    category: 'general',
    tags: post.tags || []
  }));

  const postsIndex = new Fuse(posts, {
    keys: [
      { name: 'title', weight: 0.7 },
      { name: 'excerpt', weight: 0.2 },
      { name: 'tags', weight: 0.1 }
    ],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2
  });

  // Brokers index
  const brokers = getAllBrokers().map(broker => ({
    id: broker.slug,
    title: broker.brand,
    excerpt: broker.notes || `${broker.regulator.join(', ')} regulated broker`,
    type: 'broker',
    url: `/best/forex-brokers/${broker.slug}`,
    category: 'broker'
  }));

  const brokersIndex = new Fuse(brokers, {
    keys: [
      { name: 'title', weight: 0.8 },
      { name: 'excerpt', weight: 0.2 }
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2
  });

  // Insurance index
  const insurance = allNewInsuranceProducts.map(product => ({
    id: product.slug,
    title: product.brand,
    excerpt: product.notes || `${product.category} insurance`,
    type: 'insurance',
    url: `/insurance/${product.slug}`,
    category: product.category
  }));

  const insuranceIndex = new Fuse(insurance, {
    keys: [
      { name: 'title', weight: 0.8 },
      { name: 'excerpt', weight: 0.2 }
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2
  });

  // News providers index
  const newsProviders = providers.map(provider => ({
    id: provider.id,
    title: provider.name,
    excerpt: provider.description,
    type: 'provider',
    url: `/news/provider/${provider.id}`,
    category: provider.category
  }));

  const providersIndex = new Fuse(newsProviders, {
    keys: [
      { name: 'title', weight: 0.8 },
      { name: 'excerpt', weight: 0.2 }
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2
  });

  // Tools index
  const tools = [
    {
      id: 'position-size-calculator',
      title: 'ポジションサイズ計算ツール',
      excerpt: 'リスク管理に基づいた適切なポジションサイズを計算',
      type: 'tool',
      url: '/tools/position-size-calculator',
      category: 'calculator'
    },
    {
      id: 'pip-value-calculator',
      title: 'Pip価値計算ツール',
      excerpt: '通貨ペアごとのPip価値を計算',
      type: 'tool',
      url: '/tools/pip-value-calculator',
      category: 'calculator'
    },
    {
      id: 'margin-calculator',
      title: 'マージン計算ツール',
      excerpt: 'FX取引に必要な証拠金を計算',
      type: 'tool',
      url: '/tools/margin-calculator',
      category: 'calculator'
    }
  ];

  const toolsIndex = new Fuse(tools, {
    keys: [
      { name: 'title', weight: 0.8 },
      { name: 'excerpt', weight: 0.2 }
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2
  });

  // Tags index
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));
  const tags = allTags.map(tag => ({
    id: tag,
    title: tag,
    type: 'tag',
    url: `/tags/${encodeURIComponent(tag)}`,
    category: 'tag'
  }));

  const tagsIndex = new Fuse(tags, {
    keys: [{ name: 'title', weight: 1.0 }],
    threshold: 0.2,
    includeScore: true,
    minMatchCharLength: 1
  });

  indices.set('posts', postsIndex);
  indices.set('brokers', brokersIndex);
  indices.set('insurance', insuranceIndex);
  indices.set('providers', providersIndex);
  indices.set('tools', toolsIndex);
  indices.set('tags', tagsIndex);

  searchIndices = indices;
  lastIndexUpdate = now;

  return indices;
}

// GET /api/suggest?q=search_term
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 1) {
      return NextResponse.json({
        success: true,
        suggestions: [],
        meta: {
          query: query || '',
          total: 0,
          categories: {}
        }
      });
    }

    const indices = buildSearchIndices();
    const allSuggestions: SearchSuggestion[] = [];

    // Search across all indices
    for (const [, index] of indices.entries()) {
      const results = index.search(query, { limit: 8 });
      
      for (const result of results) {
        allSuggestions.push({
          ...result.item,
          score: 1 - (result.score || 0) // Convert to positive score
        });
      }
    }

    // Sort by score and limit results
    const sortedSuggestions = allSuggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    // Group by category for response
    const categories = sortedSuggestions.reduce((acc, suggestion) => {
      if (!acc[suggestion.type]) {
        acc[suggestion.type] = 0;
      }
      acc[suggestion.type]++;
      return acc;
    }, {} as Record<string, number>);

    const response = NextResponse.json({
      success: true,
      suggestions: sortedSuggestions,
      meta: {
        query,
        total: sortedSuggestions.length,
        categories,
        cached: searchIndices !== null
      }
    });

    // Set cache headers for stale-while-revalidate
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=60');

    return response;

  } catch (error) {
    console.error('Search suggestions API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate search suggestions',
        suggestions: [],
        meta: {
          query: '',
          total: 0,
          categories: {}
        }
      },
      { status: 500 }
    );
  }
}

// POST /api/suggest - Track search selections for trending
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entity, slug, query } = body;

    if (!entity || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: entity, slug' },
        { status: 400 }
      );
    }

    // Track GA4 event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ga4_search_select', {
        entity,
        slug,
        search_term: query
      });
    }

    // Store trending data in KV (mock implementation)
    const dateKey = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const trendingKey = `kv:search:trend:${dateKey}`;
    
    // In production, this would update actual KV storage
    console.log(`Tracking search selection: ${trendingKey}`, { entity, slug, query });

    return NextResponse.json({
      success: true,
      message: 'Search selection tracked',
      data: { entity, slug, query }
    });

  } catch (error) {
    console.error('Search tracking error:', error);

    return NextResponse.json(
      { error: 'Failed to track search selection' },
      { status: 500 }
    );
  }
}