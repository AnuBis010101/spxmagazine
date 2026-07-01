import { createClient as createServerClient } from "@/lib/supabase/server";

/**
 * Returns true if the current request carries an authenticated Supabase session
 * that is allowed to perform admin actions.
 *
 * If the `ADMIN_EMAILS` env var is set (comma-separated list), the signed-in
 * user's email must be in that allowlist. If it is unset, any authenticated
 * user passes (legacy behavior) — set `ADMIN_EMAILS` in production to lock the
 * admin surface to specific accounts.
 */
export async function verifyAdmin(): Promise<boolean> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const allowlist = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (allowlist.length === 0) return true;
    return !!user.email && allowlist.includes(user.email.toLowerCase());
  } catch {
    return false;
  }
}
