import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase clients — built LAZILY (never at module load).
 *
 * Why lazy: Next.js evaluates every route module at build time ("collect page
 * data"). If we construct the client at the top level, a missing or malformed
 * NEXT_PUBLIC_SUPABASE_URL env var makes createClient throw and the whole build
 * fails ("Failed to collect page data for /api/kundli"). Building on first use
 * — plus validating the URL — makes the build bulletproof regardless of env vars.
 */

const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_ANON = 'placeholder-anon-key';
const FALLBACK_SERVICE = 'placeholder-service-key';

// Guard: only accept a proper http(s) URL, else fall back to placeholder.
function safeUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return FALLBACK_URL;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return url;
    return FALLBACK_URL;
  } catch {
    return FALLBACK_URL;
  }
}

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      safeUrl(),
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON
    );
  }
  return _client;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('Admin client must not be used in the browser');
  }
  return createClient(
    safeUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY || FALLBACK_SERVICE,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Backwards-compatible `supabase` export.
 * It's a Proxy, so the real client is only constructed on first property
 * access (which happens at runtime in the browser) — NOT at import/build time.
 * Existing code like `supabase.auth.signInWithOtp(...)` keeps working unchanged.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
