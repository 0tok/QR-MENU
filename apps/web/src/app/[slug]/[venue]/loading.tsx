import { Skeleton } from "@/components/ui/skeleton";

export default function MenuLoading() {
  return (
    <main className="mx-auto min-h-dvh max-w-[28rem] bg-background shadow-[0_0_0_1px_var(--border)]">
      <div className="flex h-14 items-center gap-2.5 border-b px-4">
        <Skeleton className="size-9 rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-2 w-20" />
        </div>
      </div>
      <div className="flex h-12 items-center justify-between border-b px-4">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
      <div className="flex gap-2 overflow-hidden px-4 py-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="px-4 py-3">
        <Skeleton className="aspect-[2/1] w-full rounded-2xl" />
      </div>
      <div className="space-y-2.5 px-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3 rounded-2xl border p-2.5">
            <Skeleton className="size-[4.5rem] rounded-xl" />
            <div className="flex-1 space-y-2 py-1">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
