"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const defaultContent = `Terms & Conditions

By using Luxureakashmir.com, you agree to these terms.

Orders: All orders are subject to availability. We reserve the right to refuse or cancel orders at our discretion. Prices are in INR and include applicable taxes.

Intellectual Property: All content on this site — imagery, text, designs — is the property of Luxureakashmir and may not be reproduced without permission.

Limitation of Liability: We are not liable for indirect or consequential damages arising from use of our site or products.

Governing Law: These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in India.

We may update these terms. Continued use of the site constitutes acceptance of any changes.`;

export default function TermsPage() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    fetch("/api/content?keys=terms_policy")
      .then((r) => r.json())
      .then((d) => d.terms_policy && setContent(d.terms_policy))
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
          Terms & Conditions
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
