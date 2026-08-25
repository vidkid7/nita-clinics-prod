import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantClasses = {
    default: 'border-transparent bg-primary-600 text-white',
    secondary: 'border-transparent bg-neutral-100 text-neutral-700',
    outline: 'border border-neutral-300 text-neutral-700 bg-transparent',
    destructive: 'border-transparent bg-red-600 text-white',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
