import type { CSSProperties } from "react";

export type ThemeTokens = Record<string, string>;

const COLOR_RE =
  /^(#[0-9a-f]{3,8}|rgba?\([\d.,\s/%]+\)|hsla?\([\d.,\s/%]+\)|oklch\([\d.%\s,/-]+\)|[a-z]+)$/i;
const LENGTH_RE = /^[\d.]+(px|rem|em|%)$/;

export function themeStyle(tokens: ThemeTokens | null | undefined): CSSProperties {
  if (!tokens) return {};
  const style: Record<string, string> = {};
  if (tokens.primary && COLOR_RE.test(tokens.primary)) {
    style["--primary"] = tokens.primary;
    style["--ring"] = tokens.primary;
  }
  if (tokens.radius && LENGTH_RE.test(tokens.radius)) {
    style["--radius"] = tokens.radius;
  }
  return style as CSSProperties;
}

export function isSectionEnabled(
  sections: { type: string; enabled: boolean }[] | undefined,
  type: string
): boolean {
  return sections?.find((s) => s.type === type)?.enabled ?? true;
}
