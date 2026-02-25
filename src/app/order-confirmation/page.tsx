"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();

  useEffect(() => {
    if (orderId) clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-gold/20 flex items-center justify-center mb-8">
          <span className="text-gold text-3xl">✓</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink">
          Order Confirmed
        </h1>
        <p className="mt-4 text-ink/70">
          Thank you for your order. We will contact you shortly to confirm
          delivery details.
        </p>
        {orderId && (
          <p className="mt-6 font-mono text-sm text-ink/80 bg-beige/80 rounded-2xl px-5 py-3">
            Order ID: {orderId}
          </p>
        )}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/track-order?orderId=${orderId || ""}`}>
            <Button variant="outline">Track Order</Button>
          </Link>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
