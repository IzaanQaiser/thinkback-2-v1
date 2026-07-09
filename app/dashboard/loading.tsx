export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-20 animate-pulse rounded-lg bg-[#e7ebf0]" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 animate-pulse rounded-lg bg-[#e7ebf0]" />
        <div className="h-32 animate-pulse rounded-lg bg-[#e7ebf0]" />
        <div className="h-32 animate-pulse rounded-lg bg-[#e7ebf0]" />
      </div>
      <div className="h-44 animate-pulse rounded-lg bg-[#e7ebf0]" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-44 animate-pulse rounded-lg bg-[#e7ebf0]" />
        <div className="h-44 animate-pulse rounded-lg bg-[#e7ebf0]" />
      </div>
    </div>
  );
}
