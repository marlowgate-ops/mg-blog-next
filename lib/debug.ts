/**
 * Debug utility that only logs in development or when NEXT_PUBLIC_DEBUG is set
 */
export const debug = (...args: any[]) => {
  if (process.env.NEXT_PUBLIC_DEBUG === '1' || process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};