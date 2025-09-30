/**
 * Canonical URL utilities for SEO compliance
 * - Strip tracking parameters
 * - Enforce lowercase hostname
 * - Remove duplicate slashes
 * - Handle vendor names in content
 */

const TRACKING_PARAMS = [
  // UTM parameters
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  // Google Analytics
  'gclid', 'gclsrc', 'dclid',
  // Facebook
  'fbclid',
  // Microsoft
  'msclkid',
  // Other tracking
  'ref', 'source', 'campaign', 'affiliate_id', 'partner_id',
  // Common tracking suffixes
  '_campaign', '_source', '_medium', '_term', '_content'
];

/**
 * Clean and canonicalize a URL for SEO compliance
 */
export function canonicalizeUrl(url: string | URL): string {
  try {
    const urlObj = new URL(url);
    
    // Enforce lowercase hostname
    urlObj.hostname = urlObj.hostname.toLowerCase();
    
    // Strip tracking parameters
    TRACKING_PARAMS.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    
    // Remove duplicate slashes from pathname
    urlObj.pathname = urlObj.pathname.replace(/\/+/g, '/');
    
    // Remove trailing slash unless it's the root
    if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }
    
    return urlObj.toString();
  } catch (error) {
    console.warn('Failed to canonicalize URL:', url, error);
    return String(url);
  }
}

/**
 * Get canonical URL for the current page
 */
export function getCanonicalUrl(baseUrl?: string): string {
  if (typeof window === 'undefined') {
    return baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://marlowgate.com';
  }
  
  return canonicalizeUrl(window.location.href);
}

/**
 * Strip vendor names from article content to avoid conflicts
 */
export function sanitizeContent(content: string): string {
  // List of vendor/brand names that should not appear in article bodies
  const forbiddenVendors = [
    'DMM FX',
    'GMOクリック証券',
    'SBI FXトレード',
    'MATSUI FX',
    'みんなのFX',
    'LIGHT FX',
    'FXブロードネット',
    'マネーパートナーズ',
    'ヒロセ通商',
    'JFX',
    'インヴァスト証券',
    'マネースクエア',
    'セントラル短資',
    'アイネット証券',
  ];
  
  let sanitized = content;
  
  // Replace specific vendor mentions with generic terms
  forbiddenVendors.forEach(vendor => {
    const regex = new RegExp(vendor, 'gi');
    sanitized = sanitized.replace(regex, 'FX業者');
  });
  
  return sanitized;
}

/**
 * Validate that a URL is canonical compliant
 */
export function isCanonicalCompliant(url: string): boolean {
  try {
    const original = new URL(url);
    const canonical = new URL(canonicalizeUrl(url));
    
    return original.toString() === canonical.toString();
  } catch {
    return false;
  }
}

/**
 * Get canonical metadata for Next.js pages
 */
export function getCanonicalMetadata(pathname: string, baseUrl?: string) {
  const base = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://marlowgate.com';
  const cleanPathname = pathname.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  const canonical = `${base.replace(/\/$/, '')}${cleanPathname}`;
  
  return {
    canonical,
    alternates: {
      canonical
    }
  };
}