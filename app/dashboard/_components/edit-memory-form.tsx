"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import {
  MEMORY_PRIORITIES,
  MEMORY_TYPES,
  parseTagInput,
} from "@/lib/memories";
import type { MemoryPriority, MemoryType } from "@/lib/database.types";

type EditMemoryFormProps = {
  memoryId: string;
  initialTitle: string;
  initialSummary: string;
  initialType: MemoryType;
  initialTags: string[];
  initialPriority: MemoryPriority;
};

export function EditMemoryForm({
  memoryId,
  initialTitle,
  initialSummary,
  initialType,
  initialTags,
  initialPriority,
}: EditMemoryFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [summary, setSummary] = useState(initialSummary);
  const [type, setType] = useState<MemoryType>(initialType);
  const [tags, setTags] = useState(initialTags.join(", "));
  const [priority, setPriority] = useState<MemoryPriority>(initialPriority);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/memories/${memoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          summary,
          type,
          tags: parseTagInput(tags),
          priority,
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Could not update memory.");
      }

      setStatus("Saved.");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not update memory.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="rounded-lg border border-[#d7dbe0] bg-white p-5"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg font-semibold text-[#18191b]">Edit memory</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#2c333a]" htmlFor="title">
            Title
          </label>
          <input
            className="h-11 rounded-lg border border-[#c8ced6] px-3 text-sm text-[#18191b] outline-none transition focus:border-[#2663eb]"
            id="title"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#2c333a]" htmlFor="type">
            Type
          </label>
          <select
            className="h-11 rounded-lg border border-[#c8ced6] bg-white px-3 text-sm text-[#18191b] outline-none transition focus:border-[#2663eb]"
            id="type"
            onChange={(event) => setType(event.target.value as MemoryType)}
            value={type}
          >
            {MEMORY_TYPES.map((memoryType) => (
              <option key={memoryType} value={memoryType}>
                {memoryType}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <label className="text-sm font-medium text-[#2c333a]" htmlFor="summary">
          Summary
        </label>
        <textarea
          className="min-h-24 resize-none rounded-lg border border-[#c8ced6] px-3 py-3 text-sm text-[#18191b] outline-none transition focus:border-[#2663eb]"
          id="summary"
          onChange={(event) => setSummary(event.target.value)}
          value={summary}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#2c333a]" htmlFor="tags">
            Tags
          </label>
          <input
            className="h-11 rounded-lg border border-[#c8ced6] px-3 text-sm text-[#18191b] outline-none transition focus:border-[#2663eb]"
            id="tags"
            onChange={(event) => setTags(event.target.value)}
            value={tags}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium text-[#2c333a]"
            htmlFor="priority"
          >
            Priority
          </label>
          <select
            className="h-11 rounded-lg border border-[#c8ced6] bg-white px-3 text-sm text-[#18191b] outline-none transition focus:border-[#2663eb]"
            id="priority"
            onChange={(event) =>
              setPriority(event.target.value as MemoryPriority)
            }
            value={priority}
          >
            {MEMORY_PRIORITIES.map((memoryPriority) => (
              <option key={memoryPriority} value={memoryPriority}>
                {memoryPriority}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          className="rounded-lg bg-[#2663eb] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1746a2] disabled:cursor-not-allowed disabled:bg-[#9aa8bb]"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
        {status ? <p className="text-sm text-[#13795b]">{status}</p> : null}
        {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
      </div>
    </form>
  );
}
