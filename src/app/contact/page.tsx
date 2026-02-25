"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSent(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: "", email: "", phone: "", message: "" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-xl mx-auto px-6 py-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl md:text-5xl text-ink"
        >
          Contact
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-ink/70"
        >
          We&apos;re here to help. Questions about sizing, care, or your order? Reach out — we&apos;ll respond within 24 hours.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="mt-12 space-y-6"
        >
          {sent && (
            <p className="text-gold text-sm">Thank you. We will be in touch.</p>
          )}
          <div>
            <label className="block text-xs tracking-widest uppercase text-ink/60 mb-2">
              Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-ink/20 rounded-2xl px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-ink/60 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full border border-ink/20 rounded-2xl px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-ink/60 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full border border-ink/20 rounded-2xl px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-ink/60 mb-2">
              Message
            </label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full border border-ink/20 rounded-2xl px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 resize-none"
            />
          </div>
          <Button type="submit" isLoading={loading}>
            Send Message
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
