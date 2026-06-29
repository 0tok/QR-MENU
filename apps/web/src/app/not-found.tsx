import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-5 p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl border bg-muted">
        <UtensilsCrossed className="size-8 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Menu not found</h1>
        <p className="text-muted-foreground">
          This restaurant or venue does not exist or is not active.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground"
      >
        Go home
      </Link>
    </main>
  );
}
