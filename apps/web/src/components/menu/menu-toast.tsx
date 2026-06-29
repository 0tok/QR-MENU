"use client";

import { useMenu } from "./menu-context";

export function MenuToast() {
  const { toast } = useMenu();
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4"
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 max-w-[20rem] rounded-full border bg-foreground/90 px-4 py-2 text-center text-xs font-medium text-background shadow-lg backdrop-blur-sm">
        {toast}
      </div>
    </div>
  );
}
