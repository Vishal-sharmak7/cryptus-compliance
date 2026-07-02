import { useState } from "react";
import {
  FileText, File, Image, Search, ExternalLink,
  CheckCircle, XCircle, Clock, Upload, CloudUpload,
} from "lucide-react";

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getFileIcon(fileName) {
  const ext = fileName?.split(".").pop()?.toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext))
    return <Image size={16} className="text-indigo-400" />;
  if (["pdf"].includes(ext))
    return <FileText size={16} className="text-red-400" />;
  return <File size={16} className="text-slate-400" />;
}

const STATUS_CONFIG = {
  approved:  { label: "Approved",  cls: "bg-green-50 text-green-700 border-green-200",  icon: CheckCircle },
  rejected:  { label: "Rejected",  cls: "bg-red-50 text-red-600 border-red-200",        icon: XCircle     },
  pending:   { label: "Pending",   cls: "bg-amber-50 text-amber-700 border-amber-200",  icon: Clock       },
  uploaded:  { label: "Uploaded",  cls: "bg-indigo-50 text-indigo-600 border-indigo-200", icon: Upload    },
};

function StatusBadge({ status }) {
  const key = status?.toLowerCase() ?? "uploaded";
  const cfg = STATUS_CONFIG[key] ?? STATUS_CONFIG.uploaded;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium border px-2 py-0.5 rounded-full ${cfg.cls}`}>
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

export default function EvidenceList({ evidence, onUploadClick }) {
  const [search, setSearch] = useState("");
  const items = Array.isArray(evidence) ? evidence : evidence?.data ?? [];

  const filtered = items.filter((e) => {
    const name = e.file_name || e.fileName || e.name || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-indigo-500" />
          <h2 className="text-base font-semibold text-slate-900">Evidence Files</h2>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files…"
              className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white w-40"
            />
          </div>
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-sm"
          >
            <CloudUpload size={14} />
            Upload
          </button>
        </div>
      </div>

      {/* Table or Empty */}
      {filtered.length === 0 ? (
        <div className="text-center py-14">
          <CloudUpload size={40} className="mx-auto text-slate-200 mb-3" />
          <p className="text-sm font-medium text-slate-500">No evidence files yet</p>
          <p className="text-xs text-slate-400 mt-1">Upload your first evidence file to get started.</p>
          <button
            onClick={onUploadClick}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
          >
            <Upload size={13} /> Upload Evidence
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">File</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Control</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Uploaded</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((e, i) => {
                const fileName  = e.file_name  || e.fileName  || e.name     || `Evidence ${i + 1}`;
                const filePath  = e.file_path  || e.filePath  || e.path     || null;
                const controlId = e.company_control_id || e.companyControlId || e.control_id || "—";
                const createdAt = e.createdAt  || e.created_at || null;

                return (
                  <tr key={e.id ?? i} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          {getFileIcon(fileName)}
                        </span>
                        <span className="text-sm font-medium text-slate-800 truncate max-w-[160px]">
                          {fileName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs hidden sm:table-cell">
                      Control #{controlId}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-400 hidden md:table-cell">
                      {createdAt ? timeAgo(createdAt) : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {filePath ? (
                        <a
                          href={`http://localhost:5000/${filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
