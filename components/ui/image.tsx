"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function OptimizedImage({ src, alt, fill, className, priority, sizes }: OptimizedImageProps) {
  const [error, setError] = useState(false);
  
  const handleError = () => {
    setError(true);
  };
  
  if (error) {
    return (
      <div className={`bg-secondary flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={handleError}
      unoptimized={src.startsWith('http')}
    />
  );
}
