"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CODModal, OrderFormData } from "@/components/product/CODModal";
import { getImageUrl } from "@/lib/imageUtils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  embroidery?: string;
  fabric?: string;
  craftsmanship?: string;
  careInstructions?: string;
  deliveryDays: number;
  sizeChart?: string;
  inStock: boolean;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: getImageUrl(product.images?.[0]) || "",
      size: selectedSize,
      quantity,
      slug: product.slug,
    });
  };
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomImage, setZoomImage] = useState<number | null>(null);
  const [codModalOpen, setCodModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handlePlaceOrderClick = () => {
    if (!product || !selectedSize) return;
    setCodModalOpen(true);
  };

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

  const cartItemsForOrder = product
    ? [
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          size: selectedSize,
          quantity,
        },
      ]
    : [];

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(p);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink/60">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div className="space-y-4">
            <div
              className="relative aspect-[3/4] bg-beige overflow-hidden cursor-zoom-in rounded-3xl shadow-soft"
              onMouseEnter={() => setZoomImage(selectedImage)}
              onMouseLeave={() => setZoomImage(null)}
            >
              <Image
                src={getImageUrl(product.images?.[selectedImage] || product.images?.[0])}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover transition-transform duration-500 ${
                  zoomImage !== null ? "scale-150" : "scale-100"
                }`}
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square border-2 rounded-2xl overflow-hidden ${
                    selectedImage === i
                      ? "border-gold"
                      : "border-transparent hover:border-ink/20"
                  }`}
                >
                  <Image
                    src={getImageUrl(img)}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-serif text-3xl md:text-4xl text-ink">
                {product.name}
              </h1>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-xl font-medium text-ink">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-ink/50 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              <p className="mt-6 text-ink/80 leading-relaxed">
                {product.description}
              </p>

              {/* Size */}
              <div className="mt-8">
                <label className="block text-xs tracking-widest uppercase text-ink/70 mb-3">
                  Select Your Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 border rounded-2xl luxury-transition ${
                        selectedSize === s
                          ? "border-gold bg-gold/10 text-ink"
                          : "border-ink/20 hover:border-ink/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {product.sizeChart && (
                  <details className="mt-4 group rounded-lg border border-ink/10 bg-beige/20 overflow-hidden">
                    <summary className="cursor-pointer px-4 py-3 text-ink/80 text-sm font-medium hover:bg-beige/40 luxury-transition list-none [&::-webkit-details-marker]:hidden flex justify-between items-center">
                      Size Guide
                      <span className="text-gold transform group-open:rotate-180">▾</span>
                    </summary>
                    <div className="px-4 pb-4 pt-0">
                      <p className="text-ink/70 text-sm leading-relaxed whitespace-pre-line">{product.sizeChart}</p>
                    </div>
                  </details>
                )}
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <label className="block text-xs tracking-widest uppercase text-ink/70 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-2 w-fit border border-ink/20 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-ink/5"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-ink/5"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* COD Badge */}
              <div className="mt-6 flex items-center gap-2 text-sm">
                <span className="bg-gold/20 text-gold px-3 py-1.5 rounded-full text-xs tracking-wider">
                  Cash on Delivery
                </span>
                <span className="text-ink/60">
                  Est. dispatch: {product.deliveryDays} working days
                </span>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handlePlaceOrderClick}
                  disabled={!product.inStock || !selectedSize}
                  size="lg"
                  className="flex-1"
                >
                  Place Order (Cash on Delivery)
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || !selectedSize}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Add to Cart
                </Button>
              </div>

              {/* Product Details – Fabric, Embroidery, Craftsmanship, Care */}
              <div className="mt-12 border-t border-ink/10 pt-8">
                <h3 className="text-xs tracking-[0.2em] uppercase text-gold mb-6 font-medium">
                  Product Details
                </h3>
                <div className="space-y-5">
                  {product.fabric && (
                    <details className="group rounded-lg border border-ink/10 bg-beige/30 overflow-hidden" open>
                      <summary className="cursor-pointer flex items-center justify-between px-4 py-4 text-ink font-medium hover:bg-beige/50 luxury-transition list-none [&::-webkit-details-marker]:hidden">
                        <span className="text-sm tracking-wide">Fabric Details</span>
                        <span className="text-gold transform group-open:rotate-180 luxury-transition">▾</span>
                      </summary>
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-ink/80 text-[15px] leading-relaxed">{product.fabric}</p>
                      </div>
                    </details>
                  )}
                  {product.embroidery && (
                    <details className="group rounded-lg border border-ink/10 bg-beige/30 overflow-hidden" open>
                      <summary className="cursor-pointer flex items-center justify-between px-4 py-4 text-ink font-medium hover:bg-beige/50 luxury-transition list-none [&::-webkit-details-marker]:hidden">
                        <span className="text-sm tracking-wide">Embroidery</span>
                        <span className="text-gold transform group-open:rotate-180 luxury-transition">▾</span>
                      </summary>
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-ink/80 text-[15px] leading-relaxed">{product.embroidery}</p>
                      </div>
                    </details>
                  )}
                  {product.craftsmanship && (
                    <details className="group rounded-lg border border-ink/10 bg-beige/30 overflow-hidden" open>
                      <summary className="cursor-pointer flex items-center justify-between px-4 py-4 text-ink font-medium hover:bg-beige/50 luxury-transition list-none [&::-webkit-details-marker]:hidden">
                        <span className="text-sm tracking-wide">Craftsmanship</span>
                        <span className="text-gold transform group-open:rotate-180 luxury-transition">▾</span>
                      </summary>
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-ink/80 text-[15px] leading-relaxed">{product.craftsmanship}</p>
                      </div>
                    </details>
                  )}
                  {product.careInstructions && (
                    <details className="group rounded-lg border border-ink/10 bg-beige/30 overflow-hidden" open>
                      <summary className="cursor-pointer flex items-center justify-between px-4 py-4 text-ink font-medium hover:bg-beige/50 luxury-transition list-none [&::-webkit-details-marker]:hidden">
                        <span className="text-sm tracking-wide">Care Instructions</span>
                        <span className="text-gold transform group-open:rotate-180 luxury-transition">▾</span>
                      </summary>
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-ink/80 text-[15px] leading-relaxed">{product.careInstructions}</p>
                      </div>
                    </details>
                  )}
                  {!product.fabric && !product.embroidery && !product.craftsmanship && !product.careInstructions && (
                    <p className="text-ink/60 text-sm">No additional details available.</p>
                  )}
                </div>
              </div>
            </motion.div>
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
