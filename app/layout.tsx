import type { Metadata } from "next";
import { Fraunces, Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import "./globals.css";

// Display face — used with restraint (H1/H2, price highlights, logo)
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
});

// Body face — fast, readable, standard UI text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Urdu content (dua's, package names, footer notices where needed)
const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-noto-nastaliq",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Al-Safar Hajj & Umrah Travels",
  description: "Trusted Hajj and Umrah packages — transparent pricing, licensed agency, secure booking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} ${notoNastaliq.variable}`}>
        <Navbar />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <WhatsAppButton />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
