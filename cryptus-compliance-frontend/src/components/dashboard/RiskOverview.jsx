import { ShieldAlert } from "lucide-react";

const RISKS = [
  { label: "Open Risks", value: 12, color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200" },
  { label: "Critical", value: 2, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
  { label: "High", value: 3, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
  { label: "Medium", value: 4, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  { label: "Low", value: 3, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
];

export default function RiskOverview() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <ShieldAlert size={18} className="text-rose-500" />
        <h2 className="text-base font-semibold text-slate-900">Risk Overview</h2>
        <span className="text-xs text-slate-400 ml-auto">Placeholder</span>
      </div>
      <div className="space-y-2.5">
        {RISKS.map(({ label, value, color, bg, border }) => (
          <div
            key={label}
            className={`flex items-center justify-between px-4 py-2.5 border ${border} ${bg} rounded-xl`}
          >
            <span className={`text-sm font-medium ${color}`}>{label}</span>
            <span className={`text-lg font-bold ${color}`}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
