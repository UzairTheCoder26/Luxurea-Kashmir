"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { getImageUrl } from "@/lib/imageUtils";
import { CODModal, OrderFormData } from "@/components/product/CODModal";
import { useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [codModalOpen, setCodModalOpen] = useState(false);

  const handlePlaceOrder = async (data: OrderFormData) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.[0]?.message || "Order failed");
    }
    const { orderId } = await res.json();
    setCodModalOpen(false);
    router.push(`/order-confirmation?orderId=${orderId}`);
  };

  const cartItemsForOrder = cart.map((i) => ({
    productId: i.productId,
    slug: i.slug,
    name: i.name,
    price: i.price,
    size: i.size,
    quantity: i.quantity,
  }));

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(p);

  if (cart.length === 0 && !codModalOpen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="font-serif text-3xl text-ink">Your Cart</h1>
        <p className="mt-4 text-ink/60">Your cart is empty.</p>
        <Link href="/shop" className="mt-6">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-ink">Your Cart</h1>

        <div className="mt-12 space-y-8">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-6 pb-8 border-b border-ink/10"
            >
              <div className="relative w-28 h-36 flex-shrink-0 bg-beige rounded-2xl overflow-hidden">
                <Image
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/shop/${item.slug}`}
                  className="font-serif text-lg text-ink hover:text-gold"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-ink/70 text-sm">Size: {item.size}</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center border border-ink/20 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-ink/5"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-ink/5"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-ink/50 hover:text-rose"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-ink">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <Link href="/shop">
            <Button variant="ghost">Continue Shopping</Button>
          </Link>
          <div className="flex flex-col sm:items-end gap-3">
            <p className="text-lg">
              <span className="text-ink/70">Total: </span>
              <span className="font-medium text-ink">{formatPrice(cartTotal)}</span>
            </p>
            <Button onClick={() => setCodModalOpen(true)} size="lg">
              Place Order (Cash on Delivery)
            </Button>
          </div>
        </div>
      </div>

      <CODModal
        isOpen={codModalOpen}
        onClose={() => setCodModalOpen(false)}
        cartItems={cartItemsForOrder}
        onSubmit={handlePlaceOrder}
      />
    </div>
  );
}
