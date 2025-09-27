import Image, { ImageProps } from 'next/image';
import { forwardRef } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'loading'> {
  priority?: boolean;
  lazy?: boolean;
}

/**
 * Optimized image component for Core Web Vitals
 * - Explicit dimensions to prevent CLS
 * - Lazy loading for below-fold content
 * - Priority loading for LCP images
 */
const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({
  priority = false,
  lazy = true,
  alt,
  width,
  height,
  ...props
}, ref) => {
  // Ensure dimensions are provided to prevent CLS
  if (!width || !height) {
    console.warn('OptimizedImage: width and height must be provided to prevent CLS');
  }

  return (
    <Image
      {...props}
      ref={ref}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? undefined : lazy ? 'lazy' : 'eager'}
      priority={priority}
      style={{
        ...props.style,
        // Ensure stable dimensions
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;