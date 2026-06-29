"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Single transient toast message with auto-dismiss.
 */
export function useToast(durationMs = 2400) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), durationMs);
    return () => clearTimeout(timer);
  }, [message, durationMs]);

  const show = useCallback((text: string) => setMessage(text), []);

  return { message, show };
}
