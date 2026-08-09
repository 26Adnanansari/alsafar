import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function fix() {
  // 1. Pehle current state dekho
  const { data: before } = await admin.from("profiles").select("id, full_name, role");
  console.log("=== BEFORE ===");
  console.table(before);

  // 2. Admin ka role force-set karo (service role bypasses RLS)
  const { error } = await admin
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", "1c4171a6-8ffa-4443-9b03-c6101c6a2b07");

  if (error) {
    console.error("❌ Update failed:", error.message);
    return;
  }

  // 3. Confirm
  const { data: after } = await admin.from("profiles").select("id, full_name, role");
  console.log("\n=== AFTER ===");
  console.table(after);
  console.log("\n✅ Admin role confirmed!");
}

fix().catch(console.error);
