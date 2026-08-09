/**
 * Run this script ONCE to create the admin account:
 *   node scripts/create-admin.mjs
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌  .env.local mein NEXT_PUBLIC_SUPABASE_URL aur SUPABASE_SERVICE_ROLE_KEY set karein");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log("🔐 Admin user create ho raha hai...");

  // 1. Auth user create
  const { data: authData, error: authErr } = await admin.auth.admin.createUser({
    email:             "pakaiverse@gmail.com",
    password:          "Hajj@pakaiverse",
    email_confirm:     true,          // email verification skip
    user_metadata: {
      full_name: "Al-Safar Admin",
      phone:     "03000000000",
    },
  });

  if (authErr) {
    if (authErr.message.includes("already registered")) {
      console.log("ℹ️  User pehle se exist karta hai — sirf role update karte hain...");
      // fetch existing user
      const { data: list } = await admin.auth.admin.listUsers();
      const existing = list?.users?.find(u => u.email === "pakaiverse@gmail.com");
      if (existing) {
        await upsertProfile(existing.id);
      }
      return;
    }
    throw authErr;
  }

  console.log("✅ Auth user ban gaya:", authData.user.id);
  await upsertProfile(authData.user.id);
}

async function upsertProfile(userId) {
  const { error: profileErr } = await admin.from("profiles").upsert({
    id:        userId,
    full_name: "Al-Safar Admin",
    phone:     "03000000000",
    role:      "admin",
    preferred_language: "ur",
  });

  if (profileErr) throw profileErr;
  console.log("✅ Profile role=admin set ho gayi!");
  console.log("──────────────────────────────────");
  console.log("📧 Email    : pakaiverse@gmail.com");
  console.log("🔑 Password : Hajj@pakaiverse");
  console.log("🛡️  Role    : admin");
  console.log("──────────────────────────────────");
  console.log("👉 Login karein: http://localhost:3000/login");
}

run().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
