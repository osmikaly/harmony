
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const TravelInfoSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Skeleton className="h-10 w-full sm:w-[300px]" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-60 w-full mt-1" />
      </div>
    </div>
  );
};
