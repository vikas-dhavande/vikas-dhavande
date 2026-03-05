import React, { useState } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  wrapperClassName?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  wrapperClassName,
  ...props 
}: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      className={cn("relative overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center", wrapperClassName)}
      style={{ width, height }}
    >
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 z-10">
          <Loader2 className="w-6 h-6 text-gray-500 dark:text-gray-500 animate-spin" />
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-500 z-10">
          <ImageOff className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-xs font-medium">Failed to load image</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          referrerPolicy="no-referrer"
          {...props}
        />
      )}
    </div>
  );
}
