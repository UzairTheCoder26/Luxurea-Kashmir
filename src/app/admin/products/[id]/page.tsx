"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    comparePrice: "",
    images: "",
    embroidery: "",
    fabric: "",
    craftsmanship: "",
    careInstructions: "",
    deliveryDays: "7",
    sizeChart: "",
    inStock: true,
    stockQuantity: "0",
  });

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((p) => {
        setForm({
          name: p.name || "",
          slug: p.slug || "",
          description: p.description || "",
          price: String(p.price || ""),
          comparePrice: p.comparePrice ? String(p.comparePrice) : "",
          images: Array.isArray(p.images) ? p.images.join("\n") : "",
          embroidery: p.embroidery || "",
          fabric: p.fabric || "",
          craftsmanship: p.craftsmanship || "",
          careInstructions: p.careInstructions || "",
          deliveryDays: String(p.deliveryDays || 7),
          sizeChart: p.sizeChart || "",
          inStock: p.inStock ?? true,
          stockQuantity: String(p.stockQuantity || 0),
        });
      })
      .catch(() => {});
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseInt(form.price) || 0,
          comparePrice: form.comparePrice ? parseInt(form.comparePrice) : undefined,
          stockQuantity: parseInt(form.stockQuantity) || 0,
          deliveryDays: parseInt(form.deliveryDays) || 7,
          images: form.images
            ? JSON.stringify(
                form.images
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            : "[]",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push("/admin/products");
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-serif text-cream mb-8">Edit Product</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-cream/60 text-sm mb-1">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-cream/60 text-sm mb-1">Slug</label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-cream/60 text-sm mb-1">Description</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-cream/60 text-sm mb-1">Price (₹)</label>
            <input
              type="number"
              required
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-cream/60 text-sm mb-1">Compare Price (₹)</label>
            <input
              type="number"
              value={form.comparePrice}
              onChange={(e) => setForm((f) => ({ ...f, comparePrice: e.target.value }))}
              className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-cream/60 text-sm mb-1">
            Images (one URL per line)
          </label>
          <textarea
            rows={3}
            value={form.images}
            onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
            className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none resize-none font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-cream/60 text-sm mb-1">Embroidery</label>
          <textarea
            rows={2}
            value={form.embroidery}
            onChange={(e) => setForm((f) => ({ ...f, embroidery: e.target.value }))}
            className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none resize-none"
          />
        </div>
        <div>
          <label className="block text-cream/60 text-sm mb-1">Fabric</label>
          <textarea
            rows={2}
            value={form.fabric}
            onChange={(e) => setForm((f) => ({ ...f, fabric: e.target.value }))}
            className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none resize-none"
          />
        </div>
        <div>
          <label className="block text-cream/60 text-sm mb-1">Craftsmanship</label>
          <textarea
            rows={2}
            value={form.craftsmanship}
            onChange={(e) => setForm((f) => ({ ...f, craftsmanship: e.target.value }))}
            className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none resize-none"
          />
        </div>
        <div>
          <label className="block text-cream/60 text-sm mb-1">Care Instructions</label>
          <input
            type="text"
            value={form.careInstructions}
            onChange={(e) => setForm((f) => ({ ...f, careInstructions: e.target.value }))}
            className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-cream/60 text-sm mb-1">Delivery Days</label>
            <input
              type="number"
              value={form.deliveryDays}
              onChange={(e) => setForm((f) => ({ ...f, deliveryDays: e.target.value }))}
              className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-cream/60 text-sm mb-1">Stock Qty</label>
            <input
              type="number"
              value={form.stockQuantity}
              onChange={(e) => setForm((f) => ({ ...f, stockQuantity: e.target.value }))}
              className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-cream">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
                className="rounded"
              />
              In Stock
            </label>
          </div>
        </div>
        <div>
          <label className="block text-cream/60 text-sm mb-1">Size Chart</label>
          <textarea
            rows={2}
            value={form.sizeChart}
            onChange={(e) => setForm((f) => ({ ...f, sizeChart: e.target.value }))}
            className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none resize-none"
          />
        </div>
        <div className="flex gap-4 pt-4">
          <Button type="submit" isLoading={loading}>
            Save Changes
          </Button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-cream/70 hover:text-cream"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
