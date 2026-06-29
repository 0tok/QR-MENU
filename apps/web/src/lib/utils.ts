import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type I18nMap = Record<string, string>;

export function t(map: I18nMap | null | undefined, lang: string, fallback = ""): string {
  if (!map) return fallback;
  return map[lang] ?? map.en ?? Object.values(map)[0] ?? fallback;
}

export function isRtlLanguage(code: string, languages: { code: string; rtl?: boolean }[]): boolean {
  return languages.find((l) => l.code === code)?.rtl ?? false;
}

export function safeHttpUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
  } catch {
    /* invalid URL */
  }
  return null;
}

export function parseTableNumber(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!/^[A-Za-z0-9-]{1,16}$/.test(trimmed)) return undefined;
  return trimmed;
}
