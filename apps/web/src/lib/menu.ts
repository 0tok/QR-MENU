import { ProductAvailability } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { I18nMap } from "@/lib/utils";

export type MenuSettings = {
  currencies: { code: string; symbol: string; rate: number }[];
  defaultCurrency: string;
  languages: { code: string; label: string; rtl: boolean }[];
  defaultLanguage: string;
  fxNote: I18nMap;
  unavailableModeDefault: "hide" | "unavailable";
  location: {
    label: I18nMap;
    address: I18nMap;
    mapsUrl: string;
  };
};

export type MenuProduct = {
  id: string;
  slug: string;
  name: I18nMap;
  description: I18nMap;
  priceGel: number;
  imageUrl: string | null;
  badges: string[];
  availability: ProductAvailability;
  fields: { key: string; label: I18nMap; value: unknown }[];
};

export type MenuCategory = {
  id: string;
  slug: string;
  name: I18nMap;
  description: I18nMap | null;
  products: MenuProduct[];
};

export type MenuPayload = {
  organization: {
    slug: string;
    name: I18nMap;
    tagline: I18nMap | null;
    logoUrl: string | null;
    social: Record<string, string> | null;
  };
  location: {
    slug: string;
    name: I18nMap | null;
    address: I18nMap | null;
    mapsUrl: string | null;
  };
  settings: MenuSettings;
  badgeLabels: Record<string, I18nMap>;
  ui: Record<string, unknown>;
  theme: {
    presetId: string;
    tokens: Record<string, string>;
    sections: { type: string; enabled: boolean }[];
  } | null;
  banners: {
    slug: string;
    layout: string;
    heading: I18nMap;
    subheading: I18nMap | null;
    text: I18nMap | null;
    imageUrl: string;
  }[];
  categories: MenuCategory[];
};

function resolveAvailability(
  productAvailability: ProductAvailability,
  override: ProductAvailability | null | undefined,
  mode: "hide" | "unavailable"
): ProductAvailability | "OMIT" {
  const availability = override ?? productAvailability;
  if (availability === ProductAvailability.HIDDEN) return "OMIT";
  if (availability === ProductAvailability.UNAVAILABLE) {
    return mode === "hide" ? "OMIT" : ProductAvailability.UNAVAILABLE;
  }
  if (availability === ProductAvailability.ACTIVE) return ProductAvailability.ACTIVE;
  return "OMIT";
}

export async function getMenuBySlug(
  orgSlug: string,
  locationSlug: string
): Promise<MenuPayload | null> {
  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
    include: {
      theme: true,
      banners: { where: { enabled: true }, orderBy: { sortOrder: "asc" } },
      categories: {
        orderBy: { sortOrder: "asc" },
        include: {
          products: {
            orderBy: { sortOrder: "asc" },
            include: {
              fieldValues: { include: { field: true } },
            },
          },
        },
      },
      locations: { where: { slug: locationSlug, isActive: true } },
      fieldDefinitions: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!org || org.locations.length === 0) return null;

  const location = org.locations[0];
  const settings = org.settings as MenuSettings;
  const mode = settings.unavailableModeDefault ?? "hide";

  const overrideMap = new Map<
    string,
    { availability?: ProductAvailability | null; priceGelOverride?: unknown }
  >();
  const overrides = await prisma.locationProductOverride.findMany({
    where: { locationId: location.id },
  });
  for (const o of overrides) {
    overrideMap.set(o.productId, o);
  }

  const categories: MenuCategory[] = org.categories
    .map((cat) => {
      const products: MenuProduct[] = [];

      for (const p of cat.products) {
        const ov = overrideMap.get(p.id);
        const resolved = resolveAvailability(p.availability, ov?.availability, mode);
        if (resolved === "OMIT") continue;

        products.push({
          id: p.id,
          slug: p.slug,
          name: p.name as I18nMap,
          description: p.description as I18nMap,
          priceGel: ov?.priceGelOverride
            ? Number(ov.priceGelOverride)
            : Number(p.priceGel),
          imageUrl: p.imageUrl,
          badges: p.badges,
          availability: resolved,
          fields: p.fieldValues
            .filter((fv) => fv.field.showOnMenu)
            .map((fv) => ({
              key: fv.field.key,
              label: fv.field.label as I18nMap,
              value: fv.value,
            })),
        });
      }

      return {
        id: cat.id,
        slug: cat.slug,
        name: cat.name as I18nMap,
        description: cat.description as I18nMap | null,
        products,
      };
    })
    .filter((c) => c.products.length > 0);

  return {
    organization: {
      slug: org.slug,
      name: org.name as I18nMap,
      tagline: org.tagline as I18nMap | null,
      logoUrl: org.logoUrl,
      social: org.social as Record<string, string> | null,
    },
    location: {
      slug: location.slug,
      name: location.name as I18nMap | null,
      address: location.address as I18nMap | null,
      mapsUrl: location.mapsUrl,
    },
    settings,
    badgeLabels: org.badgeLabels as Record<string, I18nMap>,
    ui: org.uiLabels as Record<string, unknown>,
    theme: org.theme
      ? {
          presetId: org.theme.presetId,
          tokens: org.theme.tokens as Record<string, string>,
          sections: org.theme.sections as { type: string; enabled: boolean }[],
        }
      : null,
    banners: org.banners.map((b) => ({
      slug: b.slug,
      layout: b.layout,
      heading: b.heading as I18nMap,
      subheading: b.subheading as I18nMap | null,
      text: b.text as I18nMap | null,
      imageUrl: b.imageUrl,
    })),
    categories,
  };
}

export async function submitFeedback(
  orgSlug: string,
  locationSlug: string,
  text: string,
  tableNumber?: string
) {
  const location = await prisma.location.findFirst({
    where: { slug: locationSlug, organization: { slug: orgSlug }, isActive: true },
  });
  if (!location) return null;

  return prisma.feedback.create({
    data: {
      locationId: location.id,
      tableNumber: tableNumber ?? null,
      text,
    },
  });
}
