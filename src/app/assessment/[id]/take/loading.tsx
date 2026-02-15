import { Skeleton } from '@/components/ui/skeleton';

export default function AssessmentTakeLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
      <div className="border-b px-4 py-2">
        <div className="flex gap-1.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-full" />
          ))}
        </div>
      </div>
      <div className="p-4 max-w-4xl mx-auto">
        <Skeleton className="h-6 w-64 mb-4" />
        <Skeleton className="h-8 w-96 mb-6" />
        <Skeleton className="h-48 mb-6" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
