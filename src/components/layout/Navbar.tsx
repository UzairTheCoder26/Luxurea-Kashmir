"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { clsx } from "clsx";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/craftsmanship", label: "Craftsmanship" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 rounded-b-3xl transition-all duration-300 border-b",
          scrolled
            ? "bg-ink/85 border-gold/50 backdrop-blur-xl shadow-[0_0_40px_rgba(212,175,55,0.45)]"
            : "bg-transparent border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link
              href="/"
              className="font-serif text-2xl tracking-tight luxury-transition text-cream hover:text-gold-light"
            >
              Luxureakashmir
            </Link>

            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "text-sm tracking-widest uppercase luxury-transition gold-underline text-cream/85 hover:text-gold-light",
                    pathname === link.href && "text-gold font-medium"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-6">
              <Link
                href="/wishlist"
                className="hidden sm:block luxury-transition text-cream/85 hover:text-rose/90"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" strokeWidth={1.5} />
              </Link>
              <Link
                href="/cart"
                className="relative luxury-transition text-cream/85 hover:text-gold-light"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gold text-ink text-[10px] font-medium rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-cream"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-20 left-0 right-0 z-40 bg-ink/95 backdrop-blur-xl border-b border-gold/40 md:hidden rounded-b-3xl shadow-[0_0_35px_rgba(212,175,55,0.45)]"
          >
            <nav className="flex flex-col p-6 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "text-sm tracking-widest uppercase py-3 px-4 rounded-2xl",
                    pathname === link.href
                      ? "text-gold bg-gold/15"
                      : "text-cream/85 hover:bg-ink/70"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="text-sm tracking-widest uppercase py-3 px-4 rounded-2xl text-cream/85 hover:bg-ink/70"
              >
                Wishlist
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm tracking-widest uppercase py-3 px-4 rounded-2xl text-cream/60 hover:bg-ink/70"
              >
                Staff Login
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
