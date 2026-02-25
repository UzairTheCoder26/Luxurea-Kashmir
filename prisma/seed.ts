import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.admin.upsert({
    where: { email: "admin@luxureakashmir.com" },
    update: {},
    create: {
      email: "admin@luxureakashmir.com",
      password: hashedPassword,
      name: "Admin",
    },
  });

  await prisma.siteContent.upsert({
    where: { key: "hero_title" },
    update: {},
    create: {
      key: "hero_title",
      content: "The Sapphire Heirloom",
    },
  });

  await prisma.siteContent.upsert({
    where: { key: "hero_subtext" },
    update: {},
    create: {
      key: "hero_subtext",
      content: "Hand-finished embroidery. Timeless Kashmiri artistry.",
    },
  });

  await prisma.siteContent.upsert({
    where: { key: "hero_image" },
    update: {},
    create: {
      key: "hero_image",
      content: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920",
    },
  });

  await prisma.siteContent.upsert({
    where: { key: "instagram_url" },
    update: {},
    create: {
      key: "instagram_url",
      content: "https://instagram.com",
    },
  });

  const heroProduct = await prisma.product.upsert({
    where: { slug: "sapphire-heirloom-kaftan" },
    update: {},
    create: {
      name: "The Sapphire Heirloom Kaftan",
      slug: "sapphire-heirloom-kaftan",
      description: "A luxury navy-blue Kashmiri embroidered kaftan-style kurta. Deep midnight blue fabric with soft blush-pink intricate Kashmiri embroidery, wide flowing sleeves, and an elegant modest silhouette. Minimal neckline embroidery detailing. Designed to be worn with ivory trousers for a complete editorial look.",
      price: 24900,
      comparePrice: 29900,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
        "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800",
        "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
      ]),
      embroidery: "Intricate Sozni embroidery in soft blush pink and ivory. Each motif is hand-stitched by master artisans with thread counts exceeding 100 per inch. Traditional paisley and chinar leaf patterns.",
      fabric: "Premium mulmul cotton blend. 220 GSM. Sourced from certified weavers. Breathable, lightweight, with a delicate drape. Natural finish.",
      craftsmanship: "Crafted in limited numbers. Each piece takes 4-6 weeks to complete. Every thread holds a story of heritage passed down through generations of Kashmiri artisans.",
      careInstructions: "Dry clean only. Store in breathable fabric. Avoid direct sunlight. Iron on low heat with cloth barrier.",
      deliveryDays: 7,
      sizeChart: "XS: Bust 32-34\", Waist 26-28\", Hips 36-38\" | S: 34-36, 28-30, 38-40 | M: 36-38, 30-32, 40-42 | L: 38-40, 32-34, 42-44 | XL: 40-42, 34-36, 44-46 | XXL: 42-44, 36-38, 46-48",
      inStock: true,
      stockQuantity: 15,
    },
  });

  await prisma.siteContent.upsert({
    where: { key: "shipping_policy" },
    update: {},
    create: {
      key: "shipping_policy",
      content: "Shipping & Delivery\n\nWe dispatch all orders within 5-7 working days of order confirmation. Custom and embroidered pieces may take longer.\n\nWe ship across India. Delivery is typically 3-7 business days after dispatch.\n\nCash on Delivery (COD) is available for all orders.",
    },
  });

  await prisma.siteContent.upsert({
    where: { key: "returns_policy" },
    update: {},
    create: {
      key: "returns_policy",
      content: "Returns & Exchanges\n\nYou may return unworn items within 7 days. Embroidered pieces are final sale unless defective.",
    },
  });

  await prisma.siteContent.upsert({
    where: { key: "privacy_policy" },
    update: {},
    create: {
      key: "privacy_policy",
      content: "Privacy Policy\n\nWe collect only information necessary for orders. We do not sell your data.",
    },
  });

  await prisma.siteContent.upsert({
    where: { key: "terms_policy" },
    update: {},
    create: {
      key: "terms_policy",
      content: "Terms & Conditions\n\nOrders are subject to availability. All content is property of Luxureakashmir.",
    },
  });

  console.log("Seed completed:", { admin: "admin@luxureakashmir.com", product: heroProduct.name });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
