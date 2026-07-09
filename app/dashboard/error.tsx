"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="rounded-lg border border-[#e7b7b1] bg-[#fff8f7] p-5">
      <h2 className="text-base font-semibold text-[#b42318]">
        Dashboard error
      </h2>
      <p className="mt-2 text-sm text-[#7a2e25]">{error.message}</p>
      <button
        className="mt-4 rounded-lg bg-[#2663eb] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1746a2]"
        onClick={reset}
        type="button"
      >
        Retry
      </button>
    </section>
  );
}
