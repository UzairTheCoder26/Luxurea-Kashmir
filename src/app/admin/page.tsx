"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    confirmed: number;
    revenue: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setStats(d.stats))
      .catch(() => setStats({ total: 0, pending: 0, confirmed: 0, revenue: 0 }));
  }, []);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(p);

  return (
    <div>
      <h1 className="text-2xl font-serif text-cream mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-cream/5 border border-cream/10 rounded p-6">
          <p className="text-cream/60 text-sm">Total Orders</p>
          <p className="text-2xl font-serif text-cream mt-1">
            {stats?.total ?? "—"}
          </p>
        </div>
        <div className="bg-cream/5 border border-cream/10 rounded p-6">
          <p className="text-cream/60 text-sm">Pending</p>
          <p className="text-2xl font-serif text-gold mt-1">
            {stats?.pending ?? "—"}
          </p>
        </div>
        <div className="bg-cream/5 border border-cream/10 rounded p-6">
          <p className="text-cream/60 text-sm">Confirmed</p>
          <p className="text-2xl font-serif text-cream mt-1">
            {stats?.confirmed ?? "—"}
          </p>
        </div>
        <div className="bg-cream/5 border border-cream/10 rounded p-6">
          <p className="text-cream/60 text-sm">Revenue (COD Confirmed)</p>
          <p className="text-2xl font-serif text-gold mt-1">
            {stats ? formatPrice(stats.revenue) : "—"}
          </p>
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <Link
          href="/admin/orders"
          className="px-4 py-2 bg-gold/20 text-gold hover:bg-gold/30 rounded luxury-transition"
        >
          View Orders
        </Link>
        <Link
          href="/admin/products"
          className="px-4 py-2 bg-cream/10 text-cream hover:bg-cream/20 rounded luxury-transition"
        >
          Manage Products
        </Link>
      </div>
    </div>
  );
}
