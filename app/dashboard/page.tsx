import Link from "next/link";
import { ManualMemoryForm } from "@/app/dashboard/_components/manual-memory-form";
import { formatDateTime } from "@/lib/format";
import { listMemories, type MemoryRow } from "@/lib/memory-store";

export const dynamic = "force-dynamic";

function countPendingReminders(memories: MemoryRow[]) {
  return memories.filter((memory) => memory.reminder_at).length;
}

function countFailedMemories(memories: MemoryRow[]) {
  return memories.filter((memory) => memory.status === "failed").length;
}

function MemoryCard({ memory }: { memory: MemoryRow }) {
  const title = memory.title || memory.summary || memory.raw_text || "Untitled";
  const summary = memory.summary || memory.raw_text || "No summary yet.";
  const hasFile = Boolean(memory.file_url || memory.file_name || memory.file_type);

  return (
    <Link
      className="block rounded-lg border border-[#d7dbe0] bg-white p-5 transition hover:border-[#2663eb] hover:shadow-sm"
      href={`/dashboard/memory/${memory.id}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-lg bg-[#eaf1ff] px-2 py-1 text-xs font-medium text-[#1746a2]">
          {memory.type}
        </span>
        <span className="rounded-lg bg-[#eef1f4] px-2 py-1 text-xs font-medium text-[#4f5b67]">
          {memory.priority}
        </span>
        {memory.reminder_at ? (
          <span className="rounded-lg bg-[#fff5d7] px-2 py-1 text-xs font-medium text-[#8a6100]">
            reminder
          </span>
        ) : null}
        {hasFile ? (
          <span className="rounded-lg bg-[#e7f7ef] px-2 py-1 text-xs font-medium text-[#13795b]">
            file
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-[#18191b]">{title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#4f5b67]">
        {summary}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {memory.tags.length ? (
          memory.tags.map((tag) => (
            <span
              className="rounded-lg border border-[#d7dbe0] px-2 py-1 text-xs text-[#4f5b67]"
              key={tag}
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-[#7a8794]">No tags</span>
        )}
      </div>

      <p className="mt-4 text-xs text-[#7a8794]">
        Created {formatDateTime(memory.created_at)}
      </p>
    </Link>
  );
}

export default async function DashboardPage() {
  let memories: MemoryRow[] = [];
  let error: string | null = null;

  try {
    memories = await listMemories(50);
  } catch (caughtError) {
    error =
      caughtError instanceof Error
        ? caughtError.message
        : "Could not load memories.";
  }

  return (
    <div className="space-y-8">
      <section className="border-b border-[#d7dbe0] pb-6">
        <h2 className="text-2xl font-semibold text-[#18191b]">Inbox</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4f5b67]">
          {error
            ? "Database-backed memories could not be loaded."
            : `${memories.length} saved ${
                memories.length === 1 ? "memory" : "memories"
              }.`}
        </p>
      </section>

      {error ? (
        <section className="rounded-lg border border-[#e7b7b1] bg-[#fff8f7] p-5">
          <h3 className="text-base font-semibold text-[#b42318]">
            Could not load inbox
          </h3>
          <p className="mt-2 text-sm text-[#7a2e25]">{error}</p>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[#d7dbe0] bg-white p-5">
          <p className="text-sm font-medium text-[#5d6b7a]">Saved memories</p>
          <p className="mt-3 text-3xl font-semibold text-[#18191b]">
            {memories.length}
          </p>
        </div>
        <div className="rounded-lg border border-[#d7dbe0] bg-white p-5">
          <p className="text-sm font-medium text-[#5d6b7a]">Pending reminders</p>
          <p className="mt-3 text-3xl font-semibold text-[#18191b]">
            {countPendingReminders(memories)}
          </p>
        </div>
        <div className="rounded-lg border border-[#d7dbe0] bg-white p-5">
          <p className="text-sm font-medium text-[#5d6b7a]">Failed processing</p>
          <p className="mt-3 text-3xl font-semibold text-[#18191b]">
            {countFailedMemories(memories)}
          </p>
        </div>
      </section>

      <ManualMemoryForm />

      <section>
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-[#18191b]">
            Latest memories
          </h3>
          <p className="text-sm text-[#5d6b7a]">Newest first</p>
        </div>

        {memories.length ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {memories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-[#c8ced6] bg-white p-8 text-center">
            <h4 className="text-base font-semibold text-[#18191b]">
              Inbox is empty
            </h4>
            <p className="mt-2 text-sm text-[#5d6b7a]">
              Save a manual memory above to test the database-backed flow.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
