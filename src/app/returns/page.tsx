"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const defaultContent = `Returns & Exchanges

We want you to love your purchase. If an item does not meet your expectations, you may return it within 7 days of delivery for a full refund or exchange.

Conditions:
• Item must be unworn, unwashed, and in original packaging with all tags attached.
• Embroidered and custom pieces are final sale and cannot be returned unless defective.
• Return shipping is the responsibility of the customer.

To initiate a return, please contact us at the email below with your order ID and reason. We will provide return instructions.

Exchanges are subject to availability. If the requested size or style is not available, we will issue a refund.`;

export default function ReturnsPage() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    fetch("/api/content?keys=returns_policy")
      .then((r) => r.json())
      .then((d) => d.returns_policy && setContent(d.returns_policy))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl text-ink"
        >
          Returns & Exchanges
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-12 prose prose-lg max-w-none text-ink/80 leading-relaxed whitespace-pre-line"
        >
          {content}
        </motion.div>
      </div>
    </div>
  );
}
