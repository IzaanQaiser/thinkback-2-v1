const filters = ["type", "tag", "date", "has reminder", "has file", "priority"];

export default function SearchPage() {
  return (
    <div className="space-y-8">
      <section className="border-b border-[#d7dbe0] pb-6">
        <h2 className="text-2xl font-semibold text-[#18191b]">Search</h2>
        <p className="mt-2 text-sm leading-6 text-[#4f5b67]">
          Search is waiting for saved memories.
        </p>
      </section>

      <section className="rounded-lg border border-[#d7dbe0] bg-white p-5">
        <label
          className="text-sm font-medium text-[#2c333a]"
          htmlFor="memory-search"
        >
          Search memories
        </label>
        <input
          className="mt-3 h-11 w-full rounded-lg border border-[#c8ced6] px-3 text-sm text-[#18191b] outline-none transition placeholder:text-[#7a8794] focus:border-[#2663eb]"
          disabled
          id="memory-search"
          placeholder="Search anything you saved..."
          type="search"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <span
              className="rounded-lg border border-[#d7dbe0] bg-[#f6f7f9] px-3 py-2 text-sm text-[#4f5b67]"
              key={filter}
            >
              {filter}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-dashed border-[#c8ced6] bg-white p-8 text-center">
        <h3 className="text-base font-semibold text-[#18191b]">
          No search results
        </h3>
        <p className="mt-2 text-sm text-[#5d6b7a]">
          Results will appear here after memories are saved.
        </p>
      </section>
    </div>
  );
}
