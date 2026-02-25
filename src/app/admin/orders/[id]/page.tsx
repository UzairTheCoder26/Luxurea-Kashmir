"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  orderId: string;
  status: string;
  fullName: string;
  phone: string;
  whatsapp: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string | null;
  total: number;
  createdAt: string;
  items: Array<{
    quantity: number;
    size: string;
    price: number;
    product: { name: string };
  }>;
}

const statuses = ["Pending", "Confirmed", "Dispatched", "Delivered", "Cancelled"];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((d) => (d.id ? setOrder(d) : setOrder(null)))
      .catch(() => setOrder(null));
  }, [id]);

  const handleStatusChange = async (status: string) => {
    if (!order) return;
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrder((o) => (o ? { ...o, status } : null));
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(p);

  if (!order) {
    return (
      <div>
        <button onClick={() => router.back()} className="text-cream/70 hover:text-cream mb-4">
          ← Back
        </button>
        <p className="text-cream/60">Order not found.</p>
      </div>
    );
  }

  const whatsappLink = order.whatsapp || order.phone;
  const waUrl = `https://wa.me/91${whatsappLink.replace(/\D/g, "")}`;
  const smsTemplate = `Hi ${order.fullName}, Your order ${order.orderId} has been confirmed. We will dispatch shortly.`;

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="text-cream/70 hover:text-cream mb-6"
      >
        ← Back
      </button>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif text-cream">{order.orderId}</h1>
            <p className="text-cream/60 text-sm mt-1">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-cream/5 border border-cream/20 px-4 py-2 text-cream rounded"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-cream/5 border border-cream/10 rounded p-6">
          <h2 className="text-cream font-medium mb-3">Customer Details</h2>
          <p className="text-cream">{order.fullName}</p>
          <p className="text-cream/80">
            <a href={`tel:${order.phone}`} className="hover:text-gold">
              {order.phone}
            </a>
          </p>
          {order.whatsapp && (
            <p className="text-cream/80">
              <a href={waUrl} target="_blank" rel="noreferrer" className="hover:text-gold">
                WhatsApp: {order.whatsapp}
              </a>
            </p>
          )}
          <p className="text-cream/80 mt-2">
            {order.address}, {order.city}, {order.state} - {order.pincode}
          </p>
          {order.notes && (
            <p className="text-cream/70 mt-2 text-sm">Notes: {order.notes}</p>
          )}
        </div>

        <div className="bg-cream/5 border border-cream/10 rounded p-6">
          <h2 className="text-cream font-medium mb-3">Items</h2>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between py-2">
              <span className="text-cream">
                {item.product.name} × {item.quantity} ({item.size})
              </span>
              <span className="text-cream">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-4 border-t border-cream/10 font-medium text-cream">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="bg-cream/5 border border-cream/10 rounded p-6">
          <h2 className="text-cream font-medium mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded"
            >
              WhatsApp Customer
            </a>
            <a
              href={`tel:${order.phone}`}
              className="px-4 py-2 bg-gold/20 text-gold hover:bg-gold/30 rounded"
            >
              Call Customer
            </a>
          </div>
          <p className="text-cream/60 text-sm mt-3">SMS Template:</p>
          <pre className="mt-1 p-3 bg-ink rounded text-cream/80 text-sm overflow-x-auto">
            {smsTemplate}
          </pre>
        </div>
      </div>
    </div>
  );
}
