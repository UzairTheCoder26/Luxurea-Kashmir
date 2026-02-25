"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const defaultContent = `Kashmir's embroidery traditions date back over five centuries. Our artisans practice Sozni — the finest form of Kashmiri embroidery, with thread counts exceeding 100 stitches per inch. Each motif is drawn freehand and stitched by hand, a skill that takes decades to master.

We source premium mulmul cotton and pashmina from certified weavers. Every fabric is selected for its drape, breathability, and ability to showcase the embroidery.

Our pieces are crafted in limited numbers. A single kaftan can take 4-6 weeks to complete. We do not rush. We do not compromise.`;

export default function CraftsmanshipPage() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    fetch("/api/content?keys=craftsmanship_content")
      .then((r) => r.json())
      .then((d) => d.craftsmanship_content && setContent(d.craftsmanship_content))
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
          Craftsmanship
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
      </div>
    </div>
  );
}
