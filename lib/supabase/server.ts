import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { getSupabaseServerConfig } from "@/lib/env";

export function createServiceRoleSupabaseClient() {
  const { config, status } = getSupabaseServerConfig();

  if (!config) {
    throw new Error(
      `Supabase server config is incomplete. Missing: ${status.missing.join(
        ", ",
      )}. Invalid: ${status.invalid.join(", ")}`,
    );
  }

  return createClient<Database>(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
