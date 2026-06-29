import Link from "next/link";
import { QrCode } from "lucide-react";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl border bg-muted">
        <QrCode className="size-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">QR Menu</h1>
        <p className="text-muted-foreground">
          Beautiful digital menus — scan, browse, and enjoy.
        </p>
      </div>
      <Link
        href="/demo-restaurant/v1?table=3"
        className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground"
      >
        View demo menu → Table 3
      </Link>
    </main>
  );
}
