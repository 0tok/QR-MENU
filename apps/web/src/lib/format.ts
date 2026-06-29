import type { MenuSettings } from "@/lib/menu";

/**
 * Format a base-GEL price into the selected display currency.
 * GEL renders with no decimals; foreign currencies use 2.
 */
export function formatPrice(
  priceGel: number,
  currencyCode: string,
  settings: MenuSettings
): string {
  const currency = settings.currencies.find((c) => c.code === currencyCode);
  const value = priceGel * (currency?.rate ?? 1);
  const symbol = currency?.symbol ?? "";
  const decimals = currencyCode === "GEL" ? 0 : 2;
  return `${symbol}${value.toFixed(decimals)}`;
}
