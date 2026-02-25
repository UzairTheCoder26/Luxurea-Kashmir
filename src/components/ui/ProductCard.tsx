"use client";

import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/imageUtils";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface ProductCardProps {
  productId?: string;
  slug: string;
  name: string;
  price: number;
  comparePrice?: number;
  images: string[];
  inStock?: boolean;
  index?: number;
}

export function ProductCard({
  productId,
  slug,
  name,
  price,
  comparePrice,
  images,
  inStock = true,
  index = 0,
}: ProductCardProps) {
  const [hoverImg, setHoverImg] = useState(0);
  const cleanImages = (images || []).map((img) => getImageUrl(img));
  const primaryImg = cleanImages[0] || getImageUrl("");
  const secondaryImg = cleanImages[1] || primaryImg;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(p);

  const addToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const wishlist: Array<{ slug: string; productId?: string; name: string; price: number; image: string }> = JSON.parse(
      localStorage.getItem("luxurea-wishlist") || "[]"
    );
    if (!wishlist.some((w) => w.slug === slug)) {
      wishlist.push({
        slug,
        productId: productId || "",
        name,
        price,
        image: primaryImg,
      });
      localStorage.setItem("luxurea-wishlist", JSON.stringify(wishlist));
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/shop/${slug}`} className="block">
        <div
          className="relative aspect-[3/4] bg-beige overflow-hidden rounded-3xl shadow-soft"
          onMouseEnter={() => setHoverImg(1)}
          onMouseLeave={() => setHoverImg(0)}
        >
          <div className="absolute inset-0">
            <Image
              src={primaryImg}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`object-cover luxury-transition ${
                hoverImg === 1 ? "opacity-0" : "opacity-100"
              }`}
            />
            <Image
              src={secondaryImg}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`object-cover luxury-transition ${
                hoverImg === 1 ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          {!inStock && (
            <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
              <span className="text-cream text-sm tracking-widest uppercase">
                Out of Stock
              </span>
            </div>
          )}
          {comparePrice && comparePrice > price && (
            <span className="absolute top-4 left-4 bg-gold text-ink text-xs px-3 py-1.5 rounded-full tracking-wider">
              Sale
            </span>
          )}
          <button
            onClick={addToWishlist}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-cream/90 text-ink/70 hover:text-rose hover:bg-cream luxury-transition shadow-soft"
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="mt-5 px-1">
          <h3 className="font-serif text-lg text-ink group-hover:text-gold luxury-transition">
            {name}
          </h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-ink font-medium">{formatPrice(price)}</span>
            {comparePrice && comparePrice > price && (
              <span className="text-ink/50 text-sm line-through">
                {formatPrice(comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
