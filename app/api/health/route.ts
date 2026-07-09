import { NextResponse } from "next/server";
import { getSupabaseServerConfig } from "@/lib/env";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { config, status } = getSupabaseServerConfig();

  if (!config) {
    return NextResponse.json(
      {
        ok: false,
        service: "thinkback",
        checks: {
          app: "ok",
          database: {
            status: "not_configured",
            missing: status.missing,
            invalid: status.invalid,
          },
        },
      },
      { status: 503 },
    );
  }

  const supabase = createServiceRoleSupabaseClient();
  const { error } = await supabase
    .from("memories")
    .select("id")
    .eq("user_id", config.defaultUserId)
    .limit(1);

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "thinkback",
        checks: {
          app: "ok",
          database: {
            status: "error",
            message: error.message,
          },
        },
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    service: "thinkback",
    checks: {
      app: "ok",
      database: {
        status: "ok",
      },
    },
  });
}
