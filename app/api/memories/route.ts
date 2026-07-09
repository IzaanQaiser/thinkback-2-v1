import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerConfig } from "@/lib/env";
import type { Database } from "@/lib/database.types";
import {
  createFallbackSummary,
  createFallbackTitle,
  isMemoryPriority,
  isMemoryType,
  normalizeStringArray,
} from "@/lib/memories";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type MemoryInsert = Database["public"]["Tables"]["memories"]["Insert"];

function configErrorResponse() {
  const { status } = getSupabaseServerConfig();

  return NextResponse.json(
    {
      error: "Supabase is not configured for Phase 1.",
      missing: status.missing,
      invalid: status.invalid,
    },
    { status: 503 },
  );
}

function getTextField(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

async function parseJsonBody(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return null;
    }

    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { config } = getSupabaseServerConfig();

  if (!config) {
    return configErrorResponse();
  }

  const limitParam = request.nextUrl.searchParams.get("limit");
  const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : 50;
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), 100)
    : 50;

  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("user_id", config.defaultUserId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ memories: data });
}

export async function POST(request: NextRequest) {
  const { config } = getSupabaseServerConfig();

  if (!config) {
    return configErrorResponse();
  }

  const body = await parseJsonBody(request);

  if (!body) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  const rawText = getTextField(body, "raw_text") ?? getTextField(body, "rawText");

  if (!rawText) {
    return NextResponse.json(
      { error: "raw_text is required and must be a non-empty string." },
      { status: 400 },
    );
  }

  const requestedType = body.type;
  const requestedPriority = body.priority;
  const title = getTextField(body, "title") ?? createFallbackTitle(rawText);
  const summary = getTextField(body, "summary") ?? createFallbackSummary(rawText);
  const tags = normalizeStringArray(body.tags);
  const searchKeywords = normalizeStringArray(body.search_keywords);

  const insert: MemoryInsert = {
    user_id: config.defaultUserId,
    source: "manual",
    type: isMemoryType(requestedType) ? requestedType : "note",
    status: "processed",
    raw_text: rawText,
    title,
    summary,
    tags,
    search_keywords: searchKeywords,
    priority: isMemoryPriority(requestedPriority) ? requestedPriority : "medium",
    ai_metadata: {
      phase: "phase-1-manual-capture",
      note: "Saved without AI processing.",
    },
  };

  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("memories")
    .insert(insert)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ memory: data }, { status: 201 });
}
