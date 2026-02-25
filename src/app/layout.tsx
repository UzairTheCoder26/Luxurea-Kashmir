import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { CartProvider } from "@/context/CartContext";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luxureakashmir | Crafted Silence. Worn Royalty.",
  description:
    "Luxury women's clothing. Timeless Kashmiri elegance, hand-finished embroidery, heritage craftsmanship. Premium kaftans & modest wear.",
  keywords: ["women's clothing", "Kashmiri", "luxury", "embroidery", "kaftan", "modest fashion", "premium fashion"],
  openGraph: {
    title: "Luxureakashmir | Crafted Silence. Worn Royalty.",
    description: "Timeless Kashmiri elegance. Heritage craftsmanship. Modern minimalism.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="font-sans min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileNav />
        </CartProvider>
      </body>
    </html>
  );
}
