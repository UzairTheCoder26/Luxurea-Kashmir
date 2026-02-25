import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const orderItemSchema = z.object({
  productId: z.string(),
  size: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().int().positive(),
});

const orderSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  whatsapp: z.string().optional(),
  address: z.string().min(10),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(5),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = orderSchema.parse(body);
    const total = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const orderId = `LK${Date.now().toString(36).toUpperCase()}${uuidv4().slice(0, 6).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderId,
        fullName: data.fullName,
        phone: data.phone,
        whatsapp: data.whatsapp,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        notes: data.notes,
        total,
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ orderId: order.orderId, id: order.id });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Order failed" }, { status: 500 });
  }
}
