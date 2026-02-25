import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().int().positive().optional(),
  comparePrice: z.number().int().optional(),
  images: z.string().optional(),
  embroidery: z.string().optional(),
  fabric: z.string().optional(),
  craftsmanship: z.string().optional(),
  careInstructions: z.string().optional(),
  deliveryDays: z.number().int().min(0).optional(),
  sizeChart: z.string().optional(),
  inStock: z.boolean().optional(),
  stockQuantity: z.number().int().min(0).optional(),
});

async function ensureAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("Unauthorized");
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureAdmin();
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      ...product,
      images: JSON.parse(product.images || "[]"),
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureAdmin();
    const { id } = await params;
    const body = await req.json();
    const data = productSchema.parse(body);
    const product = await prisma.product.update({
      where: { id },
      data: data as Record<string, unknown>,
    });
    return NextResponse.json(product);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureAdmin();
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
