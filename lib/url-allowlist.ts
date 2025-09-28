import { readFile } from 'fs/promises';
import { join } from 'path';

interface NewsSource {
  id: string;
  name: string;
  hostname: string;
  icon: string;
}

let cachedAllowlist: string[] | null = null;

async function getAllowedHostnames(): Promise<string[]> {
  if (cachedAllowlist) {
    return cachedAllowlist;
  }

  try {
    const newsSourcesPath = join(process.cwd(), 'config', 'news-sources.json');
    const newsSourcesContent = await readFile(newsSourcesPath, 'utf8');
    const sources: NewsSource[] = JSON.parse(newsSourcesContent);
    
    cachedAllowlist = sources.map(source => source.hostname.toLowerCase());
    return cachedAllowlist;
  } catch (error) {
    console.warn('Failed to load news sources allowlist:', error);
    return [];
  }
}

/**
 * Normalizes a hostname by converting to lowercase and handling punycode/international domains
 * @param hostname - The hostname to normalize
 * @returns Normalized hostname string
 */
function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().trim();
}

/**
 * Extracts hostname from a URL string
 * @param url - The URL to extract hostname from
 * @returns Hostname string or null if invalid
 */
function extractHostname(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return normalizeHostname(urlObj.hostname);
  } catch {
    return null;
  }
}

/**
 * Checks if a URL is allowed based on the configured news sources allowlist
 * @param url - The URL to validate
 * @returns Promise<boolean> - true if URL hostname is in allowlist
 */
export async function isUrlAllowed(url: string): Promise<boolean> {
  const hostname = extractHostname(url);
  if (!hostname) {
    return false;
  }

  const allowedHostnames = await getAllowedHostnames();
  return allowedHostnames.includes(hostname);
}

/**
 * Validates multiple URLs against the allowlist
 * @param urls - Array of URLs to validate  
 * @returns Promise<boolean[]> - Array of validation results
 */
export async function validateUrls(urls: string[]): Promise<boolean[]> {
  const allowedHostnames = await getAllowedHostnames();
  
  return urls.map(url => {
    const hostname = extractHostname(url);
    return hostname ? allowedHostnames.includes(hostname) : false;
  });
}

/**
 * Filters an array of URLs to only include allowed ones
 * @param urls - Array of URLs to filter
 * @returns Promise<string[]> - Array of allowed URLs
 */
export async function filterAllowedUrls(urls: string[]): Promise<string[]> {
  const validationResults = await validateUrls(urls);
  return urls.filter((_, index) => validationResults[index]);
}