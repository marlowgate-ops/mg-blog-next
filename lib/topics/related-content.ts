/**
 * Hook and utilities for finding related content based on page context
 */

import { getRelatedTopicHubs, getTopicHub } from '@/lib/topics/hubs';
import { findTopicsBySearch } from '@/lib/search/synonyms';

export interface PageContext {
  type: 'broker' | 'insurance' | 'tool' | 'post' | 'guide';
  title: string;
  description?: string;
  tags?: string[];
  category?: string;
  keywords?: string[];
}

export interface RelatedContentSuggestion {
  topics: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
    relevance: number;
  }>;
  guides: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
  }>;
  tools: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
  }>;
}

/**
 * Find related content for a given page context
 */
export function findRelatedContent(context: PageContext, maxItems: number = 3): RelatedContentSuggestion {
  // Build search query from context
  const searchTerms = [
    context.title,
    context.description || '',
    ...(context.tags || []),
    ...(context.keywords || []),
    context.category || ''
  ].filter(Boolean).join(' ');

  // Find relevant topics
  const topicMatches = findTopicsBySearch(searchTerms);
  
  const topics = topicMatches
    .slice(0, maxItems)
    .map(match => {
      const hub = getTopicHub(match.topic);
      return hub ? {
        id: hub.id,
        title: hub.title,
        description: hub.description,
        url: `/topics/${hub.id}`,
        relevance: match.relevance
      } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  // Get related guides and tools based on context type and keywords
  const guides = getRelatedGuides(context, maxItems);
  const tools = getRelatedTools(context, maxItems);

  return {
    topics,
    guides,
    tools
  };
}

/**
 * Get suggested guides based on page context
 */
function getRelatedGuides(context: PageContext, maxItems: number): RelatedContentSuggestion['guides'] {
  const guides: RelatedContentSuggestion['guides'] = [];

  // Context-specific guide suggestions
  if (context.type === 'broker' || context.keywords?.some(k => ['FX', 'forex', '外国為替'].includes(k))) {
    guides.push(
      {
        id: 'fx-basics',
        title: 'FX取引の基礎知識',
        description: 'FX取引を始める前に知っておくべき基本的な知識とリスク',
        url: '/guides/fx-basics'
      },
      {
        id: 'broker-selection',
        title: 'FXブローカーの選び方',
        description: '安全で信頼できるFXブローカーを選ぶためのチェックポイント',
        url: '/guides/broker-selection'
      }
    );
  }

  if (context.type === 'insurance' || context.keywords?.some(k => ['保険', 'insurance'].includes(k))) {
    guides.push(
      {
        id: 'insurance-basics',
        title: '保険の基礎知識',
        description: '保険の種類と選び方、保険料を抑えるポイント',
        url: '/guides/insurance-basics'
      },
      {
        id: 'insurance-comparison',
        title: '保険の比較方法',
        description: '複数の保険商品を効果的に比較するための手順',
        url: '/guides/insurance-comparison'
      }
    );
  }

  if (context.tags?.some(tag => ['risk', 'リスク', '管理'].includes(tag))) {
    guides.push({
      id: 'risk-management',
      title: 'リスク管理の基本',
      description: '投資におけるリスクを理解し、適切に管理する方法',
      url: '/guides/risk-management'
    });
  }

  return guides.slice(0, maxItems);
}

/**
 * Get suggested tools based on page context
 */
function getRelatedTools(context: PageContext, maxItems: number): RelatedContentSuggestion['tools'] {
  const tools: RelatedContentSuggestion['tools'] = [];

  // Context-specific tool suggestions
  if (context.type === 'broker' || context.keywords?.some(k => ['FX', 'forex', '外国為替', 'trading'].includes(k))) {
    tools.push(
      {
        id: 'position-size-calculator',
        title: 'ポジションサイズ計算機',
        description: 'リスク許容度に基づいて適切なポジションサイズを計算',
        url: '/tools/position-size-calculator'
      },
      {
        id: 'pip-value-calculator',
        title: 'PIP価値計算機',
        description: '通貨ペアごとのPIP価値を瞬時に計算',
        url: '/tools/pip-value-calculator'
      },
      {
        id: 'margin-calculator',
        title: 'マージン計算機',
        description: 'レバレッジと取引量から必要証拠金を算出',
        url: '/tools/margin-calculator'
      }
    );
  }

  if (context.tags?.some(tag => ['analysis', '分析', 'chart', 'チャート'].includes(tag))) {
    // Future: Add analysis tools when available
  }

  return tools.slice(0, maxItems);
}

/**
 * Generate internal linking suggestions for content editors
 */
export function generateInternalLinkSuggestions(content: string, context: PageContext): Array<{
  anchor: string;
  url: string;
  relevance: number;
}> {
  const suggestions: Array<{ anchor: string; url: string; relevance: number }> = [];
  
  // Find topic hubs that match content
  const topicMatches = findTopicsBySearch(content);
  
  for (const match of topicMatches.slice(0, 5)) {
    const hub = getTopicHub(match.topic);
    if (hub) {
      // Look for potential anchor text in content
      const potentialAnchors = [
        hub.title,
        ...hub.keywords
      ];
      
      for (const anchor of potentialAnchors) {
        if (content.toLowerCase().includes(anchor.toLowerCase())) {
          suggestions.push({
            anchor,
            url: `/topics/${hub.id}`,
            relevance: match.relevance
          });
        }
      }
    }
  }

  return suggestions
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3);
}