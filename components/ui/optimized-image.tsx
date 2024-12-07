'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className={`relative ${className}`}
    >
      {(isIntersecting || priority) && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ aspectRatio: width / height }}
        />
      )}
    </motion.div>
  );
}
