import { Award } from "lucide-react";

function ProgressBar({ percent, color }) {
  return (
    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function getBarColor(pct) {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 50) return "bg-amber-400";
  return "bg-red-400";
}

function getBadge(pct) {
  if (pct >= 80) return { label: "On Track", cls: "bg-green-50 text-green-600 border-green-100" };
  if (pct >= 50) return { label: "In Progress", cls: "bg-amber-50 text-amber-600 border-amber-100" };
  return { label: "At Risk", cls: "bg-red-50 text-red-500 border-red-100" };
}

export default function FrameworkProgress({ frameworks }) {
  const items = Array.isArray(frameworks) ? frameworks : frameworks?.data ?? [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Award size={18} className="text-indigo-500" />
        <h2 className="text-base font-semibold text-slate-900">Framework Progress</h2>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <Award size={36} className="mx-auto text-slate-200 mb-2" />
          <p className="text-sm text-slate-400">No frameworks assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((fw, i) => {
            const name =
              fw.frameworkName || fw.framework?.name || fw.name || `Framework ${i + 1}`;
            const pct = Math.round(fw.progressPercentage ?? fw.progress ?? 0);
            const controls = fw.totalControls ?? fw.controls_count ?? "—";
            const badge = getBadge(pct);
            return (
              <div key={fw.id ?? i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium text-slate-800 truncate">
                      {name}
                    </span>
                    <span
                      className={`text-xs font-medium border px-2 py-0.5 rounded-full ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-400">{controls} controls</span>
                    <span className="text-sm font-semibold text-slate-900 w-9 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
                <ProgressBar percent={pct} color={getBarColor(pct)} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
