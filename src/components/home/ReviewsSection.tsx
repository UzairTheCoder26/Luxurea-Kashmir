"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Unexpected reviews response:", data);
          setReviews([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load reviews", err);
        setReviews([]);
      });
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-lavender/30 rounded-t-[2.5rem]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-2">Testimonials</p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink">
            Loved by Our Clients
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.slice(0, 6).map((review, i) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-cream/80 backdrop-blur rounded-3xl p-8 shadow-soft hover:shadow-soft-lg luxury-transition"
            >
              <Quote className="w-10 h-10 text-gold/40 mb-4" />
              <div className="flex text-gold mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-5 h-5 ${j < review.rating ? "fill-current" : "opacity-30"}`} />
                ))}
              </div>
              <p className="text-ink/90 leading-relaxed mb-6">&ldquo;{review.text}&rdquo;</p>
              <p className="text-ink/70 font-medium">— {review.name}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
