import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const seller = await db.user.upsert({
    where: { email: "ava@rewear.dev" },
    update: {},
    create: {
      email: "ava@rewear.dev",
      name: "Ava Chen",
      // Demo-only placeholder; auth isn't wired up in this slice yet.
      passwordHash: "seed-placeholder",
    },
  });

  const listings = [
    {
      title: "Vintage Denim Jacket",
      description: "Classic oversized denim jacket, lightly worn with a great faded wash.",
      priceCents: 4800,
      category: "Outerwear",
      size: "M",
      condition: "GOOD" as const,
      imageUrls: ["/seed/outerwear-1.svg"],
    },
    {
      title: "Graphic Band Tee",
      description: "Soft cotton graphic tee from a 2016 tour. No stains or holes.",
      priceCents: 1800,
      category: "Tops",
      size: "S",
      condition: "LIKE_NEW" as const,
      imageUrls: ["/seed/tops-1.svg"],
    },
    {
      title: "Chunky Knit Sweater",
      description: "Warm oversized knit sweater, perfect for fall. Machine washable.",
      priceCents: 3200,
      category: "Tops",
      size: "L",
      condition: "GOOD" as const,
      imageUrls: ["/seed/tops-2.svg"],
    },
    {
      title: "Straight Leg Jeans",
      description: "Mid-rise straight leg jeans, dark wash, barely worn.",
      priceCents: 2600,
      category: "Bottoms",
      size: "M",
      condition: "LIKE_NEW" as const,
      imageUrls: ["/seed/bottoms-1.svg"],
    },
    {
      title: "Floral Midi Dress",
      description: "Flowy floral midi dress with pockets. Worn once for a wedding.",
      priceCents: 3800,
      category: "Dresses",
      size: "S",
      condition: "NEW_WITH_TAGS" as const,
      imageUrls: ["/seed/dresses-1.svg"],
    },
    {
      title: "Leather Combat Boots",
      description: "Genuine leather combat boots, some scuffing on the toe.",
      priceCents: 5200,
      category: "Shoes",
      size: "M",
      condition: "FAIR" as const,
      imageUrls: ["/seed/shoes-1.svg"],
    },
    {
      title: "Wool Blend Scarf",
      description: "Soft wool blend scarf in a neutral plaid pattern.",
      priceCents: 1400,
      category: "Accessories",
      size: "S",
      condition: "GOOD" as const,
      imageUrls: ["/seed/accessories-1.svg"],
    },
  ];

  for (const listing of listings) {
    await db.listing.create({ data: { ...listing, sellerId: seller.id } });
  }

  console.log(`Seeded 1 user and ${listings.length} listings.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
