"use client";

import { useEffect, useState } from "react";
import { Users, Star, Award, HeartHandshake } from "lucide-react";

const STATS_DATA = [
  { icon: Users,          target: 1200, label: "Happy Pilgrims",  suffix: "+" },
  { icon: Star,           target: 5,    label: "Customer Rating",  suffix: "/5" },
  { icon: Award,          target: 12,   label: "Years Experience", suffix: "+" },
  { icon: HeartHandshake, target: 100,  label: "Safe Visa Rate",   suffix: "%" },
];

export function StatsStrip() {
  const [counts, setCounts] = useState(STATS_DATA.map(() => 0));

  useEffect(() => {
    const duration = 2000; // 2 seconds animation
    const steps = 50;
    const intervalTime = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounts(
        STATS_DATA.map((item) => {
          const progress = Math.min(step / steps, 1);
          return Math.floor(item.target * progress);
        })
      );

      if (step >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white border-y border-border py-12 shadow-sm">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS_DATA.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center gap-2 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary transition-transform duration-300 group-hover:scale-110">
                  <Icon size={22} />
                </div>
                <div className="font-display text-3xl font-extrabold text-foreground tracking-tight">
                  {counts[idx]}
                  <span className="text-gold font-sans">{item.suffix}</span>
                </div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
