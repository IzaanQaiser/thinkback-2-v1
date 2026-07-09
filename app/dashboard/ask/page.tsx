const examples = [
  "What deadlines do I have?",
  "What app ideas did I save?",
  "What career wins do I have?",
];

export default function AskPage() {
  return (
    <div className="space-y-8">
      <section className="border-b border-[#d7dbe0] pb-6">
        <h2 className="text-2xl font-semibold text-[#18191b]">Ask</h2>
        <p className="mt-2 text-sm leading-6 text-[#4f5b67]">
          Answers will use saved memories as sources.
        </p>
      </section>

      <section className="rounded-lg border border-[#d7dbe0] bg-white p-5">
        <label className="text-sm font-medium text-[#2c333a]" htmlFor="ask">
          Question
        </label>
        <textarea
          className="mt-3 min-h-28 w-full resize-none rounded-lg border border-[#c8ced6] px-3 py-3 text-sm text-[#18191b] outline-none transition placeholder:text-[#7a8794] focus:border-[#2663eb]"
          disabled
          id="ask"
          placeholder="Ask Thinkback anything you saved."
        />
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {examples.map((example) => (
            <div
              className="rounded-lg border border-[#d7dbe0] bg-[#f6f7f9] px-3 py-3 text-sm text-[#4f5b67]"
              key={example}
            >
              {example}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-dashed border-[#c8ced6] bg-white p-8 text-center">
        <h3 className="text-base font-semibold text-[#18191b]">
          No answer yet
        </h3>
        <p className="mt-2 text-sm text-[#5d6b7a]">
          Source-backed answers will appear here.
        </p>
      </section>
    </div>
  );
}
