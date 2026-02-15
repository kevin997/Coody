import { Skeleton } from '@/components/ui/skeleton';

export default function AssessmentDetailLoading() {
  return (
    <div className="container px-4 py-8 max-w-3xl mx-auto">
      <Skeleton className="h-8 w-48 mb-6" />
      <Skeleton className="h-10 w-64 mb-2" />
      <Skeleton className="h-5 w-full mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-48 mb-6" />
      <Skeleton className="h-36" />
    </div>
  );
}
