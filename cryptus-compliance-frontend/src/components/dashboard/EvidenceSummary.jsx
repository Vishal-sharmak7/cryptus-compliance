import { FileText, Upload, CheckCircle, XCircle, Clock, CloudUpload } from "lucide-react";

export default function EvidenceSummary({ evidence, onUploadClick }) {
  const items = Array.isArray(evidence) ? evidence : evidence?.data ?? [];

  const uploaded = items.length;
  const approved = items.filter((e) => e.status?.toLowerCase() === "approved").length;
  const rejected = items.filter((e) => e.status?.toLowerCase() === "rejected").length;
  const pending  = items.filter(
    (e) => !["approved", "rejected"].includes(e.status?.toLowerCase())
  ).length;

  const cards = [
    { label: "Total Uploaded", value: uploaded, icon: Upload,      color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { label: "Pending Review", value: pending,  icon: Clock,       color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100"  },
    { label: "Approved",       value: approved, icon: CheckCircle, color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100"  },
    { label: "Rejected",       value: rejected, icon: XCircle,     color: "text-red-500",    bg: "bg-red-50",    border: "border-red-100"    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-indigo-500" />
          <h2 className="text-base font-semibold text-slate-900">Evidence Summary</h2>
        </div>
        {onUploadClick && (
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition"
          >
            <CloudUpload size={12} /> Upload
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {cards.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div
            key={label}
            className={`border ${border} rounded-xl p-4 flex flex-col gap-2`}
          >
            <span className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon size={15} className={color} />
            </span>
            <p className="text-xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
