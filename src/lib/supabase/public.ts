import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-free anon client for PUBLIC reads (published content only).
 *
 * Unlike the cookie-bound server client, this does not call cookies()/headers(),
 * so pages that read through it can be statically generated / ISR-cached
 * (their `export const revalidate` is honored instead of being forced dynamic).
 * Never use this for auth-scoped or draft/admin reads.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    { auth: { persistSession: false } }
  );
}
