import { Skeleton } from "./Skeleton";

export function AnalysisSkeleton() {
  return (
    <div className="space-y-4">
      <div className="surface-card">
        <Skeleton className="h-3 w-32 mb-3" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="surface-card">
        <Skeleton className="h-3 w-36 mb-3" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="surface-card">
        <Skeleton className="h-3 w-40 mb-3" />
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="surface-card">
        <Skeleton className="h-3 w-44 mb-3" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
