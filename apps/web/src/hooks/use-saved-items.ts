"use client";

import { useCallback, useMemo } from "react";
import { usePersistedValue } from "./use-local-storage";

type SavedItems = {
  ids: Set<string>;
  count: number;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
};

/**
 * Set of saved product ids persisted to localStorage (no account needed).
 */
export function useSavedItems(storageKey: string): SavedItems {
  const [raw, setRaw] = usePersistedValue(storageKey, "[]");

  const ids = useMemo<Set<string>>(() => {
    try {
      return new Set(JSON.parse(raw) as string[]);
    } catch {
      return new Set();
    }
  }, [raw]);

  const toggle = useCallback(
    (id: string) => {
      setRaw((prev) => {
        let parsed: string[];
        try {
          parsed = JSON.parse(prev) as string[];
        } catch {
          parsed = [];
        }
        const set = new Set(parsed);
        if (set.has(id)) set.delete(id);
        else set.add(id);
        return JSON.stringify([...set]);
      });
    },
    [setRaw]
  );

  return {
    ids,
    count: ids.size,
    has: useCallback((id: string) => ids.has(id), [ids]),
    toggle,
  };
}
