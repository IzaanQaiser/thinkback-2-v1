import type {
  Database,
  MemoryPriority,
  MemoryType,
} from "@/lib/database.types";
import { getSupabaseServerConfig } from "@/lib/env";
import {
  createFallbackSummary,
  createFallbackTitle,
  isMemoryPriority,
  isMemoryType,
  normalizeStringArray,
} from "@/lib/memories";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/server";

export type MemoryRow = Database["public"]["Tables"]["memories"]["Row"];
type MemoryInsert = Database["public"]["Tables"]["memories"]["Insert"];
type MemoryUpdate = Database["public"]["Tables"]["memories"]["Update"];

export type CreateManualMemoryInput = {
  rawText: string;
  type?: unknown;
  title?: string | null;
  summary?: string | null;
  tags?: unknown;
  searchKeywords?: unknown;
  priority?: unknown;
};

export type UpdateMemoryInput = {
  title?: string | null;
  summary?: string | null;
  type?: MemoryType;
  tags?: string[];
  priority?: MemoryPriority;
};

export class MemoryStoreError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "MemoryStoreError";
    this.status = status;
  }
}

function getConfigOrThrow() {
  const { config, status } = getSupabaseServerConfig();

  if (!config) {
    const missing = status.missing.length
      ? ` Missing: ${status.missing.join(", ")}.`
      : "";
    const invalid = status.invalid.length
      ? ` Invalid: ${status.invalid.join(", ")}.`
      : "";

    throw new MemoryStoreError(
      `Supabase is not configured for Phase 1.${missing}${invalid}`,
      503,
    );
  }

  return config;
}

function cleanOptionalText(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function listMemories(limit = 50) {
  const config = getConfigOrThrow();
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("user_id", config.defaultUserId)
    .order("created_at", { ascending: false })
    .limit(safeLimit);

  if (error) {
    throw new MemoryStoreError(error.message);
  }

  return data;
}

export async function getMemory(id: string) {
  const config = getConfigOrThrow();
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("id", id)
    .eq("user_id", config.defaultUserId)
    .maybeSingle();

  if (error) {
    throw new MemoryStoreError(error.message);
  }

  return data;
}

export async function createManualMemory(input: CreateManualMemoryInput) {
  const config = getConfigOrThrow();
  const rawText = input.rawText.trim();

  if (!rawText) {
    throw new MemoryStoreError(
      "raw_text is required and must be a non-empty string.",
      400,
    );
  }

  const insert: MemoryInsert = {
    user_id: config.defaultUserId,
    source: "manual",
    type: isMemoryType(input.type) ? input.type : "note",
    status: "processed",
    raw_text: rawText,
    title: cleanOptionalText(input.title) ?? createFallbackTitle(rawText),
    summary: cleanOptionalText(input.summary) ?? createFallbackSummary(rawText),
    tags: normalizeStringArray(input.tags),
    search_keywords: normalizeStringArray(input.searchKeywords),
    priority: isMemoryPriority(input.priority) ? input.priority : "medium",
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
    throw new MemoryStoreError(error.message);
  }

  return data;
}

export async function updateMemory(id: string, input: UpdateMemoryInput) {
  const config = getConfigOrThrow();
  const update: MemoryUpdate = {};

  if ("title" in input) {
    update.title = cleanOptionalText(input.title);
  }

  if ("summary" in input) {
    update.summary = cleanOptionalText(input.summary);
  }

  if (input.type) {
    update.type = input.type;
  }

  if (input.tags) {
    update.tags = input.tags;
  }

  if (input.priority) {
    update.priority = input.priority;
  }

  if (Object.keys(update).length === 0) {
    throw new MemoryStoreError("No supported fields were provided.", 400);
  }

  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from("memories")
    .update(update)
    .eq("id", id)
    .eq("user_id", config.defaultUserId)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new MemoryStoreError(error.message);
  }

  return data;
}

export async function deleteMemory(id: string) {
  const config = getConfigOrThrow();
  const supabase = createServiceRoleSupabaseClient();
  const { error, count } = await supabase
    .from("memories")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", config.defaultUserId);

  if (error) {
    throw new MemoryStoreError(error.message);
  }

  return count ?? 0;
}
