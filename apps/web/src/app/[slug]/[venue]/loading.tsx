export default function MenuLoading() {
  return (
    <main className="mx-auto min-h-dvh max-w-[430px] bg-background shadow-[0_0_0_1px_var(--border)]">
      {/* Header */}
      <div className="flex h-13 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <div className="size-8 shrink-0 animate-pulse rounded-md bg-muted" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
            <div className="h-2.5 w-20 animate-pulse rounded bg-muted/60" />
          </div>
        </div>
        <div className="flex gap-1">
          <div className="size-9 animate-pulse rounded-md bg-muted/60" />
          <div className="size-9 animate-pulse rounded-md bg-muted/60" />
        </div>
      </div>

      {/* Selectors row */}
      <div className="flex h-11 items-center justify-between border-b px-4">
        <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
      </div>

      {/* Category nav */}
      <div className="flex h-11 items-center gap-2 overflow-hidden border-b px-4">
        {[56, 72, 64, 80, 60].map((w, i) => (
          <div
            key={i}
            className="h-7 shrink-0 animate-pulse rounded-full bg-muted"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Banner cards */}
      <div className="space-y-3 p-4">
        {[0, 1].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-muted/50" />
        ))}
      </div>

      {/* Product rows */}
      <div className="space-y-2.5 px-4 pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[20%_1fr_auto] gap-3 rounded-xl border bg-card p-2.5 shadow-sm"
          >
            <div className="aspect-square animate-pulse rounded-lg bg-muted" />
            <div className="space-y-2 py-0.5">
              <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-2.5 w-full animate-pulse rounded bg-muted/60" />
              <div className="h-2.5 w-1/2 animate-pulse rounded bg-muted/60" />
              <div className="h-3.5 w-12 animate-pulse rounded bg-muted" />
            </div>
            <div className="size-9 animate-pulse self-center rounded-full bg-muted/60" />
          </div>
        ))}
      </div>
    </main>
  );
}
