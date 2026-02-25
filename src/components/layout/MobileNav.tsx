"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function MobileNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-cream/95 border-t border-ink/5 rounded-t-3xl shadow-soft safe-area-pb">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 py-2 ${
            pathname === "/" ? "text-gold" : "text-ink/60"
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center flex-1 py-2 ${
            pathname?.startsWith("/shop") ? "text-gold" : "text-ink/60"
          }`}
          aria-label="Shop"
        >
          <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-[10px] mt-0.5">Shop</span>
        </Link>
        <Link
          href="/wishlist"
          className={`flex flex-col items-center justify-center flex-1 py-2 ${
            pathname === "/wishlist" ? "text-gold" : "text-ink/60"
          }`}
          aria-label="Wishlist"
        >
          <Heart className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-[10px] mt-0.5">Wishlist</span>
        </Link>
        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center flex-1 py-2 relative ${
            pathname === "/cart" ? "text-gold" : "text-ink/60"
          }`}
          aria-label="Cart"
        >
          <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          {totalItems > 0 && (
            <span className="absolute top-1 right-1/4 w-4 h-4 bg-gold text-ink text-[9px] font-medium rounded-full flex items-center justify-center">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Cart</span>
        </Link>
      </div>
    </nav>
  );
}
