export default function DashboardSkeleton() {
  const Shimmer = ({ className }) => (
    <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
  );

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Shimmer className="h-24 w-full" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Shimmer key={i} className="h-28" />)}
      </div>

      {/* Score + Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Shimmer className="h-64" />
        <Shimmer className="h-64" />
      </div>

      {/* Controls Table */}
      <Shimmer className="h-80" />

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Shimmer className="h-56" />
        <Shimmer className="h-56" />
        <Shimmer className="h-56" />
      </div>
    </div>
  );
}
