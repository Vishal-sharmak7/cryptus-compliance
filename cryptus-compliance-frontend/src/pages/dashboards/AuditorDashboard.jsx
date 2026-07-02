import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { dashboardService } from "../../services/dashboard.service";
import {
  Building2, ShieldCheck, ListChecks, FileText, ChevronRight,
  ChevronDown, AlertCircle, CheckCircle2, Clock, PlayCircle,
  BarChart3, Package, FileSearch, Layers,
} from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────────────
const statusColor = {
  PLANNED:     "bg-amber-50 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED:   "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const controlStatusColor = {
  NOT_STARTED: "bg-slate-100 text-slate-500",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED:   "bg-emerald-100 text-emerald-700",
};

function ProgressBar({ value, max, color = "bg-indigo-500" }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = "text-indigo-600", bg = "bg-indigo-50" }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center ${color} flex-shrink-0`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value ?? "—"}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ── Framework accordion ───────────────────────────────────────────────────────
function FrameworkCard({ fw }) {
  const [open, setOpen] = useState(false);
  const pct = fw.total_controls
    ? Math.round((fw.completed_controls / fw.total_controls) * 100)
    : 0;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-4 bg-white hover:bg-slate-50 transition text-left"
      >
        <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 flex-shrink-0">
          <Layers size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 truncate">{fw.framework_name}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-slate-500">{fw.total_controls} controls</span>
            <div className="flex-1 max-w-[180px]">
              <ProgressBar value={fw.completed_controls} max={fw.total_controls} color="bg-emerald-500" />
            </div>
            <span className="text-xs font-semibold text-emerald-600">{pct}%</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:flex gap-1.5">
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ✓ {fw.completed_controls}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ↻ {fw.in_progress_controls}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
              ○ {fw.total_controls - fw.completed_controls - fw.in_progress_controls}
            </span>
          </div>
          <ChevronDown
            size={18}
            className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Controls list */}
      {open && (
        <div className="border-t border-slate-100 bg-slate-50/60 divide-y divide-slate-100">
          {fw.controls.length === 0 ? (
            <p className="px-6 py-4 text-sm text-slate-400 italic">No controls assigned to this framework.</p>
          ) : (
            fw.controls.map((ctrl) => (
              <div
                key={ctrl.company_control_id}
                className="flex items-start gap-3 px-5 py-3 hover:bg-white/80 transition"
              >
                <div className="mt-0.5">
                  {ctrl.status === "COMPLETED" ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : ctrl.status === "IN_PROGRESS" ? (
                    <PlayCircle size={16} className="text-blue-500" />
                  ) : (
                    <Clock size={16} className="text-slate-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{ctrl.control_title}</p>
                  {ctrl.control_description && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{ctrl.control_description}</p>
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${controlStatusColor[ctrl.status] || controlStatusColor.NOT_STARTED}`}>
                  {(ctrl.status || "NOT_STARTED").replace("_", " ")}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AuditorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCompany, setActiveCompany] = useState(null); // which company tab is selected

  const { data: raw, isLoading, isError } = useQuery({
    queryKey: ["dashboard", "auditor"],
    queryFn: () => dashboardService.getAuditorDashboard().then((r) => r.data?.data ?? r.data),
  });

  const summary   = raw?.summary   || {};
  const companies = raw?.companies || [];
  const audits    = raw?.audits    || [];

  // Default to first company
  const selected = companies.find(c => c.id === activeCompany) || companies[0];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3 text-slate-400">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Loading your dashboard…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3 text-red-400">
        <AlertCircle size={40} />
        <p className="text-sm">Failed to load dashboard. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Welcome header ──────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(" ")[0] || "Auditor"} 👋
        </h1>
        <p className="text-slate-500 mt-0.5">
          Here's your assigned company portfolio and compliance overview.
        </p>
      </div>

      {/* ── Summary stats ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2}   label="Assigned Companies" value={summary.totalCompanies} color="text-indigo-600"  bg="bg-indigo-50" />
        <StatCard icon={FileSearch}  label="Assigned Audits"    value={summary.totalAudits}    color="text-violet-600"  bg="bg-violet-50" />
        <StatCard icon={Layers}      label="Total Frameworks"   value={summary.totalFrameworks} color="text-blue-600"   bg="bg-blue-50" />
        <StatCard icon={ListChecks}  label="Total Controls"     value={summary.totalControls}   color="text-emerald-600" bg="bg-emerald-50" />
      </div>

      {/* ── No assignments state ─────────────────────────────────── */}
      {companies.length === 0 && audits.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package size={48} className="text-slate-200 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-700">No assignments yet</h2>
          <p className="text-slate-400 text-sm mt-1">
            The Super Admin hasn't assigned any companies or audits to you yet.
          </p>
        </div>
      )}

      {/* ── Company tabs + details ───────────────────────────────── */}
      {companies.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Tab bar — one tab per company */}
          {companies.length > 1 && (
            <div className="flex overflow-x-auto border-b border-slate-100 bg-slate-50/50">
              {companies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCompany(c.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                    (selected?.id === c.id)
                      ? "border-indigo-600 text-indigo-600 bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/60"
                  }`}
                >
                  <Building2 size={15} />
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {selected && (
            <div className="p-6 space-y-6">
              {/* Company info header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Building2 size={26} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selected.name}</h2>
                    {selected.industry && (
                      <p className="text-sm text-slate-500 mt-0.5">{selected.industry}</p>
                    )}
                  </div>
                </div>
                {/* Evidence mini-stats */}
                <div className="flex gap-2">
                  {[
                    { label: "Evidence Total",    val: selected.evidence?.total,    cls: "bg-slate-50 border-slate-200 text-slate-700" },
                    { label: "Approved",           val: selected.evidence?.approved, cls: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                    { label: "Pending Review",     val: selected.evidence?.pending,  cls: "bg-amber-50 border-amber-200 text-amber-700" },
                  ].map(({ label, val, cls }) => (
                    <div key={label} className={`text-center px-3 py-2 rounded-xl border ${cls}`}>
                      <p className="text-lg font-bold">{val ?? 0}</p>
                      <p className="text-[10px] font-medium leading-tight">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frameworks + controls */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={18} className="text-violet-600" />
                  <h3 className="font-semibold text-slate-800">
                    Frameworks &amp; Controls
                    <span className="ml-2 text-sm font-normal text-slate-400">
                      ({selected.frameworks.length} framework{selected.frameworks.length !== 1 ? "s" : ""} assigned)
                    </span>
                  </h3>
                </div>
                {selected.frameworks.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
                    <Layers size={32} className="mx-auto mb-2 text-slate-200" />
                    <p className="text-sm">No frameworks assigned to this company yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selected.frameworks.map((fw) => (
                      <FrameworkCard key={`${fw.company_id}-${fw.framework_id}`} fw={fw} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Assigned Audits ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-slate-100">
          <FileSearch size={18} className="text-indigo-600" />
          <h2 className="font-bold text-slate-800 text-lg">My Assigned Audits</h2>
          <span className="ml-auto text-sm text-slate-400">{audits.length} audit{audits.length !== 1 ? "s" : ""}</span>
        </div>

        {audits.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm">No audits assigned to you yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {audits.map((audit) => (
              <div
                key={audit.id}
                onClick={() => navigate(`/app/audits/${audit.id}`)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 hover:bg-indigo-50/30 transition cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 group-hover:text-indigo-700 transition">
                      {audit.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                      {audit.company_name && (
                        <span className="flex items-center gap-1">
                          <Building2 size={13} className="text-slate-400" />
                          {audit.company_name}
                        </span>
                      )}
                      {audit.framework_name && (
                        <span className="flex items-center gap-1">
                          <ShieldCheck size={13} className="text-violet-400" />
                          {audit.framework_name}
                        </span>
                      )}
                      {audit.start_date && (
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-slate-400" />
                          {new Date(audit.start_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          {audit.end_date && ` → ${new Date(audit.end_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:flex-shrink-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColor[audit.status] || statusColor.PLANNED}`}>
                    {audit.status || "PLANNED"}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-indigo-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
