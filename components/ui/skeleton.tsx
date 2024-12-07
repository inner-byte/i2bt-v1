'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <motion.div
      className={`bg-gray-200 rounded-lg animate-pulse ${className}`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1
      }}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <Skeleton className="h-48 w-full mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-2/3" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
      <Skeleton className="h-[500px] w-full rounded-2xl" />
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
          <Skeleton className="h-12 w-12 rounded-xl mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
};
