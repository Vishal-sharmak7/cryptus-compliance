import { CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";

function CircularProgress({ percent }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const stroke = circ - (percent / 100) * circ;
  const color =
    percent >= 80 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="-rotate-90" width="144" height="144">
        <circle cx="72" cy="72" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <circle
          cx="72" cy="72" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={stroke}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900">{percent}%</span>
        <span className="text-xs text-slate-400 font-medium">Score</span>
      </div>
    </div>
  );
}

export default function ComplianceScoreCard({ scoreData }) {
  const score = scoreData?.complianceScore ?? scoreData?.score ?? 0;
  const completed = scoreData?.completedControls ?? scoreData?.completed ?? 0;
  const pending = scoreData?.pendingControls ?? scoreData?.pending ?? 0;
  const total = scoreData?.totalControls ?? scoreData?.total ?? 0;

  const stats = [
    { label: "Completed", value: completed, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
    { label: "Pending", value: pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Total", value: total, icon: AlertCircle, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Compliance Score</h2>
          <p className="text-xs text-slate-400 mt-0.5">Overall audit readiness</p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
          <TrendingUp size={11} /> Live
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        <CircularProgress percent={Math.round(score)} />
        <div className="flex flex-col gap-3 flex-1 w-full">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon size={14} className={color} />
                </span>
                <span className="text-sm text-slate-600">{label} Controls</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
