'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * Shown in place of a homepage section the admin hasn't populated yet —
 * never default/fallback marketing copy.
 */
export function SectionSkeleton() {
  return (
    <section className="py-24 relative bg-wff-dark border-b border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center gap-5 py-10">
          <Skeleton className="h-3 w-36 bg-white/10" />
          <Skeleton className="h-12 w-72 md:w-96 bg-white/10" />
          <Skeleton className="h-4 w-96 max-w-full bg-white/10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
            <Skeleton className="h-64 w-full bg-white/10" />
            <Skeleton className="h-64 w-full bg-white/10" />
            <Skeleton className="h-64 w-full bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
