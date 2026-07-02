import { Upload, RefreshCw, Layers, ClipboardList, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActions({ onUploadClick }) {
  const navigate = useNavigate();

  const ACTIONS = [
    {
      icon: Upload,
      label: "Upload Evidence",
      desc: "Submit proof for controls",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      hover: "hover:border-indigo-300 hover:bg-indigo-50",
      action: onUploadClick,
    },
    {
      icon: RefreshCw,
      label: "Update Control Status",
      desc: "Mark controls progress",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      hover: "hover:border-amber-300 hover:bg-amber-50",
      action: () => navigate("/app/controls"),
    },
    {
      icon: Layers,
      label: "View Frameworks",
      desc: "Browse assigned frameworks",
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
      hover: "hover:border-violet-300 hover:bg-violet-50",
      action: () => navigate("/app/frameworks"),
    },
    {
      icon: ClipboardList,
      label: "View All Controls",
      desc: "Full controls overview",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      hover: "hover:border-green-300 hover:bg-green-50",
      action: () => navigate("/app/controls"),
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ACTIONS.map(({ icon: Icon, label, desc, color, bg, border, hover, action }) => (
          <button
            key={label}
            onClick={action}
            className={`flex items-center gap-3 p-4 border ${border} ${hover} rounded-xl transition-all duration-150 text-left group`}
          >
            <span className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={16} className={color} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </div>
            <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
