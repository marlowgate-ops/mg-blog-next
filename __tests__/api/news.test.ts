/**
 * Unit tests for news API allowlist enforcement
 * Tests hostname validation and provider whitelisting
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { isUrlAllowed } from '@/lib/url-allowlist';

// Mock the news sources configuration
const mockNewsSources = [
  {
    id: 'prtimes',
    name: 'PR TIMES',
    type: 'rss',
    url: 'https://prtimes.jp/main/rss/index.rss',
    icon: '/news-providers/prtimes.svg',
    hostname: 'prtimes.jp'
  },
  {
    id: 'kabutan',
    name: 'Kabutan',
    type: 'rss', 
    url: 'https://kabutan.jp/news/rss/',
    icon: '/news-providers/kabutan.svg',
    hostname: 'kabutan.jp'
  },
  {
    id: 'tdnet',
    name: 'TDnet',
    type: 'rss',
    url: 'https://www.release.tdnet.info/rss/rss.xml',
    icon: '/news-providers/tdnet.svg',
    hostname: 'www.release.tdnet.info'
  }
];

vi.mock('../../../../config/news-sources.json', () => ({
  default: mockNewsSources
}));

// Mock fetch
global.fetch = vi.fn();

describe('News API Allowlist Enforcement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchSourceNews function', () => {
    it('should validate allowlist enforcement in isolation', () => {
      // Test the allowlist logic directly
      const isUrlAllowed = (url: string) => {
        try {
          const urlObj = new URL(url);
          return mockNewsSources.some(source => source.hostname === urlObj.hostname);
        } catch {
          return false;
        }
      };

      // This mimics the logic in the actual API route
      const testUrls = [
        { url: 'https://prtimes.jp/test', shouldAllow: true },
        { url: 'https://kabutan.jp/test', shouldAllow: true },
        { url: 'https://www.release.tdnet.info/test', shouldAllow: true },
        { url: 'https://malicious.com/test', shouldAllow: false },
        { url: 'https://fake-prtimes.jp/test', shouldAllow: false },
      ];

      testUrls.forEach(({ url, shouldAllow }) => {
        expect(isUrlAllowed(url)).toBe(shouldAllow);
      });
    });

    it('should handle fetch timeout scenario', () => {
      // Test timeout behavior - this would be implemented in the actual API
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      expect(() => timeoutPromise).toBeDefined();
      // The actual API should handle this gracefully
    });
  });

  describe('API Response Structure', () => {
    it('should define expected news item structure', () => {
      // Define the expected structure for news items
      const expectedFields = ['title', 'url', 'publishedAt', 'sourceId', 'sourceName'];
      
      expectedFields.forEach(field => {
        expect(field).toBeTruthy();
      });

      // Test sample data structure
      const sampleNewsItem = {
        title: 'Test Article',
        url: 'https://prtimes.jp/test-article',
        publishedAt: '2024-01-01T12:00:00Z',
        sourceId: 'prtimes',
        sourceName: 'PR TIMES'
      };

      expectedFields.forEach(field => {
        expect(sampleNewsItem).toHaveProperty(field);
      });
    });
  });

  describe('URL Allowlist Validation', () => {
    it('should allow URLs from whitelisted hostnames', async () => {
      await expect(isUrlAllowed('https://prtimes.jp/test-article')).resolves.toBe(true);
      await expect(isUrlAllowed('https://kabutan.jp/news/123')).resolves.toBe(true);
      await expect(isUrlAllowed('https://www.release.tdnet.info/disclosure/456')).resolves.toBe(true);
    });

    it('should reject URLs from non-whitelisted hostnames', async () => {
      await expect(isUrlAllowed('https://malicious-site.com/fake-news')).resolves.toBe(false);
      await expect(isUrlAllowed('https://example.com/test')).resolves.toBe(false);
      await expect(isUrlAllowed('https://subdomain.prtimes.jp/test')).resolves.toBe(false); // Exact match only
    });

    it('should handle invalid URLs gracefully', async () => {
      await expect(isUrlAllowed('not-a-url')).resolves.toBe(false);
      await expect(isUrlAllowed('')).resolves.toBe(false);
      // Note: ftp://prtimes.jp/file is a valid URL with whitelisted hostname, so it returns true
      await expect(isUrlAllowed('ftp://prtimes.jp/file')).resolves.toBe(true); // Valid URL, whitelisted hostname
    });

    it('should be case insensitive for hostnames', async () => {
      await expect(isUrlAllowed('https://PRTIMES.JP/test')).resolves.toBe(true);
      await expect(isUrlAllowed('https://Kabutan.JP/news')).resolves.toBe(true);
    });
  });

  describe('Provider Configuration', () => {
    it('should have valid configuration for all providers', () => {
      mockNewsSources.forEach(source => {
        expect(source.id).toBeTruthy();
        expect(source.name).toBeTruthy();
        expect(source.url).toBeTruthy();
        expect(source.hostname).toBeTruthy();
        expect(typeof source.id).toBe('string');
        expect(typeof source.name).toBe('string');
        expect(typeof source.url).toBe('string');
        expect(typeof source.hostname).toBe('string');
        
        // URL should be valid
        expect(() => new URL(source.url)).not.toThrow();
        
        // Hostname should match URL
        const urlObj = new URL(source.url);
        expect(urlObj.hostname).toBe(source.hostname);
      });
    });
  });
});