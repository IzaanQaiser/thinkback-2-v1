const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PHASE_1_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DEFAULT_USER_ID",
] as const;

export type Phase1EnvKey = (typeof PHASE_1_ENV_KEYS)[number];

export type Phase1ConfigStatus = {
  configured: boolean;
  missing: Phase1EnvKey[];
  invalid: string[];
};

function readEnv(key: string) {
  const value = process.env[key];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

export function getPhase1ConfigStatus(): Phase1ConfigStatus {
  const missing = PHASE_1_ENV_KEYS.filter((key) => readEnv(key) === null);
  const invalid: string[] = [];
  const defaultUserId = readEnv("DEFAULT_USER_ID");

  if (defaultUserId && !UUID_PATTERN.test(defaultUserId)) {
    invalid.push("DEFAULT_USER_ID must be a valid UUID.");
  }

  return {
    configured: missing.length === 0 && invalid.length === 0,
    missing,
    invalid,
  };
}

export function getSupabaseServerConfig() {
  const status = getPhase1ConfigStatus();

  if (!status.configured) {
    return { status, config: null };
  }

  return {
    status,
    config: {
      url: readEnv("NEXT_PUBLIC_SUPABASE_URL") as string,
      serviceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY") as string,
      defaultUserId: readEnv("DEFAULT_USER_ID") as string,
      defaultTimezone: readEnv("DEFAULT_TIMEZONE") ?? "America/Toronto",
    },
  };
}

export function getSupabaseBrowserConfig() {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}
