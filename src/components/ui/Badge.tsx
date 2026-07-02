import React from 'react';
import { cn } from '@/lib/utils/cn';

const variantStyles = {
  default: 'bg-mag-dark text-mag-light border border-mag-border',
  gold: 'bg-gold-400/10 text-gold-400 border border-gold-400/20',
  // Premium editorial tones: solid = pressable-looking; outline = passive tag.
  solid: 'bg-gold-400 text-mag-black',
  outline: 'border border-gold-400/40 text-gold-400',
  success: 'bg-green-500/10 text-green-400',
  warning: 'bg-yellow-500/10 text-yellow-400',
  danger: 'bg-red-500/10 text-red-400',
} as const;

interface BadgeProps {
  variant?: keyof typeof variantStyles;
  children: React.ReactNode;
  className?: string;
}

function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export { Badge, type BadgeProps };
