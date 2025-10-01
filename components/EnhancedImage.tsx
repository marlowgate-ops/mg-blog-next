// components/EnhancedImage.tsx
'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useCallback, useRef, useEffect } from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformance';

interface EnhancedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  loadingStrategy?: 'lazy' | 'eager' | 'auto';
  performanceMonitoring?: boolean;
  onLoadComplete?: (result: { naturalWidth: number; naturalHeight: number; loadTime: number }) => void;
  onLoadError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
  quality?: number;
  blurDataURL?: string;
  placeholder?: 'blur' | 'empty';
}

export default function EnhancedImage({
  fallbackSrc,
  loadingStrategy = 'auto',
  performanceMonitoring = false,
  onLoadComplete,
  onLoadError,
  retryCount = 3,
  retryDelay = 1000,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  ...props
}: EnhancedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(props.src);
  const [hasError, setHasError] = useState(false);
  const [retries, setRetries] = useState(0);
  const [loadStartTime, setLoadStartTime] = useState<number>(0);
  const { vitals } = usePerformanceMonitor();
  const imageRef = useRef<HTMLImageElement>(null);

  // Auto-detect loading strategy based on viewport
  const getLoadingStrategy = useCallback(() => {
    if (loadingStrategy !== 'auto') return loadingStrategy;
    
    // Use Intersection Observer to determine if image is in viewport
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      return 'lazy'; // Default to lazy for auto mode
    }
    return 'eager';
  }, [loadingStrategy]);

  const handleLoadStart = useCallback(() => {
    setLoadStartTime(performance.now());
  }, []);

  const handleLoadComplete = useCallback((img: HTMLImageElement) => {
    const loadTime = performance.now() - loadStartTime;
    
    if (performanceMonitoring) {
      console.log(`[Image Performance] ${props.src} loaded in ${loadTime.toFixed(2)}ms`);
    }
    
    onLoadComplete?.({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      loadTime,
    });
    
    setHasError(false);
    setRetries(0);
  }, [loadStartTime, performanceMonitoring, props.src, onLoadComplete]);

  const handleError = useCallback(() => {
    if (retries < retryCount && !hasError) {
      // Retry with delay
      setTimeout(() => {
        setRetries(prev => prev + 1);
        setCurrentSrc(`${props.src}?retry=${retries + 1}`);
      }, retryDelay);
    } else if (fallbackSrc && currentSrc !== fallbackSrc) {
      // Use fallback image
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      // Final error state
      setHasError(true);
      onLoadError?.(new Error(`Failed to load image: ${props.src}`));
    }
  }, [retries, retryCount, hasError, fallbackSrc, currentSrc, props.src, retryDelay, onLoadError]);

  // Preload critical images
  useEffect(() => {
    if (props.priority && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = currentSrc as string;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [props.priority, currentSrc]);

  // Monitor LCP for performance
  useEffect(() => {
    if (performanceMonitoring && vitals.lcp && imageRef.current) {
      const img = imageRef.current;
      if (img.complete && img.naturalWidth > 0) {
        console.log(`[LCP Impact] Image ${props.src} - LCP: ${vitals.lcp}ms`);
      }
    }
  }, [vitals.lcp, performanceMonitoring, props.src]);

  if (hasError && !fallbackSrc) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-200 text-gray-500"
        style={{ width: props.width, height: props.height }}
      >
        <span>Image failed to load</span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      ref={imageRef}
      src={currentSrc}
      loading={getLoadingStrategy()}
      quality={quality}
      placeholder={blurDataURL ? 'blur' : placeholder}
      blurDataURL={blurDataURL}
      onLoadingComplete={handleLoadComplete}
      onLoad={handleLoadStart}
      onError={handleError}
      alt={props.alt || ''}
    />
  );
}