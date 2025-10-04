'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getLocalBookmarks, 
  loadFromKV, 
  removeBookmark, 
  searchBookmarks,
  getBookmarksByType,
  exportBookmarks,
  importBookmarks,
  BookmarkItem 
} from '@/lib/bookmarks';
import Container from '@/components/Container';
import styles from './Bookmarks.module.css';

type FilterType = 'all' | BookmarkItem['type'];

export default function BookmarksClient() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showImportExport, setShowImportExport] = useState(false);

  // Load bookmarks on mount
  useEffect(() => {
    async function loadBookmarks() {
      try {
        setLoading(true);
        const loaded = await loadFromKV();
        setBookmarks(loaded);
        setFilteredBookmarks(loaded);
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
        const local = getLocalBookmarks();
        setBookmarks(local);
        setFilteredBookmarks(local);
      } finally {
        setLoading(false);
      }
    }

    loadBookmarks();
  }, []);

  // Filter bookmarks based on search and type
  useEffect(() => {
    let filtered = bookmarks;

    if (searchQuery.trim()) {
      filtered = searchBookmarks(searchQuery);
    }

    if (activeFilter !== 'all') {
      filtered = getBookmarksByType(activeFilter);
    }

    setFilteredBookmarks(filtered);
  }, [bookmarks, searchQuery, activeFilter]);

  const handleRemove = async (url: string) => {
    try {
      await removeBookmark(url);
      const updated = bookmarks.filter(b => b.url !== url);
      setBookmarks(updated);
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  const handleExport = () => {
    try {
      const data = exportBookmarks();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookmarks-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('エクスポートに失敗しました');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await importBookmarks(text);
      
      // Reload bookmarks
      const updated = getLocalBookmarks();
      setBookmarks(updated);
      alert('インポートが完了しました');
    } catch (error) {
      console.error('Import failed:', error);
      alert('インポートに失敗しました: ' + error);
    }
    
    // Reset file input
    event.target.value = '';
  };

  const typeLabels: Record<BookmarkItem['type'], string> = {
    article: '記事',
    broker: 'ブローカー',
    insurance: '保険',
    tool: 'ツール'
  };

  const typeCounts = bookmarks.reduce((acc, bookmark) => {
    acc[bookmark.type] = (acc[bookmark.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <Container>
        <div className={styles.container}>
          <div className={styles.loading}>
            <p>ブックマークを読み込み中...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>ブックマーク</h1>
          <p className={styles.subtitle}>
            保存した記事やページ ({bookmarks.length}件)
          </p>
        </header>

        <div className={styles.controls}>
          <div className={styles.search}>
            <input
              type="text"
              placeholder="ブックマークを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filters}>
            <button
              className={`${styles.filter} ${activeFilter === 'all' ? styles.active : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              すべて ({bookmarks.length})
            </button>
            {Object.entries(typeLabels).map(([type, label]) => (
              <button
                key={type}
                className={`${styles.filter} ${activeFilter === type ? styles.active : ''}`}
                onClick={() => setActiveFilter(type as BookmarkItem['type'])}
              >
                {label} ({typeCounts[type] || 0})
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            <button
              onClick={() => setShowImportExport(!showImportExport)}
              className={styles.actionButton}
            >
              インポート/エクスポート
            </button>
          </div>
        </div>

        {showImportExport && (
          <div className={styles.importExport}>
            <button onClick={handleExport} className={styles.exportButton}>
              ブックマークをエクスポート
            </button>
            <label className={styles.importLabel}>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className={styles.importInput}
              />
              ブックマークをインポート
            </label>
          </div>
        )}

        <div className={styles.content}>
          {filteredBookmarks.length > 0 ? (
            <div className={styles.grid}>
              {filteredBookmarks.map((bookmark) => (
                <div key={bookmark.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.type}>{typeLabels[bookmark.type]}</span>
                    <button
                      onClick={() => handleRemove(bookmark.url)}
                      className={styles.remove}
                      title="削除"
                    >
                      ×
                    </button>
                  </div>
                  
                  <Link href={bookmark.url} className={styles.cardLink}>
                    <h3 className={styles.cardTitle}>{bookmark.title}</h3>
                    {bookmark.description && (
                      <p className={styles.cardDescription}>{bookmark.description}</p>
                    )}
                  </Link>
                  
                  <div className={styles.cardFooter}>
                    <span className={styles.addedAt}>
                      {new Date(bookmark.addedAt).toLocaleDateString('ja-JP')}
                    </span>
                    {bookmark.tags.length > 0 && (
                      <div className={styles.tags}>
                        {bookmark.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              {searchQuery ? (
                <div>
                  <h3>検索結果が見つかりません</h3>
                  <p>「{searchQuery}」に一致するブックマークがありません。</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className={styles.clearSearch}
                  >
                    検索をクリア
                  </button>
                </div>
              ) : activeFilter !== 'all' ? (
                <div>
                  <h3>{typeLabels[activeFilter as BookmarkItem['type']]}のブックマークがありません</h3>
                  <p>このカテゴリーのブックマークはまだありません。</p>
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={styles.clearSearch}
                  >
                    すべて表示
                  </button>
                </div>
              ) : (
                <div>
                  <h3>ブックマークがありません</h3>
                  <p>気になる記事やページをブックマークして、後で読み返しましょう。</p>
                  <Link href="/" className={styles.browseLink}>
                    記事を見る
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}