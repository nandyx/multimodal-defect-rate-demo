import { Skeleton } from "../atoms/Skeleton";

export function ClaimDetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-11 w-full rounded-card" />
      <div className="surface-card">
        <Skeleton className="h-3 w-28 mb-3" />
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="surface-muted space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <Skeleton className="thumb-claim-detail" />
        </div>
      </div>
      <div className="surface-card space-y-5">
        <div>
          <Skeleton className="h-3 w-24 mb-3" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Skeleton className="h-16 rounded-inner" />
            <Skeleton className="h-16 rounded-inner" />
          </div>
          <Skeleton className="h-16 rounded-inner" />
        </div>
        <div>
          <Skeleton className="h-3 w-24 mb-3" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Skeleton className="h-16 rounded-inner" />
            <Skeleton className="h-16 rounded-inner" />
          </div>
          <Skeleton className="h-48 rounded-inner" />
        </div>
      </div>
    </div>
  );
}
