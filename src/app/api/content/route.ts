import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keys = searchParams.get("keys")?.split(",") || [
    "hero_title",
    "hero_subtext",
    "hero_image",
  ];
  const items = await prisma.siteContent.findMany({
    where: { key: { in: keys } },
  });
  const content: Record<string, string> = {};
  items.forEach((i) => (content[i.key] = i.content));
  return NextResponse.json(content);
}
