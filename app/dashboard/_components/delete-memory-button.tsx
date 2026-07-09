"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteMemoryButtonProps = {
  memoryId: string;
};

export function DeleteMemoryButton({ memoryId }: DeleteMemoryButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this memory?");

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/memories/${memoryId}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Could not delete memory.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not delete memory.",
      );
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        className="rounded-lg border border-[#d92d20] px-4 py-2 text-sm font-medium text-[#b42318] transition hover:bg-[#fff0ee] disabled:cursor-not-allowed disabled:border-[#e7b7b1] disabled:text-[#b98b86]"
        disabled={isDeleting}
        onClick={handleDelete}
        type="button"
      >
        {isDeleting ? "Deleting..." : "Delete memory"}
      </button>
      {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
    </div>
  );
}
