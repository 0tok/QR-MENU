"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function read(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

type Updater = string | ((prev: string) => string);

/**
 * Persisted string value backed by localStorage.
 *
 * Uses `useSyncExternalStore` so reads stay in sync across tabs and renders
 * without setState-in-effect, and SSR uses the provided initial value to avoid
 * hydration mismatches.
 */
export function usePersistedValue(
  key: string,
  initial: string
): [string, (value: Updater) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key, initial),
    () => initial
  );

  const setValue = useCallback(
    (next: Updater) => {
      const resolved = typeof next === "function" ? next(read(key, initial)) : next;
      try {
        localStorage.setItem(key, resolved);
      } catch {
        /* storage unavailable */
      }
      // Notify same-tab listeners (native 'storage' only fires across tabs).
      window.dispatchEvent(new StorageEvent("storage", { key }));
    },
    [key, initial]
  );

  return [value, setValue];
}
