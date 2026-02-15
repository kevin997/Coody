import { Skeleton } from '@/components/ui/skeleton';

export default function LeaderboardLoading() {
  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <Skeleton className="h-8 w-48 mb-6" />
      <Skeleton className="h-10 w-72 mb-2" />
      <Skeleton className="h-5 w-96 mb-8" />
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    </div>
  );
}
