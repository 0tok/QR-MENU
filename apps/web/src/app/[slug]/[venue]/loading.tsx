export default function MenuLoading() {
  return (
    <main className="mx-auto min-h-dvh max-w-[28rem] animate-pulse bg-background shadow-[0_0_0_1px_var(--border)]">
      <div className="flex h-14 items-center gap-2.5 border-b px-4">
        <div className="size-9 rounded-lg bg-muted" />
        <div className="space-y-1.5">
          <div className="h-3 w-28 rounded bg-muted" />
          <div className="h-2 w-20 rounded bg-muted/70" />
        </div>
      </div>
      <div className="flex h-12 items-center justify-between border-b px-4">
        <div className="h-7 w-20 rounded-full bg-muted" />
        <div className="h-7 w-20 rounded-full bg-muted" />
      </div>
      <div className="flex gap-2 overflow-hidden px-4 py-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-7 w-20 shrink-0 rounded-full bg-muted" />
        ))}
      </div>
      <div className="px-4 py-3">
        <div className="aspect-[2/1] w-full rounded-2xl bg-muted" />
      </div>
      <div className="space-y-2.5 px-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3 rounded-2xl border p-2.5">
            <div className="size-[4.5rem] rounded-xl bg-muted" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 w-2/3 rounded bg-muted" />
              <div className="h-2 w-full rounded bg-muted/70" />
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
