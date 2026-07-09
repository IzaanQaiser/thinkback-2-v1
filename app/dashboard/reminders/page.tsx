const reminderGroups = [
  { label: "Upcoming", count: 0 },
  { label: "Overdue", count: 0 },
  { label: "Completed", count: 0 },
];

export default function RemindersPage() {
  return (
    <div className="space-y-8">
      <section className="border-b border-[#d7dbe0] pb-6">
        <h2 className="text-2xl font-semibold text-[#18191b]">Reminders</h2>
        <p className="mt-2 text-sm leading-6 text-[#4f5b67]">
          No reminders have been scheduled.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {reminderGroups.map((group) => (
          <div
            className="rounded-lg border border-[#d7dbe0] bg-white p-5"
            key={group.label}
          >
            <p className="text-sm font-medium text-[#5d6b7a]">{group.label}</p>
            <p className="mt-3 text-3xl font-semibold text-[#18191b]">
              {group.count}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-dashed border-[#c8ced6] bg-white p-8 text-center">
        <h3 className="text-base font-semibold text-[#18191b]">
          Reminder queue is empty
        </h3>
        <p className="mt-2 text-sm text-[#5d6b7a]">
          Due reminders will be listed here.
        </p>
      </section>
    </div>
  );
}
