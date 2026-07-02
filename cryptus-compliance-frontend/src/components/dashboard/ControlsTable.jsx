import { useState } from "react";
import { ClipboardList, Search, ChevronDown, ExternalLink } from "lucide-react";

const STATUS_MAP = {
  completed: { label: "Completed", cls: "bg-green-50 text-green-700 border-green-200" },
  "in progress": { label: "In Progress", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  "not started": { label: "Not Started", cls: "bg-slate-50 text-slate-500 border-slate-200" },
  pending: { label: "Pending", cls: "bg-blue-50 text-blue-600 border-blue-200" },
};

function StatusBadge({ status }) {
  const key = status?.toLowerCase() ?? "";
  const cfg = STATUS_MAP[key] ?? {
    label: status ?? "Unknown",
    cls: "bg-slate-50 text-slate-500 border-slate-200",
  };
  return (
    <span className={`text-xs font-medium border px-2.5 py-1 rounded-full ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

export default function ControlsTable({ controls }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const rows = Array.isArray(controls) ? controls : controls?.data ?? [];

  const filtered = rows.filter((c) => {
    const name =
      c.controlName || c.control?.name || c.name || "";
    const status = c.status?.toLowerCase() ?? "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" || status === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-indigo-500" />
          <h2 className="text-base font-semibold text-slate-900">Assigned Controls</h2>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search controls..."
              className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white w-44"
            />
          </div>
          {/* Filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-600"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in progress">In Progress</option>
              <option value="not started">Not Started</option>
              <option value="pending">Pending</option>
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-14">
          <ClipboardList size={36} className="mx-auto text-slate-200 mb-2" />
          <p className="text-sm font-medium text-slate-500">No controls found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Control Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                  Notes
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                  Last Updated
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c, i) => {
                const name = c.controlName || c.control?.name || c.name || `Control ${i + 1}`;
                const notes = c.notes || c.description || "—";
                const updated = c.updatedAt
                  ? new Date(c.updatedAt).toLocaleDateString("en-IN")
                  : "—";
                return (
                  <tr
                    key={c.id ?? i}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800 max-w-[200px] truncate">
                      {name}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-4 text-slate-500 max-w-[180px] truncate hidden md:table-cell">
                      {notes}
                    </td>
                    <td className="px-4 py-4 text-slate-400 hidden lg:table-cell">{updated}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        View <ExternalLink size={11} />
                      </button>
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
