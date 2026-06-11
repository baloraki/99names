function NamesGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-white/10 bg-surface p-4"
        >
          <div className="mb-3 h-8 w-2/3 rounded bg-surface-soft" />
          <div className="mb-2 h-4 w-1/2 rounded bg-surface-soft" />
          <div className="h-3 w-3/4 rounded bg-surface-soft" />
        </div>
      ))}
    </div>
  )
}

export default function NamesLoading() {
  return <NamesGridSkeleton />
}
