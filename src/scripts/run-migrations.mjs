// Run all pending DB migrations for SPX6900 Magazine
// Uses Supabase REST API with service role key to create a helper function,
// then calls it to execute DDL statements.

const SUPABASE_URL = "https://hvmndangtzarsnqgnuky.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bW5kYW5ndHphcnNucWdudWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDYyNTQ1MSwiZXhwIjoyMDkwMjAxNDUxfQ.oWPVawa-d7-5i-3XFt0n-DUEI2po3OEwOr5hGcTExY0";

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};

async function rpc(name, args = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers,
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RPC ${name} failed (${res.status}): ${text}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function main() {
  // Step 1: Create a temporary helper function that can execute arbitrary SQL
  console.log("Creating helper function...");

  // We can't create functions via REST, but we can check if the table exists
  // by trying to select from it. If it doesn't exist, we'll tell the user.

  // Try to check if glossary_terms exists by selecting from it
  const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/glossary_terms?select=id&limit=1`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });

  if (checkRes.status === 404 || checkRes.status === 400) {
    // Table doesn't exist
    console.log("glossary_terms table does not exist.");
    console.log("\n======================================");
    console.log("MANUAL STEP REQUIRED");
    console.log("======================================");
    console.log("Go to: https://supabase.com/dashboard/project/hvmndangtzarsnqgnuky/sql/new");
    console.log("Paste and run the following SQL:\n");
    console.log(`-- Create glossary_terms table
CREATE TABLE IF NOT EXISTS glossary_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  term TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  category TEXT,
  related_terms TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read glossary" ON glossary_terms FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage glossary" ON glossary_terms FOR ALL USING (auth.role() = 'authenticated');

-- Add reactions column to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '{}';`);
    console.log("\nAfter running the SQL, re-run this script to seed data.");
    return;
  }

  console.log("glossary_terms table exists!");

  // Check if it has data
  const dataRes = await fetch(`${SUPABASE_URL}/rest/v1/glossary_terms?select=id&limit=1`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  const existing = await dataRes.json();

  if (existing.length === 0) {
    console.log("Table is empty, proceeding to seed...");
  } else {
    console.log(`Table already has ${existing.length}+ records. Seeding will upsert.`);
  }

  // Now run the seed scripts
  console.log("\nSeeding glossary terms...");
  const { default: glossarySeed } = await import("./create-glossary-table.mjs");

  console.log("\nSeeding community tools...");
  const { default: toolsSeed } = await import("./seed-community-tools.mjs");
}

main().catch(console.error);
