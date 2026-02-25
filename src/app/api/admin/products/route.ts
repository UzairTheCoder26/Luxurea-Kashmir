import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  price: z.number().int().positive(),
  comparePrice: z.number().int().optional(),
  images: z.string(),
  embroidery: z.string().optional(),
  fabric: z.string().optional(),
  craftsmanship: z.string().optional(),
  careInstructions: z.string().optional(),
  deliveryDays: z.number().int().min(0).default(7),
  sizeChart: z.string().optional(),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().int().min(0).default(0),
});

async function ensureAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("Unauthorized");
}

export async function GET() {
  try {
    await ensureAdmin();
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(
      products.map((p) => ({ ...p, images: JSON.parse(p.images || "[]") }))
    );
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureAdmin();
    const body = await req.json();
    const data = productSchema.parse(body);
    const product = await prisma.product.create({
      data: { ...data, images: data.images },
    });
    return NextResponse.json(product);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
