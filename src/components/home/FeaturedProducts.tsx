"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  inStock: boolean;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-beige/30 rounded-t-[2.5rem]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-2">
            Curated for You
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink">
            Crafted in Limited Numbers
          </h2>
          <p className="mt-4 text-ink/70 max-w-xl mx-auto">
            Timeless pieces designed to make you feel effortlessly elegant.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              comparePrice={product.comparePrice ?? undefined}
              images={product.images}
              inStock={product.inStock}
              index={i}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-block text-ink px-6 py-2.5 rounded-full border border-ink/20 text-sm tracking-widest uppercase hover:bg-ink hover:text-cream hover:border-ink luxury-transition"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
