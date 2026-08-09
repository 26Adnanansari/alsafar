import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    // ── RESPONSIVE CONTAINERS (mobile-first, company standard) ──
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",    // 16px — mobile
        sm:      "1.25rem", // 20px — large phone
        md:      "1.5rem",  // 24px — tablet
        lg:      "2rem",    // 32px — small laptop
        xl:      "2rem",
        "2xl":   "2rem",
      },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "#0F5132",
          dark:       "#0A3622",
          foreground: "#FAF9F4",
        },
        gold: {
          DEFAULT: "#C9A227",
          light:   "#E6C866",
          dark:    "#8B6914",
        },
        muted: {
          DEFAULT:    "#F1F0EA",
          foreground: "#6B7280",
        },
        destructive: {
          DEFAULT:    "#B3261E",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT:    "#FFFFFF",
          foreground: "#1C1C1A",
        },
      },

      // ── TYPOGRAPHY SCALE (mobile-first fluid sizes) ──
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],  // 10px
        xs:    ["0.75rem",  { lineHeight: "1rem" }],       // 12px
        sm:    ["0.875rem", { lineHeight: "1.375rem" }],   // 14px
        base:  ["1rem",     { lineHeight: "1.625rem" }],   // 16px
        lg:    ["1.125rem", { lineHeight: "1.75rem" }],    // 18px
        xl:    ["1.25rem",  { lineHeight: "1.875rem" }],   // 20px
        "2xl": ["1.5rem",   { lineHeight: "2rem" }],       // 24px
        "3xl": ["1.875rem", { lineHeight: "2.375rem" }],   // 30px
        "4xl": ["2.25rem",  { lineHeight: "2.75rem" }],    // 36px
        "5xl": ["3rem",     { lineHeight: "1.15" }],       // 48px
        "6xl": ["3.75rem",  { lineHeight: "1.1" }],        // 60px
      },

      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans:    ["var(--font-inter)", "sans-serif"],
        urdu:    ["var(--font-noto-nastaliq)", "serif"],
      },

      borderRadius: {
        "2xl": "1rem",
        xl:    "0.75rem",
        lg:    "0.625rem",
        md:    "0.5rem",
        sm:    "0.375rem",
      },

      // ── SPACING ──
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top":    "env(safe-area-inset-top)",
      },

      // ── KEYFRAMES ──
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-left": {
          "0%":   { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-right": {
          "0%":   { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "pulse-scale": {
          "0%, 100%": { transform: "scale(1)" },
          "50%":      { transform: "scale(1.05)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
      },

      // ── ANIMATION PRESETS ──
      animation: {
        "fade-up":     "fade-up 0.6s ease-out both",
        "fade-left":   "fade-left 0.6s ease-out both",
        "fade-right":  "fade-right 0.6s ease-out both",
        float:         "float 4s ease-in-out infinite",
        "spin-slow":   "spin-slow 20s linear infinite",
        "pulse-scale": "pulse-scale 2s ease-in-out infinite",
        marquee:       "marquee 20s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
