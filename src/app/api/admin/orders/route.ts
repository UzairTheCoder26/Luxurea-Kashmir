import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function ensureAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("Unauthorized");
}

export async function GET(req: Request) {
  try {
    await ensureAdmin();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { orderId: { contains: search } },
        { fullName: { contains: search } },
        { phone: { contains: search } },
      ];
    }
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    const confirmedRevenue = await prisma.order.aggregate({
      where: { status: "Confirmed" },
      _sum: { total: true },
    });

    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "Pending").length,
      confirmed: orders.filter((o) => o.status === "Confirmed").length,
      dispatched: orders.filter((o) => o.status === "Dispatched").length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
      cancelled: orders.filter((o) => o.status === "Cancelled").length,
      revenue: confirmedRevenue._sum.total || 0,
    };

    return NextResponse.json({ orders, stats });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
