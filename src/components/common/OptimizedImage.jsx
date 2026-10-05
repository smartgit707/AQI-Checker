import React, { useState } from 'react';

/**
 * Optimized Image component featuring:
 * - Skeleton/blur shimmer during loading
 * - Error fallback handling
 * - Lazy loading for non-priority images
 * - Native responsive object positioning
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  priority = false,
  aspectRatio = 'aspect-video',
  objectFit = 'object-cover',
  overlay = null,
  onClick
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden bg-slate-100 ${aspectRatio} ${className}`}
      onClick={onClick}
    >
      {/* Loading shimmer placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-shimmer" />
      )}

      {/* Fallback state */}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
          <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-medium">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full ${objectFit} transition-opacity duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Optional contextual overlay gradient or vignette */}
      {overlay}
    </div>
  );
}
