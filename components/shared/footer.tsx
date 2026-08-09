import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary-dark text-primary-foreground">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold">Al-Safar Hajj &amp; Umrah</p>
          <p className="mt-2 text-sm text-primary-foreground/70">
            Trusted travel partner for Hajj and Umrah journeys — licensed, transparent, and here for you every step of the way.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-primary-foreground/70">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} /> Licensed Agency
            </span>
            <span className="flex items-center gap-1">
              <Lock size={14} /> Data Encrypted
            </span>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">Company</p>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">Policies</p>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link href="/policy/refund" className="hover:text-white">Refund &amp; Cancellation</Link></li>
            <li><Link href="/policy/terms" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">Reach Us</p>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li>WhatsApp: +92 300 0000000</li>
            <li>Email: info@alsafar.travel</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/50">
        © {new Date().getFullYear()} Al-Safar Hajj &amp; Umrah Travels. All rights reserved.
      </div>
    </footer>
  );
}
