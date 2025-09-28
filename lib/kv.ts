import { createClient } from '@vercel/kv';

// Support both Vercel KV and Upstash Redis environment variable schemes
const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Create KV client with fallback support
let kv: ReturnType<typeof createClient> | null = null;

if (kvUrl && kvToken) {
  try {
    kv = createClient({
      url: kvUrl,
      token: kvToken,
    });
  } catch (error) {
    console.warn('Failed to initialize KV client:', error);
  }
}

// Safe wrapper functions that gracefully handle KV unavailability
export const safeKvSet = async (key: string, value: any, options?: { ex?: number }) => {
  if (!kv) return false;
  try {
    if (options?.ex) {
      await kv.setex(key, options.ex, value);
    } else {
      await kv.set(key, value);
    }
    return true;
  } catch (error) {
    console.warn('KV set failed:', error);
    return false;
  }
};

export const safeKvGet = async (key: string) => {
  if (!kv) return null;
  try {
    return await kv.get(key);
  } catch (error) {
    console.warn('KV get failed:', error);
    return null;
  }
};

export const safeKvZincrby = async (key: string, increment: number, member: string) => {
  if (!kv) return false;
  try {
    await kv.zincrby(key, increment, member);
    return true;
  } catch (error) {
    console.warn('KV zincrby failed:', error);
    return false;
  }
};

export const safeKvZrevrange = async (key: string, start: number, stop: number, withScores = false) => {
  if (!kv) return [];
  try {
    if (withScores) {
      // @ts-ignore - VercelKV types might be incomplete
      return await kv.zrevrange(key, start, stop, { withscores: true });
    } else {
      // @ts-ignore - VercelKV types might be incomplete
      return await kv.zrevrange(key, start, stop);
    }
  } catch (error) {
    console.warn('KV zrevrange failed:', error);
    return [];
  }
};

export const safeKvExists = async (key: string) => {
  if (!kv) return false;
  try {
    const result = await kv.exists(key);
    return result === 1;
  } catch (error) {
    console.warn('KV exists failed:', error);
    return false;
  }
};

export { kv };
export const isKvAvailable = !!kv;