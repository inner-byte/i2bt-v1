import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'glass' | 'neo';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', type, ...props }, ref) => {
    const variants = {
      default: 'border-input bg-background',
      glass: 'bg-glass/20 backdrop-blur-glass border-glass/30 placeholder:text-white/70 text-white',
      neo: 'bg-white shadow-neo dark:bg-gray-800 dark:shadow-neo-dark',
    };

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
