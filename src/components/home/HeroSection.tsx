"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/imageUtils";

export function HeroSection() {
  const [content, setContent] = useState({
    hero_title: "The Sapphire Heirloom",
    hero_subtext: "Hand-finished embroidery. Timeless Kashmiri artistry.",
    hero_image: "/hero.jpg",
  });

  useEffect(() => {
    fetch("/api/content?keys=hero_title,hero_subtext,hero_image")
      .then((r) => r.json())
      .then(setContent)
      .catch(() => {});
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background image with dark backdrop + subtle glow */}
      <div className="absolute inset-0">
        <Image
          src={getImageUrl(content.hero_image)}
          alt="Luxureakashmir"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920";
          }}
        />
        {/* Softer dark backdrop (less opaque than before) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
        {/* Gentle golden glow around center of hero image */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.32),_transparent_60%)] mix-blend-screen opacity-70" />
      </div>

      {/* Content - centered */}
      <div className="relative z-10 w-full max-w-4xl px-6 md:px-10 lg:px-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-cream/10 border border-gold/30 px-4 py-1 mb-6 backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-[11px] tracking-[0.25em] uppercase text-cream/80">
              Kashmir&apos;s Fine Luxury Clothing
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-cream drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
            {content.hero_title}
          </h1>
          <p className="mt-4 text-base md:text-lg text-cream/80 max-w-2xl">
            {content.hero_subtext}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-gold text-ink font-semibold px-8 md:px-10 py-3.5 text-sm tracking-[0.2em] uppercase hover:bg-gold-light luxury-transition shadow-soft"
          >
            Explore Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
