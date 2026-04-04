import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function resolveUrl(): string | undefined {
  return (
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
    undefined
  );
}

/** Chave anon/public — nunca use service_role no frontend. */
function resolveAnonKey(): string | undefined {
  return (
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    undefined
  );
}

const url = resolveUrl();
const anonKey = resolveAnonKey();

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(url!, anonKey!, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase não configurado. Defina a URL e a chave anon no .env.");
  }
  return supabase;
}
