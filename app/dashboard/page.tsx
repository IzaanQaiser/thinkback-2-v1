const plannedMemoryFields = [
  "title",
  "summary",
  "type",
  "tags",
  "created date",
  "reminder status",
  "file preview",
];

const plannedCaptureSources = [
  "Telegram text",
  "Telegram screenshots",
  "Telegram links",
  "Telegram voice notes",
  "manual web capture",
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="border-b border-[#d7dbe0] pb-6">
        <h2 className="text-2xl font-semibold text-[#18191b]">Inbox</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4f5b67]">
          No memories have been saved in this environment.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[#d7dbe0] bg-white p-5">
          <p className="text-sm font-medium text-[#5d6b7a]">Saved memories</p>
          <p className="mt-3 text-3xl font-semibold text-[#18191b]">0</p>
          <p className="mt-2 text-sm text-[#5d6b7a]">
            Database not connected.
          </p>
        </div>
        <div className="rounded-lg border border-[#d7dbe0] bg-white p-5">
          <p className="text-sm font-medium text-[#5d6b7a]">Pending reminders</p>
          <p className="mt-3 text-3xl font-semibold text-[#18191b]">0</p>
          <p className="mt-2 text-sm text-[#5d6b7a]">
            No scheduled notifications.
          </p>
        </div>
        <div className="rounded-lg border border-[#d7dbe0] bg-white p-5">
          <p className="text-sm font-medium text-[#5d6b7a]">Failed processing</p>
          <p className="mt-3 text-3xl font-semibold text-[#18191b]">0</p>
          <p className="mt-2 text-sm text-[#5d6b7a]">
            No failed captures.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-base font-semibold text-[#18191b]">
            Memory card fields
          </h3>
          <ul className="mt-3 grid gap-2">
            {plannedMemoryFields.map((field) => (
              <li
                className="rounded-lg border border-[#d7dbe0] bg-white px-4 py-3 text-sm text-[#2c333a]"
                key={field}
              >
                {field}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#18191b]">
            Capture sources
          </h3>
          <ul className="mt-3 grid gap-2">
            {plannedCaptureSources.map((source) => (
              <li
                className="rounded-lg border border-[#d7dbe0] bg-white px-4 py-3 text-sm text-[#2c333a]"
                key={source}
              >
                {source}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
