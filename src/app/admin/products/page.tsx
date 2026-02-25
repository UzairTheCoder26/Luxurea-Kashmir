"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getImageUrl } from "@/lib/imageUtils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  inStock: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((p) => p.filter((x) => x.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-cream">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-gold text-ink hover:bg-gold/90 rounded luxury-transition"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-cream/60">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-cream/60">No products.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-cream/10">
                <th className="py-3 text-cream/60 text-sm font-medium">Image</th>
                <th className="py-3 text-cream/60 text-sm font-medium">Name</th>
                <th className="py-3 text-cream/60 text-sm font-medium">Price</th>
                <th className="py-3 text-cream/60 text-sm font-medium">Stock</th>
                <th className="py-3 text-cream/60 text-sm font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-cream/5">
                  <td className="py-4">
                    <div className="relative w-16 h-20 bg-cream/5">
                      <Image
                        src={getImageUrl(p.images?.[0])}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-4 text-cream">{p.name}</td>
                  <td className="py-4 text-cream">₹{p.price}</td>
                  <td className="py-4">
                    <span
                      className={
                        p.inStock ? "text-gold" : "text-rose"
                      }
                    >
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-4 flex gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="p-2 text-cream/70 hover:text-gold"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-cream/70 hover:text-rose"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
