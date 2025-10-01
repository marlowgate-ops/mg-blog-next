'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import s from './SearchTypeahead.module.css';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'post' | 'broker' | 'insurance' | 'tool' | 'tag' | 'provider';
  url: string;
  excerpt?: string;
  category?: string;
  score: number;
}

interface SearchResponse {
  success: boolean;
  suggestions: SearchSuggestion[];
  meta: {
    query: string;
    total: number;
    categories: Record<string, number>;
  };
}

const fetcher = async (url: string): Promise<SearchResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch suggestions');
  return res.json();
};

const TYPE_LABELS = {
  post: '記事',
  broker: 'FX業者',
  insurance: '保険',
  tool: 'ツール',
  tag: 'タグ',
  provider: 'ニュース'
} as const;

const TYPE_ICONS = {
  post: '📄',
  broker: '💱',
  insurance: '🛡️',
  tool: '🔧',
  tag: '🏷️',
  provider: '📰'
} as const;

interface SearchTypeaheadProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export default function SearchTypeahead({ 
  placeholder = "記事、業者、ツールを検索...",
  className = "",
  onSearch 
}: SearchTypeaheadProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch suggestions with SWR
  const shouldFetch = debouncedQuery.length >= 1;
  const { data, error, isLoading } = useSWR<SearchResponse>(
    shouldFetch ? `/api/suggest?q=${encodeURIComponent(debouncedQuery)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // 10 seconds
      errorRetryCount: 2
    }
  );

  const suggestions = useMemo(() => data?.suggestions || [], [data?.suggestions]);
  const hasResults = suggestions.length > 0;

  // Handle suggestion selection
  const handleSuggestionClick = useCallback(async (suggestion: SearchSuggestion) => {
    setIsSearching(true);
    
    try {
      // Track selection
      await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: suggestion.type,
          slug: suggestion.id,
          query: debouncedQuery
        })
      });

      // GA4 tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'search_select', {
          search_term: debouncedQuery,
          content_type: suggestion.type,
          content_id: suggestion.id
        });
      }

      // Navigate to result
      router.push(suggestion.url);
      
    } catch (error) {
      console.error('Failed to track selection:', error);
      // Still navigate on tracking failure
      router.push(suggestion.url);
    }
    
    setIsOpen(false);
    setQuery('');
    setIsSearching(false);
  }, [debouncedQuery, router]);

  // Handle manual search
  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    
    // GA4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: query.trim()
      });
    }

    if (onSearch) {
      onSearch(query.trim());
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    
    setIsOpen(false);
  }, [query, onSearch, router]);

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setIsOpen(value.length >= 1);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || !hasResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, hasResults, suggestions, selectedIndex, query, handleSearch, handleSuggestionClick]);

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`${s.searchContainer} ${className}`}>
      {/* Search Input */}
      <div className={s.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 1 && setIsOpen(true)}
          placeholder={placeholder}
          className={s.searchInput}
          autoComplete="off"
          spellCheck="false"
          disabled={isSearching}
        />
        
        <button
          type="button"
          onClick={handleSearch}
          className={s.searchButton}
          disabled={!query.trim() || isSearching}
          aria-label="検索"
        >
          {isLoading ? (
            <span className={s.spinner} />
          ) : (
            <svg viewBox="0 0 24 24" className={s.searchIcon}>
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div ref={dropdownRef} className={s.dropdown}>
          {isLoading && (
            <div className={s.loadingState}>
              <span className={s.spinner} />
              <span>検索中...</span>
            </div>
          )}

          {error && (
            <div className={s.errorState}>
              <span>⚠️</span>
              <span>検索エラーが発生しました</span>
            </div>
          )}

          {!isLoading && !error && hasResults && (
            <div className={s.suggestionsList}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  type="button"
                  className={`${s.suggestionItem} ${index === selectedIndex ? s.selected : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className={s.suggestionIcon}>
                    {TYPE_ICONS[suggestion.type]}
                  </div>
                  
                  <div className={s.suggestionContent}>
                    <div className={s.suggestionTitle}>
                      {suggestion.title}
                    </div>
                    {suggestion.excerpt && (
                      <div className={s.suggestionExcerpt}>
                        {suggestion.excerpt}
                      </div>
                    )}
                  </div>
                  
                  <div className={s.suggestionType}>
                    {TYPE_LABELS[suggestion.type]}
                  </div>
                </button>
              ))}
            </div>
          )}

          {!isLoading && !error && !hasResults && debouncedQuery.length >= 1 && (
            <div className={s.noResults}>
              <span>🔍</span>
              <span>「{debouncedQuery}」の検索結果はありません</span>
              <button
                type="button"
                onClick={handleSearch}
                className={s.searchAllButton}
              >
                全体で検索
              </button>
            </div>
          )}

          {/* Quick Stats */}
          {hasResults && data?.meta && (
            <div className={s.resultsStats}>
              {data.meta.total}件の結果 •{' '}
              {Object.entries(data.meta.categories).map(([type, count], i) => (
                <span key={type}>
                  {i > 0 && ' • '}
                  {TYPE_LABELS[type as keyof typeof TYPE_LABELS]}: {count}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}