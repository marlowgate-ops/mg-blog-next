'use client';

import { useState, useEffect } from 'react';
import { addBookmark, removeBookmark, isBookmarked, BookmarkItem } from '@/lib/bookmarks';
import styles from './BookmarkButton.module.css';

interface BookmarkButtonProps {
  item: Omit<BookmarkItem, 'id' | 'addedAt'>;
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

export function BookmarkButton({ 
  item, 
  variant = 'default',
  className = '' 
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(item.url));
  }, [item.url]);

  const handleToggle = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      if (bookmarked) {
        await removeBookmark(item.url);
        setBookmarked(false);
      } else {
        await addBookmark(item);
        setBookmarked(true);
      }
    } catch (error) {
      console.error('Bookmark action failed:', error);
      
      // Show user feedback for errors
      if (error instanceof Error && error.message === 'Already bookmarked') {
        setBookmarked(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const buttonClass = `${styles.button} ${styles[variant]} ${bookmarked ? styles.bookmarked : ''} ${className}`;

  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={buttonClass}
        title={bookmarked ? 'ブックマークを削除' : 'ブックマークに追加'}
        aria-label={bookmarked ? 'ブックマークを削除' : 'ブックマークに追加'}
      >
        <BookmarkIcon filled={bookmarked} />
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={buttonClass}
      >
        <BookmarkIcon filled={bookmarked} />
        <span>{bookmarked ? 'ブックマーク済み' : 'ブックマーク'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={buttonClass}
    >
      <BookmarkIcon filled={bookmarked} />
      <span>
        {loading ? '処理中...' : bookmarked ? 'ブックマーク済み' : 'ブックマークに追加'}
      </span>
    </button>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 2C3 1.44772 3.44772 1 4 1H12C12.5523 1 13 1.44772 13 2V14L8 11L3 14V2Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}