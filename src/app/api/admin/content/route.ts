import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const contentSchema = z.object({
  key: z.string(),
  content: z.string(),
});

async function ensureAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("Unauthorized");
}

export async function GET() {
  try {
    await ensureAdmin();
    const items = await prisma.siteContent.findMany();
    const content: Record<string, string> = {};
    items.forEach((i) => (content[i.key] = i.content));
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureAdmin();
    const body = await req.json();
    const { key, content } = contentSchema.parse(body);
    await prisma.siteContent.upsert({
      where: { key },
      update: { content },
      create: { key, content },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
