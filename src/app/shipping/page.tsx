"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const defaultContent = `Shipping & Delivery

We dispatch all orders within 5-7 working days of order confirmation. Custom and embroidered pieces may take longer — please refer to individual product pages for estimated dispatch timelines.

We currently ship across India. Delivery is typically 3-7 business days after dispatch, depending on your location.

All orders are shipped via trusted courier partners. You will receive tracking information once your order is dispatched.

Cash on Delivery (COD) is available for all orders. Pay when you receive your package.`;

export default function ShippingPage() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    fetch("/api/content?keys=shipping_policy")
      .then((r) => r.json())
      .then((d) => d.shipping_policy && setContent(d.shipping_policy))
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
          Shipping Policy
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
