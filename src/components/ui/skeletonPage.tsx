import { Skeleton } from "./skeleton"

type SkeletonPageProps = {
  blocks?: number
  showTitle?: boolean
}

export function SkeletonPage({
  blocks = 5,
  showTitle = true,
}: SkeletonPageProps) {
  return (
    <div className="p-4 space-y-4">
      {showTitle && <Skeleton className="h-6 w-48" />}

      {Array.from({ length: blocks }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}
