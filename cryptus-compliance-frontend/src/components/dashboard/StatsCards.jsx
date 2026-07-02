import { Layers, ClipboardList, CheckSquare, FileText } from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, color, bg, border }) {
  return (
    <div className={`bg-white border ${border} rounded-2xl p-5 shadow-sm flex items-start gap-4`}>
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon size={20} className={color} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-900">{value ?? "—"}</p>
        <p className="text-sm font-medium text-slate-600 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function StatsCards({ frameworks, controls, evidence }) {
  const frameworkCount = Array.isArray(frameworks)
    ? frameworks.length
    : frameworks?.data?.length ?? 0;

  const controlsArr = Array.isArray(controls) ? controls : controls?.data ?? [];
  const totalControls = controlsArr.length;
  const completedControls = controlsArr.filter(
    (c) => c.status?.toLowerCase() === "completed"
  ).length;

  const evidenceArr = Array.isArray(evidence) ? evidence : evidence?.data ?? [];
  const evidenceCount = evidenceArr.length;

  const cards = [
    {
      icon: Layers,
      label: "Frameworks Assigned",
      value: frameworkCount,
      sub: "Active compliance frameworks",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
    {
      icon: ClipboardList,
      label: "Total Controls",
      value: totalControls,
      sub: "Across all frameworks",
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
    {
      icon: CheckSquare,
      label: "Completed Controls",
      value: completedControls,
      sub: `${totalControls ? Math.round((completedControls / totalControls) * 100) : 0}% completion rate`,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      icon: FileText,
      label: "Evidence Uploaded",
      value: evidenceCount,
      sub: "Total evidence files",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <StatCard key={c.label} {...c} />
      ))}
    </div>
  );
}
