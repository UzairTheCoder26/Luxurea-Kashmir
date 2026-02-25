"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

const statusSteps = [
  "Pending",
  "Confirmed",
  "Dispatched",
  "Delivered",
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";
  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState<{
    orderId: string;
    status: string;
    fullName: string;
    total: number;
    items: Array<{ quantity: number; product: { name: string }; size: string }>;
    createdAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialOrderId.trim()) {
      setOrderId(initialOrderId);
      setError("");
      setLoading(true);
      fetch(`/api/orders/${initialOrderId.trim().toUpperCase()}`)
        .then((r) => {
          if (!r.ok) throw new Error("Order not found");
          return r.json();
        })
        .then(setOrder)
        .catch(() => {
          setError("Order not found");
          setOrder(null);
        })
        .finally(() => setLoading(false));
    }
  }, [initialOrderId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId.trim().toUpperCase()}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Order not found");
      }
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order not found");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const statusIndex = order
    ? statusSteps.indexOf(order.status)
    : -1;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(p);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-ink text-center">
          Track Your Order
        </h1>
        <p className="mt-4 text-ink/70 text-center">
          Enter your order ID to check status.
        </p>

        <form onSubmit={handleSearch} className="mt-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. LK1ABC2DEF3"
              className="flex-1 border border-ink/20 rounded-2xl px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 uppercase"
            />
            <Button type="submit" isLoading={loading}>
              Track
            </Button>
          </div>
        </form>

        {error && (
          <p className="mt-4 text-rose text-sm text-center">{error}</p>
        )}

        {order && (
          <div className="mt-12 space-y-8">
            <div className="border border-ink/10 rounded-2xl p-6 bg-beige/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-sm text-ink/70">
                    {order.orderId}
                  </p>
                  <p className="mt-1 font-medium text-ink">{order.fullName}</p>
                  <p className="mt-2 text-ink/80">
                    {formatPrice(order.total)} • {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                  </p>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs tracking-wider ${
                    order.status === "Delivered"
                      ? "bg-gold/20 text-gold"
                      : order.status === "Cancelled"
                      ? "bg-rose/20 text-rose"
                      : "bg-ink/10 text-ink"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Progress */}
            {order.status !== "Cancelled" && (
              <div className="space-y-4">
                {statusSteps.map((step, i) => (
                  <div key={step} className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        i <= statusIndex
                          ? "bg-gold text-ink"
                          : "bg-ink/10 text-ink/40"
                      }`}
                    >
                      {i < statusIndex ? "✓" : i + 1}
                    </div>
                    <div className="flex-1">
                      <p
                        className={
                          i <= statusIndex ? "text-ink" : "text-ink/50"
                        }
                      >
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-ink/10 pt-6">
              <p className="text-xs tracking-widest uppercase text-ink/60 mb-2">
                Items
              </p>
              {order.items.map((item, i) => (
                <p key={i} className="text-ink/80">
                  {item.product.name} × {item.quantity} ({item.size})
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
