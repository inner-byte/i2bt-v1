'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'neo' | 'frosted';
  hover?: boolean;
}

export const GlassCard = ({
  children,
  className,
  variant = 'default',
  hover = true,
}: GlassCardProps) => {
  const baseStyles = 'rounded-xl backdrop-blur-glass';
  
  const variants = {
    default: 'bg-glass/30 shadow-glass border border-glass/20',
    neo: 'bg-white shadow-neo dark:bg-gray-800 dark:shadow-neo-dark',
    frosted: 'bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg',
  };
  
  const hoverStyles = hover
    ? 'transition-all duration-300 hover:scale-[1.02] hover:shadow-xl'
    : '';

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        hoverStyles,
        className
      )}
    >
      {children}
    </div>
  );
};
