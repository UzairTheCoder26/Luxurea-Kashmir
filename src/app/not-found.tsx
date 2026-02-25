import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <p className="font-serif text-6xl md:text-8xl text-ink/20">404</p>
      <h1 className="font-serif text-2xl md:text-3xl text-ink mt-4">
        Page Not Found
      </h1>
      <p className="mt-4 text-ink/60 text-center max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="mt-8">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
