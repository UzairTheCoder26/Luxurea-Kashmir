"use client";

import { useEffect, useState } from "react";
import { Star, Pencil, Trash2, Plus } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  approved: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Review | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, text: "", approved: true });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) {
        console.error("Failed to load reviews", await res.text());
        setReviews([]);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        setReviews([]);
      }
    } catch (e) {
      console.error(e);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSave = async () => {
    try {
      let res: Response;
      if (editing) {
        res = await fetch(`/api/admin/reviews/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch("/api/admin/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      if (!res.ok) {
        const errorText = await res.text();
        alert("Could not save review. Please check the fields (review text at least 10 characters) and try again.");
        console.error("Save review failed:", errorText);
        return;
      }
      setEditing(null);
      setShowForm(false);
      setForm({ name: "", rating: 5, text: "", approved: true });
      fetchReviews();
    } catch (e) {
      console.error(e);
      alert("Something went wrong while saving the review.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    fetchReviews();
  };

  const openEdit = (r: Review) => {
    setEditing(r);
    setForm({ name: r.name, rating: r.rating, text: r.text, approved: r.approved });
    setShowForm(true);
  };

  if (loading) return <p className="text-cream/60">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-cream">Reviews</h1>
        <button
          onClick={() => {
            setEditing(null);
            setForm({ name: "", rating: 5, text: "", approved: true });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold hover:bg-gold/30 rounded-full"
        >
          <Plus className="w-5 h-5" />
          Add Review
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-cream/5 rounded-2xl border border-cream/10 space-y-4">
          <h2 className="text-cream font-medium">{editing ? "Edit Review" : "Add Review"}</h2>
          <input
            type="text"
            placeholder="Customer Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full bg-cream/5 border border-cream/20 rounded-2xl px-4 py-2 text-cream"
          />
          <div>
            <label className="text-cream/60 text-sm">Rating (1-5)</label>
            <select
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: parseInt(e.target.value) }))}
              className="w-full bg-cream/5 border border-cream/20 rounded-2xl px-4 py-2 text-cream mt-1"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} stars</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Review text"
            rows={4}
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            className="w-full bg-cream/5 border border-cream/20 rounded-2xl px-4 py-2 text-cream resize-none"
          />
          <label className="flex items-center gap-2 text-cream">
            <input
              type="checkbox"
              checked={form.approved}
              onChange={(e) => setForm((f) => ({ ...f, approved: e.target.checked }))}
            />
            Approved (visible on site)
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gold text-ink rounded-full"
            >
              Save
            </button>
            <button
              onClick={() => { setShowForm(false); setEditing(null); }}
              className="px-4 py-2 text-cream/70"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="p-6 bg-cream/5 rounded-2xl border border-cream/10 flex justify-between items-start gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-cream font-medium">{r.name}</span>
                <span className="flex text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < r.rating ? "fill-current" : "opacity-30"}`} />
                  ))}
                </span>
                {r.approved ? (
                  <span className="text-xs text-gold/80">Approved</span>
                ) : (
                  <span className="text-xs text-rose/80">Pending</span>
                )}
              </div>
              <p className="mt-2 text-cream/80 text-sm">{r.text}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(r)} className="p-2 text-gold hover:bg-gold/20 rounded-full">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(r.id)} className="p-2 text-rose hover:bg-rose/20 rounded-full">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && !showForm && (
          <p className="text-cream/60">No reviews yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
