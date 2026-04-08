import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-shimmer rounded-lg bg-mag-dark', className)}
      aria-hidden="true"
    />
  );
}

export { Skeleton, type SkeletonProps };
