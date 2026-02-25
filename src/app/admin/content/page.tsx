"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const contentKeys = [
  { key: "hero_title", label: "Hero Title" },
  { key: "hero_subtext", label: "Hero Subtext" },
  { key: "hero_image", label: "Hero Image URL" },
  { key: "instagram_url", label: "Instagram Profile URL" },
  { key: "about_content", label: "About Page Content" },
  { key: "craftsmanship_content", label: "Craftsmanship Page Content" },
  { key: "shipping_policy", label: "Shipping Policy" },
  { key: "returns_policy", label: "Returns & Exchanges Policy" },
  { key: "privacy_policy", label: "Privacy Policy" },
  { key: "terms_policy", label: "Terms & Conditions" },
];

export default function AdminContentPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then(setContent)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (key: string, value: string) => {
    setSaving(key);
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, content: value }),
      });
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <p className="text-cream/60">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-serif text-cream mb-8">Site Content</h1>
      <div className="space-y-6 max-w-2xl">
        {contentKeys.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-cream/60 text-sm mb-1">{label}</label>
            {key.includes("content") || key.includes("policy") ? (
              <textarea
                rows={8}
                value={content[key] || ""}
                onChange={(e) =>
                  setContent((c) => ({ ...c, [key]: e.target.value }))
                }
                onBlur={(e) => handleSave(key, e.target.value)}
                className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none resize-none"
              />
            ) : (
              <input
                type="text"
                value={content[key] || ""}
                onChange={(e) =>
                  setContent((c) => ({ ...c, [key]: e.target.value }))
                }
                onBlur={(e) => handleSave(key, e.target.value)}
                className="w-full bg-cream/5 border border-cream/20 px-4 py-2 text-cream focus:border-gold focus:outline-none"
              />
            )}
            {saving === key && (
              <span className="text-cream/50 text-sm ml-2">Saving...</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
