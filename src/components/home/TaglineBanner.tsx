"use client";

import { motion } from "framer-motion";

export function TaglineBanner() {
  return (
    <section className="py-20 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center bg-beige/40 rounded-3xl py-16 px-8"
      >
        <p className="font-serif text-3xl md:text-4xl text-ink leading-relaxed">
          Crafted Silence.
          <br />
          <span className="text-gold">Worn Royalty.</span>
        </p>
        <p className="mt-8 text-ink/60 text-sm tracking-widest uppercase">
          Every thread holds a story.
        </p>
      </motion.div>
    </section>
  );
}
