"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CODModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Array<{ productId: string; slug: string; name: string; price: number; size: string; quantity: number }>;
  onSubmit: (data: OrderFormData) => Promise<void>;
}

export interface OrderFormData {
  fullName: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
  items: Array<{ productId: string; size: string; quantity: number; price: number }>;
}

export function CODModal({
  isOpen,
  onClose,
  cartItems,
  onSubmit,
}: CODModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const items = cartItems.map((i) => ({
        productId: i.productId,
        size: i.size,
        quantity: i.quantity,
        price: i.price,
      }));
      await onSubmit({ ...form, items });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-cream w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-soft-lg"
          >
            <div className="sticky top-0 bg-cream rounded-t-3xl border-b border-ink/10 flex items-center justify-between p-6">
              <h2 className="font-serif text-xl text-ink">
                Place Order (Cash on Delivery)
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center text-ink/70 hover:text-ink hover:bg-ink/5 luxury-transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 rounded-2xl bg-rose/20 text-rose text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs tracking-widest uppercase text-ink/70 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="w-full border border-ink/20 rounded-2xl px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-ink/70 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-ink/20 rounded-2xl px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-ink/70 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                  className="w-full border border-ink/20 rounded-2xl px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-ink/70 mb-1">
                  Complete Address
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full border border-ink/20 rounded-2xl px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-ink/70 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full border border-ink/20 rounded-2xl px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-ink/70 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    className="w-full border border-ink/20 rounded-2xl px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-ink/70 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  required
                  value={form.pincode}
                  onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
                  className="w-full border border-ink/20 rounded-2xl px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase text-ink/70 mb-1">
                  Order Notes
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Special instructions, gift message, etc."
                  className="w-full border border-ink/20 rounded-2xl px-4 py-3 text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={loading} className="flex-1">
                  Place Order (COD)
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
