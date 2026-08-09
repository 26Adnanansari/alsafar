# Al-Safar Hajj & Umrah Travels — Starter Codebase

This is a working Next.js + Supabase + Tailwind/shadcn-style starting point implementing the
core customer flow from the blueprint: landing page → browse packages → view package detail →
book (room selection + passenger form) → customer dashboard (payment timeline + document
upload) → admin bookings table.

## What's included (real code, not just structure)

- `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts` — design system (colors, type, motion)
- `lib/supabase/{client,server,admin}.ts` — Supabase client setup for browser/RSC/admin
- `lib/validations/booking.ts` — zod schemas (passport expiry rule, required fields)
- `lib/types.ts` — shared TypeScript types matching the SQL schema
- `middleware.ts` — session refresh + role-based route protection
- `components/ui/*` — Button, Card, Badge, Input, Label (shadcn-style primitives)
- `components/shared/*` — Navbar, Footer, WhatsAppButton
- `components/packages/*` — PackageCard, RoomTypeSelector
- `components/booking/*` — BookingForm, PassengerForm, DocumentUpload
- `components/payments/*` — StatusBadge, InstallmentTimeline
- `app/(public)/page.tsx` — landing page
- `app/(public)/packages/page.tsx` — catalog with category filters
- `app/(public)/packages/[id]/page.tsx` — package detail + booking form
- `app/(auth)/login/page.tsx` — login
- `app/dashboard/bookings/page.tsx` + `[id]/page.tsx` — customer bookings + documents
- `app/admin/bookings/page.tsx` — admin bookings table

## Not included yet (next iteration)
- Register page, admin packages CRUD, agent portal pages, JazzCash/Easypaisa route handlers,
  WhatsApp notification route, passport-expiry cron job, i18n message files.
  These follow the same patterns as the files above — say the word and I'll build them next.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in your Supabase project keys.
3. Run the SQL from the blueprint (schema + RLS policies) in the Supabase SQL editor.
4. Create Supabase Storage buckets: `passport-documents` (private), `package-images` (public).
5. `npm run dev`

## Notes
- All forms validate with `zod` + `react-hook-form` — passport expiry enforces the
  6-month Saudi visa rule automatically.
- RLS policies (from the SQL blueprint) are what actually keep one customer from seeing
  another's booking — the app code assumes they're in place.
- No animation libraries beyond Tailwind transitions + one `fade-up` keyframe, per the
  performance-first decision.
