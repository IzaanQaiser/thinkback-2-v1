import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteMemoryButton } from "@/app/dashboard/_components/delete-memory-button";
import { EditMemoryForm } from "@/app/dashboard/_components/edit-memory-form";
import { formatDateTime, formatJson } from "@/lib/format";
import { getMemory, type MemoryRow } from "@/lib/memory-store";

export const dynamic = "force-dynamic";

type MemoryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function TextBlock({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <section className="rounded-lg border border-[#d7dbe0] bg-white p-5">
      <h2 className="text-base font-semibold text-[#18191b]">{label}</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#4f5b67]">
        {value || "None"}
      </p>
    </section>
  );
}

function JsonBlock({ label, value }: { label: string; value: unknown }) {
  return (
    <section className="rounded-lg border border-[#d7dbe0] bg-white p-5">
      <h2 className="text-base font-semibold text-[#18191b]">{label}</h2>
      <pre className="mt-3 overflow-x-auto rounded-lg bg-[#f6f7f9] p-4 text-xs leading-5 text-[#2c333a]">
        {formatJson(value)}
      </pre>
    </section>
  );
}

function FieldGrid({ memory }: { memory: MemoryRow }) {
  const fields = [
    ["Type", memory.type],
    ["Status", memory.status],
    ["Priority", memory.priority],
    ["Source", memory.source],
    ["Created", formatDateTime(memory.created_at)],
    ["Updated", formatDateTime(memory.updated_at)],
    ["Reminder", formatDateTime(memory.reminder_at)],
    ["Event start", formatDateTime(memory.event_start)],
    ["Event end", formatDateTime(memory.event_end)],
    ["URL", memory.url || "None"],
    ["File URL", memory.file_url || "None"],
    ["File type", memory.file_type || "None"],
    ["File name", memory.file_name || "None"],
    [
      "File size",
      memory.file_size_bytes ? `${memory.file_size_bytes} bytes` : "None",
    ],
  ];

  return (
    <section className="rounded-lg border border-[#d7dbe0] bg-white p-5">
      <h2 className="text-base font-semibold text-[#18191b]">Fields</h2>
      <dl className="mt-4 grid gap-3 md:grid-cols-2">
        {fields.map(([label, value]) => (
          <div className="rounded-lg bg-[#f6f7f9] p-3" key={label}>
            <dt className="text-xs font-medium text-[#5d6b7a]">{label}</dt>
            <dd className="mt-1 break-words text-sm text-[#18191b]">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <section className="rounded-lg border border-[#d7dbe0] bg-white p-5">
      <h2 className="text-base font-semibold text-[#18191b]">Tags</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.length ? (
          tags.map((tag) => (
            <span
              className="rounded-lg border border-[#d7dbe0] px-2 py-1 text-xs text-[#4f5b67]"
              key={tag}
            >
              {tag}
            </span>
          ))
        ) : (
          <p className="text-sm text-[#5d6b7a]">None</p>
        )}
      </div>
    </section>
  );
}

function PeopleList({ people }: { people: string[] }) {
  return (
    <section className="rounded-lg border border-[#d7dbe0] bg-white p-5">
      <h2 className="text-base font-semibold text-[#18191b]">People</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {people.length ? (
          people.map((person) => (
            <span
              className="rounded-lg border border-[#d7dbe0] px-2 py-1 text-xs text-[#4f5b67]"
              key={person}
            >
              {person}
            </span>
          ))
        ) : (
          <p className="text-sm text-[#5d6b7a]">None</p>
        )}
      </div>
    </section>
  );
}

export default async function MemoryDetailPage({
  params,
}: MemoryDetailPageProps) {
  const { id } = await params;
  let memory: MemoryRow | null = null;
  let error: string | null = null;

  try {
    memory = await getMemory(id);
  } catch (caughtError) {
    error =
      caughtError instanceof Error ? caughtError.message : "Could not load memory.";
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link className="text-sm font-medium text-[#1746a2]" href="/dashboard">
          Back to inbox
        </Link>
        <section className="rounded-lg border border-[#e7b7b1] bg-[#fff8f7] p-5">
          <h2 className="text-base font-semibold text-[#b42318]">
            Could not load memory
          </h2>
          <p className="mt-2 text-sm text-[#7a2e25]">{error}</p>
        </section>
      </div>
    );
  }

  if (!memory) {
    notFound();
  }

  const title = memory.title || memory.summary || memory.raw_text || "Untitled";

  return (
    <div className="space-y-8">
      <section className="border-b border-[#d7dbe0] pb-6">
        <Link className="text-sm font-medium text-[#1746a2]" href="/dashboard">
          Back to inbox
        </Link>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#18191b]">{title}</h2>
            <p className="mt-2 text-sm text-[#5d6b7a]">
              Created {formatDateTime(memory.created_at)}
            </p>
          </div>
          <DeleteMemoryButton memoryId={memory.id} />
        </div>
      </section>

      <EditMemoryForm
        initialPriority={memory.priority}
        initialSummary={memory.summary || ""}
        initialTags={memory.tags}
        initialTitle={memory.title || ""}
        initialType={memory.type}
        memoryId={memory.id}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <FieldGrid memory={memory} />
        <TagList tags={memory.tags} />
        <PeopleList people={memory.people} />
        <TextBlock label="Summary" value={memory.summary} />
        <TextBlock label="Raw input" value={memory.raw_text} />
        <TextBlock label="Extracted text" value={memory.extracted_text} />
        <TextBlock label="Transcript" value={memory.transcript} />
        <JsonBlock label="Action items" value={memory.action_items} />
        <JsonBlock label="AI metadata" value={memory.ai_metadata} />
      </div>
    </div>
  );
}
