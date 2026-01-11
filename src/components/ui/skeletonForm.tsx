import { Skeleton } from "./skeleton"

export function SkeletonForm({
  fields = 3,
  showTitle = true,
  actions = 2,
}) {
  return (
    <div className="p-4 max-w-md space-y-4">
      {showTitle && <Skeleton className="h-6 w-40" />}

      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}

      <div className="flex gap-2 pt-4">
        {Array.from({ length: actions }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24" />
        ))}
      </div>
    </div>
  )
}
