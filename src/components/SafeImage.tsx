import React, { useState } from 'react';

const LOCAL_IMAGE_FALLBACK = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" y1="0" x2="1" y2="1"%3E%3Cstop stop-color="%23e0f2fe"/%3E%3Cstop offset="1" stop-color="%23e2e8f0"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="600" height="400" fill="url(%23g)"/%3E%3Cpath d="M0 310 150 190l90 70 95-115 265 165v90H0Z" fill="%2394a3b8" opacity=".45"/%3E%3Ccircle cx="435" cy="105" r="42" fill="%230284c7" opacity=".45"/%3E%3C/svg%3E';

// Reliable, curated Unsplash & SVG fallbacks for different entity types
export const FALLBACK_IMAGES = {
  carbon: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&auto=format&fit=crop&q=80',
  geothermal: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80',
  solar: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
  wind: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=80',
  reforestation: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
  incident: LOCAL_IMAGE_FALLBACK,
  traffic: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80',
  environment: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&auto=format&fit=crop&q=80',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  city: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'
} as const;

export type FallbackType = keyof typeof FALLBACK_IMAGES;

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: FallbackType;
  customFallback?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = '',
  className = '',
  fallbackType = 'carbon',
  customFallback,
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasErrored, setHasErrored] = useState<boolean>(false);

  const defaultFallback = customFallback || FALLBACK_IMAGES[fallbackType] || FALLBACK_IMAGES.carbon;
  const placeholderLabel = alt ? alt.replace(/[-_]/g, ' ').trim().slice(0, 22) || 'Image' : 'Image';

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (imgSrc !== defaultFallback) {
      setImgSrc(defaultFallback);
    } else {
      setHasErrored(true);
    }
    if (onError) {
      onError(e);
    }
  };

  React.useEffect(() => {
    setImgSrc(src);
    setHasErrored(false);
  }, [src]);

  if (!imgSrc || hasErrored) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200 text-slate-500 ${className}`}
        aria-label={alt || 'Image unavailable'}
        title={alt || 'Image unavailable'}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-3 text-center">
          <div className="h-8 w-8 rounded-full bg-white/80 shadow-sm flex items-center justify-center text-slate-600 text-xs font-bold">
            {placeholderLabel.slice(0, 1).toUpperCase() || 'A'}
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {placeholderLabel || 'Image'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};
