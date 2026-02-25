import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function ensureAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("Unauthorized");
}

export async function GET() {
  try {
    await ensureAdmin();
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Order ID",
      "Date",
      "Status",
      "Name",
      "Phone",
      "WhatsApp",
      "Address",
      "City",
      "State",
      "Pincode",
      "Total",
      "Items",
    ];

    const rows = orders.map((o) => {
      const itemsStr = o.items
        .map(
          (i) =>
            `${i.product.name} x${i.quantity} (${i.size}) - ₹${i.price * i.quantity}`
        )
        .join("; ");
      return [
        o.orderId,
        o.createdAt.toISOString(),
        o.status,
        o.fullName,
        o.phone,
        o.whatsapp || "",
        o.address,
        o.city,
        o.state,
        o.pincode,
        o.total,
        itemsStr,
      ];
    });

    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="orders-${Date.now()}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
