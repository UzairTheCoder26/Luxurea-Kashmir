"use client";

import { useEffect, useState } from "react";

const statuses = ["Pending", "Confirmed", "Dispatched", "Delivered", "Cancelled"];

interface Order {
  id: string;
  orderId: string;
  status: string;
  fullName: string;
  phone: string;
  total: number;
  createdAt: string;
  items: Array<{
    quantity: number;
    size: string;
    product: { name: string };
    price: number;
  }>;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    fetch(`/api/admin/orders?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders || []);
        setStats(d.stats || {});
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } finally {
      setUpdating(null);
    }
  };

  const handleExport = () => {
    window.open("/api/admin/orders/export", "_blank");
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(p);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <h1 className="text-2xl font-serif text-cream">Orders</h1>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search order ID, name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-cream/5 border border-cream/20 px-4 py-2 text-cream placeholder-cream/50 focus:border-gold focus:outline-none rounded"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none rounded"
          >
            <option value="">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gold/20 text-gold hover:bg-gold/30 rounded luxury-transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-4 text-sm">
        <span className="text-cream/60">Revenue (Confirmed): {formatPrice(stats.revenue || 0)}</span>
      </div>

      {loading ? (
        <p className="text-cream/60">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-cream/60">No orders.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-cream/10">
                <th className="py-3 text-cream/60 text-sm font-medium">Order</th>
                <th className="py-3 text-cream/60 text-sm font-medium">Customer</th>
                <th className="py-3 text-cream/60 text-sm font-medium">Total</th>
                <th className="py-3 text-cream/60 text-sm font-medium">Status</th>
                <th className="py-3 text-cream/60 text-sm font-medium">Date</th>
                <th className="py-3 text-cream/60 text-sm font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-cream/5">
                  <td className="py-4 font-mono text-sm text-cream">{o.orderId}</td>
                  <td className="py-4 text-cream">
                    <div>{o.fullName}</div>
                    <div className="text-cream/60 text-sm">{o.phone}</div>
                  </td>
                  <td className="py-4 text-cream">{formatPrice(o.total)}</td>
                  <td className="py-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      disabled={updating === o.id}
                      className="bg-cream/5 border border-cream/20 px-2 py-1 text-cream text-sm rounded"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 text-cream/70 text-sm">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <a
                      href={`/admin/orders/${o.id}`}
                      className="text-gold hover:underline text-sm"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
