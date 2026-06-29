"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-5 p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl border bg-muted">
        <AlertTriangle className="size-8 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-muted-foreground">We could not load the menu. Please try again.</p>
      </div>
      <Button onClick={reset} className="h-11 px-6">
        Try again
      </Button>
    </main>
  );
}
