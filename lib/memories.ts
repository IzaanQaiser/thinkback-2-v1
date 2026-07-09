import type { MemoryPriority, MemoryType } from "@/lib/database.types";

export const MEMORY_TYPES = [
  "note",
  "idea",
  "task",
  "reminder",
  "event",
  "link",
  "image",
  "video",
  "audio",
  "file",
  "job",
  "person",
  "research",
  "achievement",
] as const satisfies readonly MemoryType[];

export const MEMORY_PRIORITIES = [
  "low",
  "medium",
  "high",
] as const satisfies readonly MemoryPriority[];

export function isMemoryType(value: unknown): value is MemoryType {
  return (
    typeof value === "string" &&
    MEMORY_TYPES.includes(value as (typeof MEMORY_TYPES)[number])
  );
}

export function isMemoryPriority(value: unknown): value is MemoryPriority {
  return (
    typeof value === "string" &&
    MEMORY_PRIORITIES.includes(value as (typeof MEMORY_PRIORITIES)[number])
  );
}

export function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

export function createFallbackTitle(rawText: string) {
  const firstLine = rawText.split(/\r?\n/).find((line) => line.trim());
  const title = firstLine?.trim() || "Untitled memory";
  return title.length > 80 ? `${title.slice(0, 77)}...` : title;
}

export function createFallbackSummary(rawText: string) {
  const compact = rawText.replace(/\s+/g, " ").trim();
  return compact.length > 240 ? `${compact.slice(0, 237)}...` : compact;
}
