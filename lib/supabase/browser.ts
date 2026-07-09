import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { getSupabaseBrowserConfig } from "@/lib/env";

export function createBrowserSupabaseClient() {
  const config = getSupabaseBrowserConfig();

  if (!config) {
    throw new Error(
      "Supabase browser config is incomplete. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return createClient<Database>(config.url, config.anonKey);
}
