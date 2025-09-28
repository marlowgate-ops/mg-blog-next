'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ListGrid from '@/components/ListGrid';
import topicsData from '@/config/topics.json';
import styles from './SearchResults.module.css';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  href: string;
  topics: string[];
  content: string;
  updatedAt: string;
}

interface SearchResultsProps {
  query: string;
  selectedTopics: string[];
}

// Mock search index - in a real app, this would be generated at build time
const mockSearchIndex: SearchResult[] = [
  {
    id: 'forex-guide-1',
    title: 'FX初心者のための基本ガイド',
    excerpt: 'FX取引を始める前に知っておくべき基本的な概念と用語を解説します。',
    slug: 'forex-beginner-guide',
    href: '/guides/forex-beginner-guide',
    topics: ['forex', 'education'],
    content: 'FX外国為替取引スプレッドレバレッジ通貨ペア',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'insurance-car-1',
    title: '自動車保険の選び方',
    excerpt: '自動車保険を選ぶ際のポイントと各社の比較方法を詳しく説明します。',
    slug: 'car-insurance-guide',
    href: '/guides/car-insurance-guide',
    topics: ['insurance'],
    content: '自動車保険対人対物車両保険ロードサービス',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'stock-investment-1',
    title: '株式投資の基礎知識',
    excerpt: '株式投資を始める前に知っておくべき基本的な知識をまとめました。',
    slug: 'stock-investment-basics',
    href: '/guides/stock-investment-basics',
    topics: ['stocks', 'education'],
    content: '株式投資配当金株主優待証券会社',
    updatedAt: new Date().toISOString()
  }
];

function highlightText(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export default function SearchResults({ query, selectedTopics }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();
  
  const topics = topicsData as Array<{ id: string; label: string; icon: string }>;
  
  // Filter and search results
  const filteredResults = useMemo(() => {
    let filtered = mockSearchIndex;
    
    // Apply topic filters
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(item => 
        item.topics.some(topic => selectedTopics.includes(topic))
      );
    }
    
    // Apply search query
    if (query) {
      const queryLower = query.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(queryLower) ||
        item.excerpt.toLowerCase().includes(queryLower) ||
        item.content.toLowerCase().includes(queryLower) ||
        item.topics.some(topic => {
          const topicData = topics.find(t => t.id === topic);
          return topicData?.label.toLowerCase().includes(queryLower);
        })
      );
    }
    
    return filtered;
  }, [query, selectedTopics, topics]);
  
  useEffect(() => {
    setResults(filteredResults);
  }, [filteredResults]);

  const handleTopicFilter = (topicId: string) => {
    const newTopics = selectedTopics.includes(topicId)
      ? selectedTopics.filter(t => t !== topicId)
      : [...selectedTopics, topicId];
    
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (newTopics.length > 0) params.set('topics', newTopics.join(','));
    
    router.push(`/search?${params.toString()}`);
  };

  // Convert results to ListGrid format
  const gridItems = results.map(result => ({
    id: result.id,
    title: query ? highlightText(result.title, query) : result.title,
    excerpt: query ? highlightText(result.excerpt, query) : result.excerpt,
    slug: result.slug,
    href: result.href,
    updatedAt: result.updatedAt,
    topics: result.topics.map(topicId => {
      const topic = topics.find(t => t.id === topicId);
      return topic ? topic.label : topicId;
    })
  }));

  if (!query) {
    return (
      <div className={styles.noQuery}>
        <p>検索キーワードを入力してください。</p>
      </div>
    );
  }

  return (
    <div className={styles.searchResults}>
      {/* Topic Filters */}
      <div className={styles.filters}>
        <h3 className={styles.filtersTitle}>トピックで絞り込み</h3>
        <div className={styles.topicChips}>
          {topics.map(topic => (
            <button
              key={topic.id}
              className={`${styles.topicChip} ${
                selectedTopics.includes(topic.id) ? styles.active : ''
              }`}
              onClick={() => handleTopicFilter(topic.id)}
            >
              <span className={styles.topicIcon}>{topic.icon}</span>
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className={styles.resultsSummary}>
        <p>
          {results.length}件の結果が見つかりました
          {selectedTopics.length > 0 && (
            <span className={styles.activeFilters}>
              （{selectedTopics.length}個のフィルター適用中）
            </span>
          )}
        </p>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className={styles.noResults}>
          <h3>検索結果が見つかりませんでした</h3>
          <p>別のキーワードで検索してみるか、フィルターを変更してください。</p>
        </div>
      ) : (
        <div className={styles.resultsGrid}>
          {gridItems.map(item => (
            <div key={item.id} className={styles.resultCard}>
              <div className={styles.resultContent}>
                <div className={styles.resultTopics}>
                  {item.topics.slice(0, 2).map((topic, index) => (
                    <span key={index} className={styles.resultTopic}>
                      {topic}
                    </span>
                  ))}
                </div>
                
                <h3 
                  className={styles.resultTitle}
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                
                <p 
                  className={styles.resultExcerpt}
                  dangerouslySetInnerHTML={{ __html: item.excerpt }}
                />
                
                <a href={item.href} className={styles.resultLink}>
                  詳細を見る →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}