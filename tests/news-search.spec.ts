import { describe, it, expect } from 'vitest';

describe('News API', () => {
  it('should handle search query parameter', async () => {
    const url = new URL('http://localhost:3000/api/news');
    url.searchParams.set('q', 'FX');
    url.searchParams.set('period', 'week');
    url.searchParams.set('limit', '10');
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('query', 'FX');
    expect(Array.isArray(data.items)).toBe(true);
  });

  it('should filter items by search query', async () => {
    const url = new URL('http://localhost:3000/api/news');
    url.searchParams.set('q', 'nonexistentterm123456');
    url.searchParams.set('period', 'week');
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.items.length).toBe(0);
  });

  it('should support multiple search terms', async () => {
    const url = new URL('http://localhost:3000/api/news');
    url.searchParams.set('q', 'FX 投資');
    url.searchParams.set('period', 'week');
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('query', 'FX 投資');
  });

  it('should handle providers and search together', async () => {
    const url = new URL('http://localhost:3000/api/news');
    url.searchParams.set('q', 'market');
    url.searchParams.set('providers', 'reuters,bloomberg');
    url.searchParams.set('period', 'day');
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('query', 'market');
  });

  it('should handle pagination with search', async () => {
    const url = new URL('http://localhost:3000/api/news');
    url.searchParams.set('q', 'FX');
    url.searchParams.set('limit', '5');
    url.searchParams.set('offset', '0');
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.items.length).toBeLessThanOrEqual(5);
    expect(typeof data.nextOffset).toBe('number');
  });
});