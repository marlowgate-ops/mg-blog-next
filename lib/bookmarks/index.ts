/**
 * Anonymous bookmark system using localStorage + optional KV sync
 * Works without authentication using anonymous user IDs
 */

import { kv } from '@vercel/kv';

export interface BookmarkItem {
  id: string;
  url: string;
  title: string;
  type: 'article' | 'broker' | 'insurance' | 'tool';
  description?: string;
  thumbnail?: string;
  addedAt: string;
  tags: string[];
}

export interface BookmarkCollection {
  anonymousId: string;
  items: BookmarkItem[];
  lastSynced: string;
  deviceCount?: number;
}

// Generate a persistent anonymous ID
export function getAnonymousId(): string {
  if (typeof window === 'undefined') return '';
  
  let anonymousId = localStorage.getItem('mg_anonymous_id');
  if (!anonymousId) {
    anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('mg_anonymous_id', anonymousId);
  }
  return anonymousId;
}

// Local storage operations
export function getLocalBookmarks(): BookmarkItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('mg_bookmarks');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveLocalBookmarks(bookmarks: BookmarkItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('mg_bookmarks', JSON.stringify(bookmarks));
    localStorage.setItem('mg_bookmarks_updated', new Date().toISOString());
  } catch (error) {
    console.warn('Failed to save bookmarks locally:', error);
  }
}

// Add bookmark
export async function addBookmark(item: Omit<BookmarkItem, 'id' | 'addedAt'>): Promise<void> {
  const bookmark: BookmarkItem = {
    ...item,
    id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    addedAt: new Date().toISOString(),
  };

  const bookmarks = getLocalBookmarks();
  
  // Check if already bookmarked
  const exists = bookmarks.some(b => b.url === bookmark.url);
  if (exists) {
    throw new Error('Already bookmarked');
  }

  const updated = [bookmark, ...bookmarks];
  saveLocalBookmarks(updated);
  
  // Sync to KV in background
  syncToKV(updated).catch(console.warn);
}

// Remove bookmark
export async function removeBookmark(url: string): Promise<void> {
  const bookmarks = getLocalBookmarks();
  const updated = bookmarks.filter(b => b.url !== url);
  saveLocalBookmarks(updated);
  
  // Sync to KV in background
  syncToKV(updated).catch(console.warn);
}

// Check if URL is bookmarked
export function isBookmarked(url: string): boolean {
  const bookmarks = getLocalBookmarks();
  return bookmarks.some(b => b.url === url);
}

// Get bookmarks by type
export function getBookmarksByType(type: BookmarkItem['type']): BookmarkItem[] {
  const bookmarks = getLocalBookmarks();
  return bookmarks.filter(b => b.type === type);
}

// Search bookmarks
export function searchBookmarks(query: string): BookmarkItem[] {
  const bookmarks = getLocalBookmarks();
  const lowercaseQuery = query.toLowerCase();
  
  return bookmarks.filter(b =>
    b.title.toLowerCase().includes(lowercaseQuery) ||
    b.description?.toLowerCase().includes(lowercaseQuery) ||
    b.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// Sync to KV store (for cross-device access)
async function syncToKV(bookmarks: BookmarkItem[]): Promise<void> {
  if (!process.env.KV_REST_API_URL) return;
  
  try {
    const anonymousId = getAnonymousId();
    if (!anonymousId) return;
    
    const collection: BookmarkCollection = {
      anonymousId,
      items: bookmarks,
      lastSynced: new Date().toISOString(),
      deviceCount: 1
    };
    
    const key = `bookmarks:${anonymousId}`;
    await kv.set(key, collection, { ex: 60 * 60 * 24 * 90 }); // 90 days
    
  } catch (error) {
    console.warn('Failed to sync bookmarks to KV:', error);
  }
}

// Load from KV (for cross-device sync)
export async function loadFromKV(): Promise<BookmarkItem[]> {
  if (!process.env.KV_REST_API_URL) return getLocalBookmarks();
  
  try {
    const anonymousId = getAnonymousId();
    if (!anonymousId) return getLocalBookmarks();
    
    const key = `bookmarks:${anonymousId}`;
    const collection = await kv.get<BookmarkCollection>(key);
    
    if (collection && collection.items) {
      // Merge with local bookmarks (KV is source of truth for conflicts)
      const localBookmarks = getLocalBookmarks();
      const localUrls = new Set(localBookmarks.map(b => b.url));
      
      // Add KV bookmarks that aren't local
      const kvOnly = collection.items.filter(b => !localUrls.has(b.url));
      const merged = [...localBookmarks, ...kvOnly];
      
      // Sort by addedAt (newest first)
      merged.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
      
      saveLocalBookmarks(merged);
      return merged;
    }
    
    return getLocalBookmarks();
    
  } catch (error) {
    console.warn('Failed to load bookmarks from KV:', error);
    return getLocalBookmarks();
  }
}

// Export collection for backup
export function exportBookmarks(): string {
  const bookmarks = getLocalBookmarks();
  const anonymousId = getAnonymousId();
  
  const exportData = {
    version: '1.0',
    anonymousId,
    items: bookmarks,
    exportedAt: new Date().toISOString(),
    count: bookmarks.length
  };
  
  return JSON.stringify(exportData, null, 2);
}

// Import collection from backup
export async function importBookmarks(data: string): Promise<void> {
  try {
    const parsed = JSON.parse(data);
    
    if (!parsed.items || !Array.isArray(parsed.items)) {
      throw new Error('Invalid bookmark data format');
    }
    
    const currentBookmarks = getLocalBookmarks();
    const currentUrls = new Set(currentBookmarks.map(b => b.url));
    
    // Only import new bookmarks
    const newBookmarks = parsed.items.filter((item: BookmarkItem) => 
      !currentUrls.has(item.url)
    );
    
    if (newBookmarks.length > 0) {
      const merged = [...currentBookmarks, ...newBookmarks];
      merged.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
      
      saveLocalBookmarks(merged);
      syncToKV(merged).catch(console.warn);
    }
    
  } catch (error) {
    throw new Error('Failed to import bookmarks: ' + error);
  }
}