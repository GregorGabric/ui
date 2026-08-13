import { Skeleton } from "preskok"

export function CardLayout() {
  return (
    <div className="w-full max-w-sm space-y-3 rounded-lg border p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-24 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded" />
      </div>
    </div>
  )
}

export function ListLayout() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <Skeleton className="h-6 w-48" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 rounded border p-3">
          <Skeleton className="h-12 w-16 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}
