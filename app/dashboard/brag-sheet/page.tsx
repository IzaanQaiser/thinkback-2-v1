const achievementFields = [
  "what",
  "context",
  "impact",
  "skills",
  "resume bullet",
];

export default function BragSheetPage() {
  return (
    <div className="space-y-8">
      <section className="border-b border-[#d7dbe0] pb-6">
        <h2 className="text-2xl font-semibold text-[#18191b]">Brag Sheet</h2>
        <p className="mt-2 text-sm leading-6 text-[#4f5b67]">
          No achievement memories have been saved.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[#d7dbe0] bg-white p-5">
          <p className="text-sm font-medium text-[#5d6b7a]">Achievements</p>
          <p className="mt-3 text-3xl font-semibold text-[#18191b]">0</p>
        </div>
        <div className="rounded-lg border border-[#d7dbe0] bg-white p-5">
          <p className="text-sm font-medium text-[#5d6b7a]">Projects</p>
          <p className="mt-3 text-3xl font-semibold text-[#18191b]">0</p>
        </div>
        <div className="rounded-lg border border-[#d7dbe0] bg-white p-5">
          <p className="text-sm font-medium text-[#5d6b7a]">Skills</p>
          <p className="mt-3 text-3xl font-semibold text-[#18191b]">0</p>
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-[#18191b]">
          Achievement fields
        </h3>
        <div className="mt-3 grid gap-2 md:grid-cols-5">
          {achievementFields.map((field) => (
            <div
              className="rounded-lg border border-[#d7dbe0] bg-white px-4 py-3 text-sm text-[#2c333a]"
              key={field}
            >
              {field}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-dashed border-[#c8ced6] bg-white p-8 text-center">
        <h3 className="text-base font-semibold text-[#18191b]">
          Brag sheet is empty
        </h3>
        <p className="mt-2 text-sm text-[#5d6b7a]">
          Achievement entries will appear here.
        </p>
      </section>
    </div>
  );
}
