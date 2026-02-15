import { Skeleton } from '@/components/ui/skeleton';

export default function ResultsLoading() {
  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <Skeleton className="h-8 w-48 mb-6" />
      <Skeleton className="h-72 mb-8" />
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-48" />
    </div>
  );
}
