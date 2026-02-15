import { Skeleton } from '@/components/ui/skeleton';

export default function AssessmentLoading() {
  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <Skeleton className="h-10 w-72 mb-2" />
      <Skeleton className="h-5 w-96 mb-8" />
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
