"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/packages", label: "Packages" },
  { href: "/about",    label: "About Us" },
  { href: "/faq",      label: "FAQ" },
  { href: "/contact",  label: "Contact" },
];

export function Navbar() {
  const [open, setOpen]           = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  // Add shadow when user scrolls — standard UX pattern
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur transition-shadow duration-300",
          scrolled && "shadow-md"
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl font-semibold text-primary"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">AS</span>
            Al-Safar{" "}
            <span className="text-gold hidden sm:inline">Hajj & Umrah</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-2.5 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" className="rounded-full px-5" asChild>
              <Link href="/packages">Book Now</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-muted transition-colors md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen menu ── */}
      <div
        className={cn(
          "fixed inset-0 z-30 flex flex-col bg-background transition-all duration-300 md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ top: "64px" }} /* below sticky header */
      >
        <nav className="flex flex-col divide-y divide-border overflow-y-auto" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-6 py-5 text-base font-medium text-foreground transition-colors hover:bg-muted active:bg-muted"
            >
              {link.label}
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          ))}
        </nav>

        {/* Mobile CTAs at bottom */}
        <div className="mt-auto border-t border-border p-5">
          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full rounded-xl text-base font-semibold" asChild>
              <Link href="/packages" onClick={() => setOpen(false)}>Book Now 🕋</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full rounded-xl" asChild>
              <Link href="/login" onClick={() => setOpen(false)}>Login to My Account</Link>
            </Button>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Licensed ATOP Hajj & Umrah Operator — Pakistan
          </p>
        </div>
      </div>
    </>
  );
}
