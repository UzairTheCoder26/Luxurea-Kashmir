"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const defaultContent = `Privacy Policy

Your privacy is important to us. We collect only the information necessary to process your orders and communicate with you: name, email, phone number, and shipping address.

We do not sell or share your personal information with third parties. Your data is used solely for order fulfillment, customer support, and, with your consent, occasional updates about our collection.

We use secure methods to store and transmit your information. Payment details for Cash on Delivery are not stored.

If you have questions about your data, please contact us.`;

export default function PrivacyPage() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    fetch("/api/content?keys=privacy_policy")
      .then((r) => r.json())
      .then((d) => d.privacy_policy && setContent(d.privacy_policy))
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
          Privacy Policy
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
