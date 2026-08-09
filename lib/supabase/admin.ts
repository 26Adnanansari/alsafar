import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — BYPASSES Row Level Security.
 *
 * ⚠️ Server-side only. Never import this into a Client Component or
 * expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 *
 * Use only inside:
 *  - app/admin/** server actions, after confirming the caller's role === 'admin'
 *  - trusted webhook / cron route handlers (app/api/cron/*, app/api/payments/webhook)
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
