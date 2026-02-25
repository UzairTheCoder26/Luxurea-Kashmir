"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  inStock: boolean;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(async (r) => {
        try {
          const data = await r.json();
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            console.error("Unexpected products response:", data);
            setProducts([]);
          }
        } catch (err) {
          console.error("Failed to parse products response", err);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <div className="py-16 px-6 border-b border-ink/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl text-ink">
            The Collection
          </h1>
          <p className="mt-4 text-ink/70 max-w-xl mx-auto">
            Timeless pieces. Heritage craftsmanship. Modern minimalism.
          </p>
        </div>
      </div>

      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-24">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-ink/60">No products yet.</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
