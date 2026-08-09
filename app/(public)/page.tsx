import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck, CreditCard, Headset, Star,
  ArrowRight, Award, Calendar, Check, MapPin, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/packages/package-card";
import { createClient } from "@/lib/supabase/server";
import type { Package } from "@/lib/types";

// ─── Mock packages shown before SQL schema is set up ───────────────────────
const MOCK_PACKAGES: Package[] = [
  {
    id: "1",
    title: "14 Days VIP Umrah — 5 Star Haram View",
    slug: "vip-umrah-14-days",
    category: "VIP",
    duration_days: 14,
    departure_city: "Karachi",
    hotel_makkah: "Clock Tower Towers",
    hotel_madinah: "Dar Al Iman Grand",
    makkah_distance: "50m",
    madinah_distance: "100m",
    flights_included: true,
    visa_included: true,
    transport_included: true,
    ziyarat_included: true,
    description: "Ultra-premium spiritual journey with 5-star rooms closest to Haram.",
    is_active: true,
    created_at: new Date().toISOString(),
    room_pricing: [
      { room_type: "Double", price: 345000, currency: "PKR" },
      { room_type: "Single", price: 465000, currency: "PKR" },
    ],
  },
  {
    id: "2",
    title: "15 Days Economy Umrah — Family Package",
    slug: "economy-family-15-days",
    category: "Economy",
    duration_days: 15,
    departure_city: "Lahore",
    hotel_makkah: "Safeer Al Mashaer",
    hotel_madinah: "Al Madinah Harmony",
    makkah_distance: "600m",
    madinah_distance: "400m",
    flights_included: true,
    visa_included: true,
    transport_included: true,
    ziyarat_included: false,
    description: "Comfortable and budget-friendly for families of all sizes.",
    is_active: true,
    created_at: new Date().toISOString(),
    room_pricing: [
      { room_type: "Quad", price: 175000, currency: "PKR" },
      { room_type: "Double", price: 225000, currency: "PKR" },
    ],
  },
  {
    id: "3",
    title: "21 Days Deluxe Hajj Package 2026",
    slug: "deluxe-hajj-21-days",
    category: "Deluxe",
    duration_days: 21,
    departure_city: "Islamabad",
    hotel_makkah: "Hilton Suites Makkah",
    hotel_madinah: "Anwar Al Madinah Mövenpick",
    makkah_distance: "200m",
    madinah_distance: "250m",
    flights_included: true,
    visa_included: true,
    transport_included: true,
    ziyarat_included: true,
    description: "Complete Hajj experience with expert guides and premium accommodations.",
    is_active: true,
    created_at: new Date().toISOString(),
    room_pricing: [
      { room_type: "Quad", price: 895000, currency: "PKR" },
      { room_type: "Triple", price: 995000, currency: "PKR" },
    ],
  },
];

async function getFeaturedPackages(): Promise<Package[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("packages")
      .select("*, room_pricing:package_room_pricing(room_type, price, currency)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(3);
    if (data && data.length > 0) return data as Package[];
  } catch {
    // Database not set up yet — fallback to mocks
  }
  return MOCK_PACKAGES;
}

// Build gallery from packages that have a cover_image_url
function buildGallery(packages: Package[]) {
  const GALLERY_META: Record<string, { title: string; desc: string; tag: string }> = {
    VIP:      { title: "Haram Makkah Mukarramah",  desc: "Closest hotels — walking distance to Masjid al-Haram",         tag: "Makkah" },
    Deluxe:   { title: "Masjid an-Nabawi",          desc: "Stay steps away from the blessed Green Dome",                  tag: "Madinah" },
    Economy:  { title: "Guided Ziyarat Tours",       desc: "Knowledgeable guides at every historical site",               tag: "Ziyarat" },
  };
  const FALLBACK = [
    { src: "/images/kaaba.jpg",   title: "Haram Makkah Mukarramah",  desc: "Closest hotels — walking distance to Masjid al-Haram", tag: "Makkah"  },
    { src: "/images/madinah.jpg", title: "Masjid an-Nabawi",          desc: "Stay steps away from the blessed Green Dome",          tag: "Madinah" },
    { src: "/images/kaaba.jpg",   title: "Guided Ziyarat Tours",       desc: "Knowledgeable guides at every historical site",        tag: "Ziyarat" },
  ];

  const withImages = packages.filter(p => p.cover_image_url);
  if (withImages.length === 0) return FALLBACK;

  return withImages.slice(0, 3).map((pkg) => {
    const meta = GALLERY_META[pkg.category] ?? GALLERY_META.Economy;
    return { src: pkg.cover_image_url!, title: pkg.title, desc: meta.desc, tag: meta.tag };
  });
}

// ─── Trust strip items ───────────────────────────────────────────────────────
const TRUST = [
  { icon: ShieldCheck, label: "Licensed Agency",     desc: "Govt. approved IATA operator" },
  { icon: CreditCard,  label: "Easy Installments",   desc: "Pay in flexible monthly plans" },
  { icon: Headset,     label: "24/7 On-Ground Help", desc: "Guides with you in Makkah & Madinah" },
  { icon: Star,        label: "1,000+ Served",        desc: "Trusted by families since 2018" },
];

// Gallery is built dynamically in the page component from package cover images

export default async function HomePage() {
  const packages = await getFeaturedPackages();
  const GALLERY  = buildGallery(packages);

  return (
    <div className="overflow-x-hidden bg-[#FAF9F4]">

      {/* ════════════════════════════════════════════════════════
          HERO — premium animated section
          ════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92svh] overflow-hidden bg-gradient-to-br from-[#062215] via-[#0F5132] to-[#083320] flex items-center">

        {/* Decorative background glow blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full bg-gold/8 blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary/30 blur-[80px]" />
          {/* Geometric star accent */}
          <div className="absolute right-8 top-24 opacity-10 animate-spin-slow hidden md:block">
            <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
              <polygon points="90,10 110,70 170,70 122,108 140,170 90,133 40,170 58,108 10,70 70,70" fill="#C9A227" />
            </svg>
          </div>
          {/* Subtle dot-grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div className="container relative z-10 py-20 md:py-28">
          <div className="grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr] lg:gap-20">

            {/* ── Left column: copy ── */}
            <div className="flex flex-col gap-6">
              {/* Brand eyebrow */}
              <div className="animate-fade-up flex items-center gap-2.5">
                <span className="h-px w-8 bg-gold" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                  Pakistan's Trusted Hajj & Umrah Agency
                </span>
              </div>

              {/* Main heading */}
              <h1 className="animate-fade-up delay-100 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
                Your Sacred<br />
                Journey{" "}
                <span className="text-shimmer">Deserves</span>
                <br />
                the Best Care
              </h1>

              {/* Urdu sub-tagline */}
              <p className="animate-fade-up delay-200 font-urdu text-xl text-gold/90">
                ہر قدم پر آپ کے ساتھ
              </p>

              {/* Description */}
              <p className="animate-fade-up delay-300 max-w-lg text-sm leading-relaxed text-white/75 md:text-base">
                Al-Safar offers transparent Hajj & Umrah packages with verified closest-to-Haram hotels,
                direct PIA & Emirates flights, and a dedicated ground team in both holy cities.
              </p>

              {/* CTA buttons */}
              <div className="animate-fade-up delay-400 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  variant="gold"
                  className="h-13 w-full rounded-xl text-base font-semibold shadow-lg shadow-gold/25 sm:w-auto"
                  asChild
                >
                  <Link href="/packages" className="flex items-center justify-center gap-2">
                    Browse Packages <ArrowRight size={17} />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 w-full rounded-xl border-white/25 text-white backdrop-blur-sm hover:bg-white/10 sm:w-auto"
                  asChild
                >
                  <Link href="tel:+92300000000" className="flex items-center justify-center gap-2">
                    <Phone size={15} /> Call Us Now
                  </Link>
                </Button>
              </div>

              {/* Social proof pills */}
              <div className="animate-fade-up delay-500 flex flex-wrap gap-3 border-t border-white/10 pt-6">
                {[
                  { icon: Award,    text: "Govt. ATOP Registered" },
                  { icon: Calendar, text: "2026 Slots Available" },
                  { icon: Check,    text: "Price Match Guarantee" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80"
                  >
                    <Icon size={12} className="text-gold" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right column: package selector card ── */}
            <div className="animate-fade-right delay-300">
              <div className="glass rounded-2xl p-7 shadow-2xl">
                <div className="mb-6 text-center">
                  <p className="font-urdu text-2xl leading-relaxed text-gold">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                  <h3 className="mt-2 font-display text-base font-semibold text-white">Find Your Package</h3>
                  <p className="text-xs text-white/50">Choose your journey class</p>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { cat: "VIP",     label: "5-Star Haram View", from: "Rs 3.45 Lac/person" },
                    { cat: "Deluxe",  label: "Comfort + Value",   from: "Rs 2.25 Lac/person" },
                    { cat: "Economy", label: "Budget Family Plan", from: "Rs 1.75 Lac/person" },
                  ].map(({ cat, label, from }) => (
                    <Link
                      key={cat}
                      href={`/packages?category=${cat}`}
                      className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-all duration-300 hover:border-gold/60 hover:bg-white/10"
                    >
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-gold transition-colors">
                          {cat}
                        </p>
                        <p className="text-xs text-white/55">{label}</p>
                        <p className="mt-0.5 text-xs font-semibold text-gold/70">From {from}</p>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold"
                      />
                    </Link>
                  ))}
                </div>

                {/* Quick inquiry */}
                <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gold/10 px-4 py-3">
                  <MapPin size={13} className="text-gold" />
                  <span className="text-xs text-white/70">
                    Departures from Karachi, Lahore & Islamabad
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#FAF9F4" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TRUST STRIP
          ════════════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-border py-10 shadow-sm">
        <div className="container">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {TRUST.map(({ icon: Icon, label, desc }, i) => (
              <div
                key={label}
                className="group flex flex-col items-center gap-3 text-center"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/6 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-md">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FEATURED PACKAGES
          ════════════════════════════════════════════════════════ */}
      <section className="container py-20">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="section-divider mb-3" />
            <h2 className="font-display text-3xl font-bold">Featured Packages</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Transparent pricing · Close hotels · Verified operator
            </p>
          </div>
          <Link
            href="/packages"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            View all packages <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, idx) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              imageUrl={idx % 2 === 0 ? "/images/kaaba.jpg" : "/images/madinah.jpg"}
            />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          GALLERY — hover lift cards
          ════════════════════════════════════════════════════════ */}
      <section className="border-t border-border bg-white py-20">
        <div className="container">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-3 section-divider" />
            <h2 className="font-display text-3xl font-bold">Experience the Journey</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A glimpse of the sacred cities that await you
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map((item, idx) => (
              <div key={idx} className="gallery-card group relative overflow-hidden rounded-2xl shadow-md">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                </div>

                {/* Tag badge */}
                <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold text-white shadow-sm">
                  {item.tag}
                </span>

                {/* Bottom copy */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 transition-transform duration-300 group-hover:translate-y-0">
                  <h4 className="font-display text-lg font-bold text-white">{item.title}</h4>
                  <p className="mt-1 text-xs text-white/75 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          BOTTOM CTA BANNER
          ════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-[#0A3622] to-[#0F5132] py-14 text-white">
        <div className="container flex flex-col items-center gap-6 text-center">
          <div className="animate-float text-4xl">🕋</div>
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Ready to Begin Your Sacred Journey?
          </h2>
          <p className="max-w-md text-sm text-white/70">
            Speak with our experts today. Free consultation, no pressure — just honest guidance.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" variant="gold" className="h-13 rounded-xl font-semibold" asChild>
              <Link href="/packages">Browse All Packages</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 rounded-xl border-white/25 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/contact">Talk to an Advisor</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
