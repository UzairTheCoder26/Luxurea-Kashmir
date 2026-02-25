import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
  name: z.string().min(2).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  text: z.string().min(10).optional(),
  approved: z.boolean().optional(),
});

async function ensureAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("Unauthorized");
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await ensureAdmin();
    const { id } = params;
    const body = await req.json();
    const data = reviewSchema.parse(body);
    const review = await prisma.review.update({
      where: { id },
      data,
    });
    return NextResponse.json(review);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await ensureAdmin();
    const { id } = params;
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
