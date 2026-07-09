export default function MemoryDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-24 animate-pulse rounded-lg bg-[#e7ebf0]" />
      <div className="h-72 animate-pulse rounded-lg bg-[#e7ebf0]" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-56 animate-pulse rounded-lg bg-[#e7ebf0]" />
        <div className="h-56 animate-pulse rounded-lg bg-[#e7ebf0]" />
        <div className="h-56 animate-pulse rounded-lg bg-[#e7ebf0]" />
        <div className="h-56 animate-pulse rounded-lg bg-[#e7ebf0]" />
      </div>
    </div>
  );
}
