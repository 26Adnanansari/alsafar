import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ credentials missing");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function check() {
  const { data: profiles, error } = await admin.from("profiles").select("*");
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("=== ALL PROFILES ===");
  console.log(profiles);
}

check();
