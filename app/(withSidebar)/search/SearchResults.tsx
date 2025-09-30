'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { allPosts } from 'contentlayer/generated';
import { gaEvent } from '@/lib/analytics';
import React from 'react';
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
  type: 'post' | 'news' | 'guide' | 'page';
  sourceId?: string;
  publishedAt?: string;
}

interface SearchResultsProps {
  query: string;
  selectedTopics: string[];
}

// Generate search index from real content
function generateSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];
  
  // Add blog posts
  allPosts.forEach(post => {
    if (!post.draft) {
      results.push({
        id: post._id,
        title: post.title,
        excerpt: post.description || '',
        slug: post.slug || post._id,
        href: post.url,
        topics: post.tags || [],
        content: `${post.title} ${post.description || ''} ${(post.tags || []).join(' ')}`,
        updatedAt: post.date,
        type: 'post',
        publishedAt: post.date
      });
    }
  });
  
  // Add static pages
  const staticPages = [
    {
      id: 'forex-brokers-jp',
      title: '国内向けおすすめFX・CFD業者ランキング',
      excerpt: '使いやすさ/実用性を重視。スプレッド・手数料・約定・アプリ・サポートを総合評価。',
      href: '/best/forex-brokers-jp',
      topics: ['fx', 'ranking'],
      content: 'FX CFD 業者 ランキング スプレッド 手数料 約定 アプリ サポート',
      type: 'page' as const
    },
    {
      id: 'insurance',
      title: '保険比較・ランキング',
      excerpt: '自動車保険、生命保険、医療保険の比較とおすすめランキング。',
      href: '/insurance',
      topics: ['insurance'],
      content: '保険 自動車保険 生命保険 医療保険 比較 ランキング',
      type: 'page' as const
    },
    {
      id: 'markets',
      title: '市場データ・経済指標',
      excerpt: 'リアルタイムの為替レート、株価指数、経済指標を提供。',
      href: '/markets',
      topics: ['market', 'data'],
      content: '市場 データ 為替 株価 経済指標 リアルタイム',
      type: 'page' as const
    }
  ];
  
  staticPages.forEach(page => {
    results.push({
      ...page,
      id: page.id,
      slug: page.id,
      updatedAt: new Date().toISOString()
    });
  });
  
  return results;
}

function highlightText(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function getTypeBadge(type: SearchResult['type']) {
  const badges = {
    post: { label: '記事', className: styles.typeBadgePost },
    news: { label: 'ニュース', className: styles.typeBadgeNews },
    guide: { label: 'ガイド', className: styles.typeBadgeGuide },
    page: { label: 'ページ', className: styles.typeBadgePage }
  };
  
  return badges[type] || badges.page;
}

export default function SearchResults({ query, selectedTopics }: SearchResultsProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);
  const router = useRouter();
  
  // Generate search index
  const searchIndex = useMemo(() => generateSearchIndex(), []);
  
  // Filter and search logic
  const results = useMemo(() => {
    let filtered = searchIndex;
    
    // Filter by topics if selected
    if (selectedTopics.length > 0) {
      filtered = filtered.filter((item: SearchResult) =>
        item.topics.some((topic: string) => selectedTopics.includes(topic))
      );
    }
    
    // Search in content if query provided
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
      filtered = filtered.filter((item: SearchResult) => {
        const searchableText = `${item.title} ${item.excerpt} ${item.content}`.toLowerCase();
        return searchTerms.every((term: string) => {
          return searchableText.includes(term) || 
                 item.topics.some((topic: string) => {
                   const topicMeta = topicsData.find((t: any) => t.id === topic);
                   return topicMeta?.label.toLowerCase().includes(term) ||
                          topicMeta?.description?.toLowerCase().includes(term);
                 });
        });
      });
    }
    
    // Sort by relevance (exact matches first, then partial)
    if (query.trim()) {
      filtered.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const queryLower = query.toLowerCase();
        
        if (aTitle.includes(queryLower) && !bTitle.includes(queryLower)) return -1;
        if (!aTitle.includes(queryLower) && bTitle.includes(queryLower)) return 1;
        
        // Sort by type priority: page > post > guide > news
        const typePriority = { page: 0, post: 1, guide: 2, news: 3 };
        return typePriority[a.type] - typePriority[b.type];
      });
    }
    
    return filtered;
  }, [searchIndex, query, selectedTopics]);
  
  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (results.length === 0) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setIsKeyboardNavigation(true);
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setIsKeyboardNavigation(true);
        setSelectedIndex(prev => prev <= 0 ? results.length - 1 : prev - 1);
        break;
      case 'Enter':
        if (selectedIndex >= 0 && results[selectedIndex]) {
          event.preventDefault();
          const result = results[selectedIndex];
          gaEvent('search_performed', {
            search_term: query,
            result_clicked: result.title,
            result_type: result.type,
            result_position: selectedIndex + 1
          });
          router.push(result.href);
        }
        break;
      case 'Escape':
        setSelectedIndex(-1);
        setIsKeyboardNavigation(false);
        break;
    }
  }, [results, selectedIndex, query, router]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1);
    setIsKeyboardNavigation(false);
  }, [results]);
  
  const handleResultClick = (result: SearchResult, index: number) => {
    gaEvent('search_performed', {
      search_term: query,
      result_clicked: result.title,
      result_type: result.type,
      result_position: index + 1
    });
  };
  
  const handleMouseEnter = (index: number) => {
    if (!isKeyboardNavigation) {
      setSelectedIndex(index);
    }
  };
  
  const handleMouseLeave = () => {
    if (!isKeyboardNavigation) {
      setSelectedIndex(-1);
    }
  };
  
  if (!query && selectedTopics.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2 className={styles.emptyTitle}>検索キーワードを入力してください</h2>
        <p className={styles.emptyDescription}>
          記事、ガイド、ページなどを横断検索できます。
        </p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      {query && (
        <div className={styles.searchInfo}>
          <p className={styles.resultCount}>
            「{query}」の検索結果: {results.length}件
          </p>
          <div className={styles.keyboardHint}>
            ↑↓ キーで選択、Enter で開く
          </div>
        </div>
      )}
      
      {results.length === 0 ? (
        <div className={styles.noResults}>
          <h2 className={styles.noResultsTitle}>検索結果が見つかりません</h2>
          <p className={styles.noResultsDescription}>
            別のキーワードで試してみてください。
          </p>
        </div>
      ) : (
        <ul className={styles.results}>
          {results.map((result, index) => {
            const badge = getTypeBadge(result.type);
            const isSelected = index === selectedIndex;
            
            return (
              <li 
                key={result.id}
                className={`${styles.resultItem} ${isSelected ? styles.selected : ''}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  href={result.href}
                  className={styles.resultLink}
                  onClick={() => handleResultClick(result, index)}
                >
                  <div className={styles.resultHeader}>
                    <span className={`${styles.typeBadge} ${badge.className}`}>
                      {badge.label}
                    </span>
                    <h3 
                      className={styles.resultTitle}
                      dangerouslySetInnerHTML={{ __html: highlightText(result.title, query) }}
                    />
                  </div>
                  <p 
                    className={styles.resultExcerpt}
                    dangerouslySetInnerHTML={{ __html: highlightText(result.excerpt, query) }}
                  />
                  {result.topics.length > 0 && (
                    <div className={styles.resultTopics}>
                      {result.topics.slice(0, 3).map(topic => {
                        const topicMeta = topicsData.find((t: any) => t.id === topic);
                        return (
                          <span key={topic} className={styles.topicTag}>
                            {topicMeta?.label || topic}
                          </span>
                        );
                      })}
                      {result.topics.length > 3 && (
                        <span className={styles.topicMore}>+{result.topics.length - 3}</span>
                      )}
                    </div>
                  )}
                  <div className={styles.resultMeta}>
                    {result.publishedAt && (
                      <time className={styles.resultDate}>
                        {new Date(result.publishedAt).toLocaleDateString('ja-JP')}
                      </time>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}