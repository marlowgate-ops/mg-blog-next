import { z } from 'zod';

/**
 * Parse URL search parameters using a Zod schema
 */
export function parseParams<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams
): T {
  const obj: Record<string, unknown> = {};
  
  // Convert URLSearchParams to object, handling repeated keys as arrays
  for (const [key, value] of searchParams.entries()) {
    if (obj[key]) {
      // Convert to array if we have multiple values
      if (Array.isArray(obj[key])) {
        (obj[key] as string[]).push(value);
      } else {
        obj[key] = [obj[key] as string, value];
      }
    } else {
      obj[key] = value;
    }
  }
  
  return schema.parse(obj);
}

/**
 * Merge current URL parameters with a patch object
 * Never drops existing keys, arrays encoded as repeated keys
 */
export function mergeParams(
  current: URLSearchParams,
  patch: Record<string, unknown>
): URLSearchParams {
  const result = new URLSearchParams(current);
  
  for (const [key, value] of Object.entries(patch)) {
    // Remove existing values for this key
    result.delete(key);
    
    if (value === null || value === undefined || value === '') {
      // Skip empty values (effectively removes the param)
      continue;
    }
    
    if (Array.isArray(value)) {
      // Add each array item as a separate param
      for (const item of value) {
        if (item !== null && item !== undefined && item !== '') {
          result.append(key, String(item));
        }
      }
    } else {
      result.set(key, String(value));
    }
  }
  
  return result;
}

/**
 * Build a stable URL with sorted parameters
 */
export function buildUrl(path: string, params: URLSearchParams): string {
  // Sort parameters for stability
  const sortedParams = new URLSearchParams();
  const keys = Array.from(params.keys()).sort();
  
  for (const key of keys) {
    const values = params.getAll(key).sort();
    for (const value of values) {
      sortedParams.append(key, value);
    }
  }
  
  const queryString = sortedParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}