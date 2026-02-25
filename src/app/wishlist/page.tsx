"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { getImageUrl } from "@/lib/imageUtils";
import { Heart } from "lucide-react";

interface WishlistItem {
  slug: string;
  productId: string;
  name: string;
  price: number;
  image: string;
}

export default function WishlistPage() {
  const { addToCart } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("luxurea-wishlist");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
  }, []);

  const remove = (slug: string) => {
    const next = items.filter((i) => i.slug !== slug);
    setItems(next);
    localStorage.setItem("luxurea-wishlist", JSON.stringify(next));
  };

  const addToCartAndRemove = (item: WishlistItem) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      size: "M",
      quantity: 1,
      slug: item.slug,
    });
    remove(item.slug);
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(p);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Heart className="w-16 h-16 text-ink/20 mb-6" strokeWidth={1} />
        <h1 className="font-serif text-3xl text-ink">Your Wishlist</h1>
        <p className="mt-4 text-ink/60">Your wishlist is empty.</p>
        <Link href="/shop" className="mt-6">
          <Button>Explore Collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-ink">
          Your Wishlist
        </h1>
        <div className="mt-12 space-y-6">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex gap-6 pb-6 border-b border-ink/10"
            >
              <Link href={`/shop/${item.slug}`} className="relative w-28 h-36 flex-shrink-0 bg-beige">
                <Image
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/shop/${item.slug}`}
                  className="font-serif text-lg text-ink hover:text-gold"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-ink font-medium">{formatPrice(item.price)}</p>
                <div className="mt-3 flex gap-3">
                  <Button
                    size="sm"
                    onClick={() => addToCartAndRemove(item)}
                  >
                    Add to Cart
                  </Button>
                  <button
                    onClick={() => remove(item.slug)}
                    className="text-ink/50 hover:text-rose text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
