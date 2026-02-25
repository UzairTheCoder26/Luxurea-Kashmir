"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const defaultContent = `Luxureakashmir was born from a deep appreciation for Kashmir's centuries-old craft traditions. We work directly with master artisans whose skills have been passed down through generations, bringing you pieces that marry heritage craftsmanship with modern minimalism.

Every thread holds a story. Every embroidery motif carries meaning. We believe in quiet luxury — the kind that speaks through quality, not volume.

Designed for those who understand understated wealth. Crafted in limited numbers. Worn with intention.`;

export default function AboutPage() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    fetch("/api/content?keys=about_content")
      .then((r) => r.json())
      .then((d) => d.about_content && setContent(d.about_content))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl md:text-5xl text-ink"
        >
          About Us
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-12 prose prose-lg max-w-none text-ink/80 leading-relaxed space-y-6"
        >
          {content.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-16 pt-12 border-t border-ink/10"
        >
          <p className="font-serif text-2xl text-ink">
            Crafted Silence. Worn Royalty.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
