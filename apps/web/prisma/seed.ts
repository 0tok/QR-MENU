import { PrismaClient, ProductAvailability } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

type MockData = {
  restaurant: {
    slug: string;
    venueId: string;
    name: Record<string, string>;
    tagline: Record<string, string>;
    logo: string;
    social: Record<string, string>;
    location: {
      label: Record<string, string>;
      address: Record<string, string>;
      mapsUrl: string;
    };
    currencies: { code: string; symbol: string; rate: number }[];
    defaultCurrency: string;
    languages: { code: string; label: string; rtl: boolean }[];
    defaultLanguage: string;
    fxNote: Record<string, string>;
  };
  banners: {
    id: string;
    enabled: boolean;
    layout: string;
    heading: Record<string, string>;
    subheading: Record<string, string>;
    text: Record<string, string>;
    image: string;
  }[];
  categories: {
    id: string;
    name: Record<string, string>;
    description: Record<string, string>;
    items: {
      id: string;
      name: Record<string, string>;
      description: Record<string, string>;
      priceGel: number;
      image: string;
      badges: string[];
    }[];
  }[];
  badges: Record<string, Record<string, string>>;
  ui: Record<string, unknown>;
};

async function main() {
  const mockPath = join(__dirname, "../../../data/demo-restaurant.json");
  const data: MockData = JSON.parse(readFileSync(mockPath, "utf-8"));
  const { restaurant } = data;

  await prisma.feedback.deleteMany();
  await prisma.tableListItem.deleteMany();
  await prisma.tableSharedList.deleteMany();
  await prisma.locationProductOverride.deleteMany();
  await prisma.productFieldValue.deleteMany();
  await prisma.productFieldDefinition.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.menuTheme.deleteMany();
  await prisma.location.deleteMany();
  await prisma.organization.deleteMany();

  const org = await prisma.organization.create({
    data: {
      slug: restaurant.slug,
      name: restaurant.name,
      tagline: restaurant.tagline,
      logoUrl: "/logo.svg",
      social: restaurant.social,
      settings: {
        currencies: restaurant.currencies,
        defaultCurrency: restaurant.defaultCurrency,
        languages: restaurant.languages,
        defaultLanguage: restaurant.defaultLanguage,
        fxNote: restaurant.fxNote,
        unavailableModeDefault: "hide",
        location: restaurant.location,
      },
      badgeLabels: data.badges,
      uiLabels: data.ui,
    },
  });

  await prisma.location.create({
    data: {
      organizationId: org.id,
      slug: restaurant.venueId,
      name: restaurant.name,
      address: restaurant.location.address,
      mapsUrl: restaurant.location.mapsUrl,
      sortOrder: 0,
    },
  });

  await prisma.menuTheme.create({
    data: {
      organizationId: org.id,
      presetId: "nova",
      tokens: {
        primary: "#0f766e",
        radius: "0.75rem",
      },
      sections: [
        { type: "header", enabled: true },
        { type: "selectors", enabled: true },
        { type: "banners", enabled: true },
        { type: "category-nav", enabled: true },
        { type: "product-grid", enabled: true },
      ],
    },
  });

  for (const [i, banner] of data.banners.entries()) {
    await prisma.banner.create({
      data: {
        organizationId: org.id,
        slug: banner.id,
        enabled: banner.enabled,
        layout: banner.layout,
        heading: banner.heading,
        subheading: banner.subheading,
        text: banner.text,
        imageUrl: banner.image,
        sortOrder: i,
      },
    });
  }

  await prisma.productFieldDefinition.createMany({
    data: [
      {
        organizationId: org.id,
        key: "calories",
        label: { en: "Calories", ka: "კალორია", ar: "سعرات" },
        fieldType: "number",
        sortOrder: 0,
      },
      {
        organizationId: org.id,
        key: "prep-time",
        label: { en: "Prep time", ka: "მომზადება", ar: "وقت التحضير" },
        fieldType: "text",
        sortOrder: 1,
      },
      {
        organizationId: org.id,
        key: "allergens",
        label: { en: "Allergens", ka: "ალერგენები", ar: "مسببات الحساسية" },
        fieldType: "tags",
        sortOrder: 2,
      },
    ],
  });

  const fieldDefs = await prisma.productFieldDefinition.findMany({
    where: { organizationId: org.id },
  });

  const sampleFields: Record<string, Record<string, string | number | string[]>> = {
    khachapuri: { calories: 640, "prep-time": "15 min", allergens: ["gluten", "dairy", "egg"] },
    chakapuli: { calories: 520, "prep-time": "25 min", allergens: [] },
    trout: { calories: 380, "prep-time": "20 min", allergens: ["fish"] },
  };

  for (const [catIndex, category] of data.categories.entries()) {
    const cat = await prisma.category.create({
      data: {
        organizationId: org.id,
        slug: category.id,
        sortOrder: catIndex,
        name: category.name,
        description: category.description,
      },
    });

    for (const [itemIndex, item] of category.items.entries()) {
      const product = await prisma.product.create({
        data: {
          organizationId: org.id,
          categoryId: cat.id,
          slug: item.id,
          sortOrder: itemIndex,
          name: item.name,
          description: item.description,
          priceGel: item.priceGel,
          imageUrl: item.image,
          badges: item.badges,
          availability: ProductAvailability.ACTIVE,
        },
      });

      const extras = sampleFields[item.id];
      if (extras) {
        for (const [key, value] of Object.entries(extras)) {
          const field = fieldDefs.find((f) => f.key === key);
          if (field) {
            await prisma.productFieldValue.create({
              data: {
                productId: product.id,
                fieldId: field.id,
                value,
              },
            });
          }
        }
      }
    }
  }

  console.log("Seeded demo-restaurant / v1");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
