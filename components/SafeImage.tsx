'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
  fallbackText?: string;
  className?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80';

export function SafeImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  fallbackText,
  className = '',
  ...props
}: SafeImageProps) {
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set());
  const [loadedSrcs, setLoadedSrcs] = useState<Set<string>>(new Set());

  const stringSrc = typeof src === 'string' && src.trim() ? src : '';
  const currentSrc: string = !stringSrc
    ? fallbackSrc
    : failedSrcs.has(stringSrc)
    ? fallbackSrc
    : stringSrc;

  const isCurrentFailed = failedSrcs.has(currentSrc);
  const isLoading = !isCurrentFailed && !loadedSrcs.has(currentSrc);

  const handleError = () => {
    if (currentSrc) {
      setFailedSrcs((prev) => new Set(prev).add(currentSrc));
    }
  };

  const handleLoad = () => {
    if (currentSrc) {
      setLoadedSrcs((prev) => new Set(prev).add(currentSrc));
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#faf5f6]">
      {/* Loading Skeleton Pulse */}
      {isLoading && !isCurrentFailed && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#f3e5e8] via-[#faedf0] to-[#f3e5e8] animate-pulse z-1" />
      )}

      {isCurrentFailed ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#f8f1f2] text-[#3d0a14] text-center">
          <div className="w-10 h-10 rounded-full bg-[#faedf0] border border-[#ebd9dc] flex items-center justify-center mb-2 text-[#c89d46]">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold tracking-wider uppercase font-royal">Suit Bliss Aura</span>
          <span className="text-[10px] text-[#785f63] mt-0.5 line-clamp-1">
            {fallbackText || alt || 'Silk Mark Certified Masterpiece'}
          </span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt || 'Suit Bliss Aura Ethnic Garment'}
          onError={handleError}
          onLoad={handleLoad}
          className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          {...props}
        />
      )}
    </div>
  );
}

export default SafeImage;
