export default function Loading() {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-20">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold"
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}
