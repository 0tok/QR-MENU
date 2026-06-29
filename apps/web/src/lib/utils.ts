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
