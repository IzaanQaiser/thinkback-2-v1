"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { parseTagInput } from "@/lib/memories";

export function ManualMemoryForm() {
  const router = useRouter();
  const [rawText, setRawText] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raw_text: rawText,
          tags: parseTagInput(tags),
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Could not save memory.");
      }

      setRawText("");
      setTags("");
      setStatus("Saved.");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not save memory.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="rounded-lg border border-[#d7dbe0] bg-white p-5"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-1">
        <label
          className="text-sm font-medium text-[#2c333a]"
          htmlFor="manual-memory"
        >
          Manual capture
        </label>
        <textarea
          className="min-h-28 resize-none rounded-lg border border-[#c8ced6] px-3 py-3 text-sm text-[#18191b] outline-none transition placeholder:text-[#7a8794] focus:border-[#2663eb]"
          id="manual-memory"
          onChange={(event) => setRawText(event.target.value)}
          placeholder="Save a quick memory..."
          required
          value={rawText}
        />
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <label
          className="text-sm font-medium text-[#2c333a]"
          htmlFor="manual-memory-tags"
        >
          Tags
        </label>
        <input
          className="h-11 rounded-lg border border-[#c8ced6] px-3 text-sm text-[#18191b] outline-none transition placeholder:text-[#7a8794] focus:border-[#2663eb]"
          id="manual-memory-tags"
          onChange={(event) => setTags(event.target.value)}
          placeholder="career, school, idea"
          value={tags}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          className="rounded-lg bg-[#2663eb] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1746a2] disabled:cursor-not-allowed disabled:bg-[#9aa8bb]"
          disabled={isSubmitting || !rawText.trim()}
          type="submit"
        >
          {isSubmitting ? "Saving..." : "Save memory"}
        </button>
        {status ? <p className="text-sm text-[#13795b]">{status}</p> : null}
        {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
      </div>
    </form>
  );
}
