// hooks/usePerformance.ts
import { useCallback, useEffect, useRef, useState } from 'react';

export interface PerformanceEntry {
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  type: 'navigation' | 'resource' | 'measure' | 'paint';
}

export interface WebVitals {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export function usePerformanceMonitor() {
  const [vitals, setVitals] = useState<WebVitals>({});
  const [entries, setEntries] = useState<PerformanceEntry[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Observe performance entries
    const observer = new PerformanceObserver((list) => {
      const newEntries = list.getEntries().map(entry => ({
        name: entry.name,
        duration: entry.duration,
        startTime: entry.startTime,
        endTime: entry.startTime + entry.duration,
        type: entry.entryType as any,
      }));

      setEntries(prev => [...prev, ...newEntries].slice(-100)); // Keep last 100 entries
    });

    // Observe different types of performance entries
    observer.observe({ entryTypes: ['navigation', 'resource', 'measure', 'paint'] });

    // Web Vitals measurement
    const measureWebVitals = () => {
      try {
        // First Contentful Paint
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
          setVitals(prev => ({ ...prev, fcp: fcpEntry.startTime }));
        }

        // Time to First Byte
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navEntry) {
          setVitals(prev => ({ 
            ...prev, 
            ttfb: navEntry.responseStart - navEntry.requestStart 
          }));
        }
      } catch (error) {
        console.warn('Performance measurement error:', error);
      }
    };

    measureWebVitals();

    // Measure periodically
    const interval = setInterval(measureWebVitals, 5000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return {
    vitals,
    entries,
    getEntryByName: (name: string) => entries.find(entry => entry.name === name),
    getEntriesByType: (type: string) => entries.filter(entry => entry.type === type),
  };
}

export function useMeasureRender(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef<number>(0);
  const [renderMetrics, setRenderMetrics] = useState({
    count: 0,
    averageTime: 0,
    lastRenderTime: 0,
  });

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - startTime.current;
    
    setRenderMetrics(prev => ({
      count: renderCount.current,
      lastRenderTime: renderTime,
      averageTime: prev.averageTime === 0 
        ? renderTime 
        : (prev.averageTime + renderTime) / 2
    }));

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    }
  }, [componentName]);

  // Mark start of render
  startTime.current = performance.now();

  return renderMetrics;
}

export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

export function useThrottleCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef<number>(0);
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = now;
    }
  }, [callback, delay]) as T;
}

export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  // Use useRef to store callback and manually control dependencies
  const callbackRef = useRef(callback);
  const depsRef = useRef(deps);
  
  // Update callback if deps have changed
  if (!depsRef.current || deps.some((dep, index) => dep !== depsRef.current![index])) {
    callbackRef.current = callback;
    depsRef.current = deps;
  }
  
  return useCallback((...args: any[]) => callbackRef.current(...args), []) as T;
}

// Hook for measuring async operations
export function useAsyncPerformance() {
  const [operations, setOperations] = useState<Map<string, number>>(new Map());

  const measureAsync = useCallback(async <T>(
    name: string, 
    operation: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      setOperations(prev => new Map(prev).set(name, duration));
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      setOperations(prev => new Map(prev).set(`${name}_error`, duration));
      throw error;
    }
  }, []);

  return {
    measureAsync,
    operations: Array.from(operations.entries()).map(([name, duration]) => ({
      name,
      duration,
    })),
    getOperationTime: (name: string) => operations.get(name),
  };
}