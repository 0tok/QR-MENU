import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold tracking-tight">QR Menu</h1>
      <p className="text-muted-foreground">
        Customer-facing menu powered by PostgreSQL. Try the demo:
      </p>
      <Link
        href="/demo-restaurant/v1?table=3"
        className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        Open Samani Kitchen (Table 3)
      </Link>
    </main>
  );
}
