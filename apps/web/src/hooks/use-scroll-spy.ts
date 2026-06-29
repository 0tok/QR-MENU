"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks which section is most visible in the viewport and exposes a registrar
 * to attach section elements. Used to highlight the active category chip.
 */
export function useScrollSpy(ids: string[], enabled: boolean) {
  const [activeId, setActiveId] = useState(ids[0] ?? "");
  const refs = useRef<Map<string, HTMLElement>>(new Map());

  const register = (id: string) => (el: HTMLElement | null) => {
    if (el) refs.current.set(id, el);
    else refs.current.delete(id);
  };

  useEffect(() => {
    if (!enabled) return;
    const elements = ids
      .map((id) => refs.current.get(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id.replace("category-", ""));
      },
      { rootMargin: "-120px 0px -55% 0px", threshold: [0.15, 0.4, 0.7] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, enabled]);

  return { activeId, register, setActiveId };
}
