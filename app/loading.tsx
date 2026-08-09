import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route-level skeleton shown while a public page's server data streams
 * in (first load + client-side navigation). Content pages must never
 * fall back to default/placeholder copy — the skeleton is what stands
 * in during loading instead.
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-wff-dark pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center mb-20">
          <Skeleton className="h-3 w-40 bg-white/10" />
          <Skeleton className="h-14 w-72 md:w-96 bg-white/10 mt-6" />
          <Skeleton className="h-4 w-96 max-w-full bg-white/10 mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full bg-white/10" />
              <Skeleton className="h-5 w-3/4 bg-white/10" />
              <Skeleton className="h-4 w-1/2 bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
