"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-6 left-6 text-cream/50 hover:text-cream text-sm">
        ← Back to Store
      </Link>
      <div className="w-full max-w-md bg-purple/30 backdrop-blur rounded-3xl p-8 shadow-soft-lg border border-cream/10">
        <h1 className="font-serif text-2xl text-cream text-center mb-2">
          Staff / Admin Login
        </h1>
        <p className="text-cream/60 text-sm text-center mb-8">
          Manage products, orders & content
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-rose text-sm text-center">{error}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-cream/5 border border-cream/20 rounded-2xl px-5 py-3.5 text-cream placeholder-cream/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-cream/5 border border-cream/20 rounded-2xl px-5 py-3.5 text-cream placeholder-cream/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
          <Button type="submit" fullWidth isLoading={loading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
