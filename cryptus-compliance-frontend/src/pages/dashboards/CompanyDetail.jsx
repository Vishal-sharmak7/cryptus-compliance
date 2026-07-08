import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyService } from "../../services/company.service";
import { companyFrameworkService } from "../../services/companyFramework.service";
import { companyControlService } from "../../services/companyControl.service";
import { frameworkService } from "../../services/framework.service";
import { controlService } from "../../services/control.service";
import {
  ArrowLeft,
  Building2,
  Globe,
  Briefcase,
  Layers,
  Shield,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Edit3,
  Check,
  X,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  COMPLETED: {
    label: "Completed",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: Clock,
  },
  NOT_STARTED: {
    label: "Not Started",
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-200",
    icon: AlertCircle,
  },
  FAILED: {
    label: "Failed",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: XCircle,
  },
};

const CATEGORY_COLORS = {
  Organizational: "bg-blue-50 text-blue-700 border-blue-200",
  People: "bg-purple-50 text-purple-700 border-purple-200",
  Physical: "bg-amber-50 text-amber-700 border-amber-200",
  Technological: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.NOT_STARTED;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.bg} ${cfg.border}`}
    >
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

function ComplianceRing({ score }) {
  const pct = parseFloat(score) || 0;
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-slate-900">
          {pct.toFixed(0)}%
        </span>
        <span className="text-xs text-slate-500 mt-0.5">Compliance</span>
      </div>
    </div>
  );
}

function ControlRow({ control, onStatusUpdate, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(control.status || "NOT_STARTED");
  const [notes, setNotes] = useState(control.notes || "");

  const handleSave = () => {
    onStatusUpdate(control.id, { status: newStatus, notes });
    setEditing(false);
  };

  const cfg = STATUS_CONFIG[control.status] || STATUS_CONFIG.NOT_STARTED;

  return (
    <div className="p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-sm transition-all">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Shield size={15} className="text-indigo-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-800 text-sm">
                {control.title}
              </span>
              {control.category && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${CATEGORY_COLORS[control.category] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {control.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={control.status} />
              <button
                onClick={() => setEditing(!editing)}
                title="Edit status"
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
              >
                <Edit3 size={13} />
              </button>
              {onRemove && (
                <button
                  onClick={() => onRemove(control.id)}
                  title="Remove control"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
          {control.description && (
            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
              {control.description}
            </p>
          )}
          {control.notes && !editing && (
            <p className="text-xs text-indigo-600 mt-1.5 italic">
              📝 {control.notes}
            </p>
          )}

          {editing && (
            <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
              <div className="flex gap-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition bg-white"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes..."
                rows={2}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  <Check size={12} /> Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-500 text-xs rounded-lg hover:bg-slate-50 transition"
                >
                  <X size={12} /> Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("frameworks");

  // Assign Framework Modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState("");
  const [fwSearch, setFwSearch] = useState("");

  // Assign Control Modal state
  const [isAssignCtrlOpen, setIsAssignCtrlOpen] = useState(false);
  const [ctrlModalFwId, setCtrlModalFwId] = useState("");
  const [selectedControlIds, setSelectedControlIds] = useState([]);
  const [ctrlSearch, setCtrlSearch] = useState("");

  // Fetch company info
  const { data: companyResp, isLoading: companyLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: () => companyService.getById(id).then((r) => r.data),
  });

  // Fetch assigned frameworks
  const { data: fwResp, isLoading: fwLoading } = useQuery({
    queryKey: ["company-frameworks", id],
    queryFn: () => companyFrameworkService.getByCompany(id).then((r) => r.data),
  });

  // Fetch controls
  const { data: ctrlResp, isLoading: ctrlLoading } = useQuery({
    queryKey: ["company-controls", id],
    queryFn: () => companyControlService.getByCompany(id).then((r) => r.data),
  });

  // Fetch compliance score
  const { data: scoreResp } = useQuery({
    queryKey: ["company-score", id],
    queryFn: () => companyControlService.getScore(id).then((r) => r.data),
  });

  // Fetch ALL frameworks (for assign modal)
  const { data: allFwResp } = useQuery({
    queryKey: ["frameworks", "all"],
    queryFn: () => frameworkService.getAll().then((r) => r.data),
  });

  const allFrameworks = allFwResp?.frameworks || allFwResp?.data || [];

  const assignMutation = useMutation({
    mutationFn: (data) => companyFrameworkService.assign(data),
    onSuccess: () => {
      toast.success("Framework assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["company-frameworks", id] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      setIsAssignModalOpen(false);
      setSelectedFrameworkId("");
      setFwSearch("");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to assign framework"),
  });

  const deassignMutation = useMutation({
    mutationFn: (cfId) => companyFrameworkService.deassign(cfId),
    onSuccess: () => {
      toast.success("Framework removed");
      queryClient.invalidateQueries({ queryKey: ["company-frameworks", id] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to remove framework"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ controlId, data }) =>
      companyControlService.updateStatus(controlId, data),
    onSuccess: () => {
      toast.success("Control status updated");
      queryClient.invalidateQueries({ queryKey: ["company-controls", id] });
      queryClient.invalidateQueries({ queryKey: ["company-score", id] });
    },
    onError: () => toast.error("Failed to update status"),
  });

  const assignControlMutation = useMutation({
    mutationFn: (data) => companyControlService.assign(data),
    onSuccess: () => {
      toast.success("Control assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["company-controls", id] });
      queryClient.invalidateQueries({ queryKey: ["company-score", id] });
      setIsAssignCtrlOpen(false);
      setCtrlModalFwId("");
      setSelectedControlIds([]);
      setCtrlSearch("");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to assign control"),
  });

  const deassignControlMutation = useMutation({
    mutationFn: (ccId) => companyControlService.deassign(ccId),
    onSuccess: () => {
      toast.success("Control removed");
      queryClient.invalidateQueries({ queryKey: ["company-controls", id] });
      queryClient.invalidateQueries({ queryKey: ["company-score", id] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to remove control"),
  });

  // Controls for the selected framework inside the Assign Control modal
  const { data: modalCtrlResp, isLoading: modalCtrlLoading } = useQuery({
    queryKey: ["controls-by-fw", ctrlModalFwId],
    queryFn: () =>
      controlService.getByFramework(ctrlModalFwId).then((r) => r.data),
    enabled: !!ctrlModalFwId,
  });
  const modalControls = modalCtrlResp?.controls || modalCtrlResp?.data || [];

  // ── Derive data from API responses ────────────────────────────────
  const company = companyResp?.company || companyResp?.data || companyResp;
  const frameworks = fwResp?.frameworks || fwResp?.data || [];
  const controls = ctrlResp?.controls || ctrlResp?.data || [];
  const score = scoreResp?.score || 0;
  const totalControls = scoreResp?.total || 0;
  const completedControls = scoreResp?.completed || 0;

  // Already-assigned control IDs → filter from modal list
  const assignedControlIds = new Set(controls.map((c) => c.control_id ?? c.id));
  const availableControls = modalControls.filter(
    (c) => !assignedControlIds.has(c.id),
  );
  const filteredControls = availableControls.filter((c) =>
    c.title?.toLowerCase().includes(ctrlSearch.toLowerCase()),
  );

  const handleToggleControl = (ctrlId) => {
    setSelectedControlIds((prev) =>
      prev.includes(ctrlId)
        ? prev.filter((id) => id !== ctrlId)
        : [...prev, ctrlId]
    );
  };

  const handleSelectAll = () => {
    const visibleIds = filteredControls.map((c) => c.id);
    const allVisibleSelected = visibleIds.every((id) =>
      selectedControlIds.includes(id)
    );
    if (allVisibleSelected) {
      setSelectedControlIds((prev) =>
        prev.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelectedControlIds((prev) => {
        const newSelection = [...prev];
        visibleIds.forEach((id) => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  // IDs already assigned → filter them out of the modal list
  const assignedFrameworkIds = new Set(
    frameworks.map((fw) => fw.framework_id ?? fw.id),
  );
  const availableFrameworks = allFrameworks.filter(
    (fw) => !assignedFrameworkIds.has(fw.id),
  );
  const filteredAvailable = availableFrameworks.filter((fw) =>
    fw.name?.toLowerCase().includes(fwSearch.toLowerCase()),
  );

  // Group controls by status for summary
  const statusCounts = controls.reduce((acc, c) => {
    const s = c.status || "NOT_STARTED";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          Loading company details...
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-16 text-slate-500">
        <Building2 size={40} className="mx-auto mb-3 opacity-30" />
        <p>Company not found.</p>
      </div>
    );
  }

  const tabs = [
    {
      id: "frameworks",
      label: "Assigned Frameworks",
      icon: Layers,
      count: frameworks.length,
    },
    { id: "controls", label: "Controls", icon: Shield, count: controls.length },
    { id: "overview", label: "Compliance Overview", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/app/companies")}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-xl transition text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Companies
        </button>
      </div>

      {/* Company Hero Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Building2 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{company.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-1.5 text-indigo-100 text-sm">
                {company.industry && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={13} />
                    {company.industry}
                  </span>
                )}
                {company.website && (
                  <a
                    href={
                      company.website.startsWith("http")
                        ? company.website
                        : `https://${company.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition"
                  >
                    <Globe size={13} />
                    {company.website}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4">
            <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">{frameworks.length}</p>
              <p className="text-xs text-indigo-200 mt-0.5">Frameworks</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">{controls.length}</p>
              <p className="text-xs text-indigo-200 mt-0.5">Controls</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">
                {parseFloat(score).toFixed(0)}%
              </p>
              <p className="text-xs text-indigo-200 mt-0.5">Compliant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={15} />
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === tab.id
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab: Frameworks */}
      {activeTab === "frameworks" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {frameworks.length === 0
                ? "No frameworks assigned yet."
                : `${frameworks.length} framework${frameworks.length !== 1 ? "s" : ""} assigned`}
            </p>
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200"
            >
              <Plus size={16} />
              Assign Framework
            </button>
          </div>

          {fwLoading ? (
            <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
              Loading frameworks...
            </div>
          ) : frameworks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <Layers size={28} className="text-indigo-400" />
              </div>
              <p className="text-slate-700 font-semibold">
                No frameworks assigned yet
              </p>
              <p className="text-slate-400 text-sm mt-1 mb-4">
                Assign a compliance framework to get started.
              </p>
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition"
              >
                <Plus size={15} /> Assign First Framework
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {frameworks.map((fw, i) => (
                <div
                  key={fw.id || i}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                      <Layers size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug">
                        {fw.name}
                      </h3>
                      {fw.description && (
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3">
                          {fw.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                      <CheckCircle2 size={11} /> Assigned
                    </span>
                    <button
                      onClick={() => deassignMutation.mutate(fw.id)}
                      disabled={deassignMutation.isPending}
                      title="Remove framework"
                      className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition disabled:opacity-40"
                    >
                      {deassignMutation.isPending ? (
                        <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <X size={12} />
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Controls */}
      {activeTab === "controls" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {controls.length === 0
                ? "No controls assigned yet."
                : `${controls.length} control${controls.length !== 1 ? "s" : ""} assigned`}
            </p>
            <button
              onClick={() => setIsAssignCtrlOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 active:scale-95 transition-all shadow-sm shadow-violet-200"
            >
              <Plus size={16} />
              Assign Control
            </button>
          </div>

          {/* Status summary bar */}
          {controls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <div
                    key={key}
                    className={`rounded-xl p-3 border ${cfg.bg} ${cfg.border}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={16} className={cfg.color} />
                      <span className={`text-xs font-semibold ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className={`text-2xl font-bold mt-1 ${cfg.color}`}>
                      {statusCounts[key] || 0}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {ctrlLoading ? (
            <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
              Loading controls...
            </div>
          ) : controls.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
                <Shield size={28} className="text-violet-400" />
              </div>
              <p className="text-slate-700 font-semibold">
                No controls assigned yet
              </p>
              <p className="text-slate-400 text-sm mt-1 mb-4">
                Assign a control from one of the company's frameworks.
              </p>
              <button
                onClick={() => setIsAssignCtrlOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition"
              >
                <Plus size={15} /> Assign First Control
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {controls.map((ctrl, i) => (
                <ControlRow
                  key={ctrl.id || i}
                  control={ctrl}
                  onStatusUpdate={(controlId, data) =>
                    updateStatusMutation.mutate({ controlId, data })
                  }
                  onRemove={(controlId) =>
                    deassignControlMutation.mutate(controlId)
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Compliance Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance Ring */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center">
            <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-500" />
              Overall Compliance Score
            </h3>
            <ComplianceRing score={score} />
            <div className="mt-6 flex items-center gap-6 text-sm text-slate-600">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {completedControls}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Completed</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-700">
                  {totalControls}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Total Controls</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-500">
                  {totalControls - completedControls}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Remaining</p>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
              <BarChart3 size={18} className="text-indigo-500" />
              Control Status Breakdown
            </h3>
            <div className="space-y-4">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const count = statusCounts[key] || 0;
                const pct = totalControls
                  ? Math.round((count / totalControls) * 100)
                  : 0;
                const Icon = cfg.icon;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`flex items-center gap-1.5 text-xs font-semibold ${cfg.color}`}
                      >
                        <Icon size={12} />
                        {cfg.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {count} / {totalControls}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          key === "COMPLETED"
                            ? "bg-emerald-500"
                            : key === "IN_PROGRESS"
                              ? "bg-amber-400"
                              : key === "FAILED"
                                ? "bg-red-500"
                                : "bg-slate-300"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-slate-400 mt-0.5">
                      {pct}%
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Frameworks list */}
            {frameworks.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Assigned Frameworks
                </p>
                <div className="flex flex-wrap gap-2">
                  {frameworks.map((fw, i) => (
                    <span
                      key={fw.id || i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-semibold"
                    >
                      <Layers size={11} />
                      {fw.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* ── Assign Framework Modal ──────────────────────────────────── */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            style={{ animation: "fadeInScale 0.18s ease" }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <Sparkles size={17} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Assign Framework
                  </h2>
                  <p className="text-xs text-slate-500">{company?.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedFrameworkId("");
                  setFwSearch("");
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 pt-4">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search frameworks..."
                  value={fwSearch}
                  onChange={(e) => setFwSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                />
              </div>
            </div>

            {/* Framework list */}
            <div className="px-6 py-3 max-h-64 overflow-y-auto space-y-2">
              {filteredAvailable.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Layers size={30} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">
                    {availableFrameworks.length === 0
                      ? "All frameworks already assigned!"
                      : "No frameworks match your search."}
                  </p>
                </div>
              ) : (
                filteredAvailable.map((fw) => (
                  <button
                    key={fw.id}
                    onClick={() =>
                      setSelectedFrameworkId(
                        selectedFrameworkId === fw.id ? "" : fw.id,
                      )
                    }
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      selectedFrameworkId === fw.id
                        ? "border-indigo-400 bg-indigo-50 shadow-sm"
                        : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition ${
                        selectedFrameworkId === fw.id
                          ? "bg-indigo-600"
                          : "bg-slate-100"
                      }`}
                    >
                      <Layers
                        size={16}
                        className={
                          selectedFrameworkId === fw.id
                            ? "text-white"
                            : "text-slate-400"
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-sm ${
                          selectedFrameworkId === fw.id
                            ? "text-indigo-700"
                            : "text-slate-800"
                        }`}
                      >
                        {fw.name}
                      </p>
                      {fw.description && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {fw.description}
                        </p>
                      )}
                    </div>
                    {selectedFrameworkId === fw.id && (
                      <CheckCircle2
                        size={18}
                        className="text-indigo-600 flex-shrink-0"
                      />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedFrameworkId("");
                  setFwSearch("");
                }}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                disabled={!selectedFrameworkId || assignMutation.isPending}
                onClick={() =>
                  assignMutation.mutate({
                    company_id: id,
                    framework_id: selectedFrameworkId,
                  })
                }
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {assignMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Check size={15} /> Assign Framework
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Assign Control Modal ──────────────────────────────────── */}
      {isAssignCtrlOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            style={{ animation: "fadeInScale 0.18s ease" }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
                  <Shield size={17} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Assign Control
                  </h2>
                  <p className="text-xs text-slate-500">{company?.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAssignCtrlOpen(false);
                  setCtrlModalFwId("");
                  setSelectedControlIds([]);
                  setCtrlSearch("");
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Step 1 — Pick a framework */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Step 1 — Select Framework
                </label>
                <div className="flex flex-wrap gap-2">
                  {frameworks.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">
                      No frameworks assigned. Assign a framework first.
                    </p>
                  ) : (
                    frameworks.map((fw, i) => (
                      <button
                        key={fw.id || i}
                        onClick={() => {
                          setCtrlModalFwId(fw.framework_id ?? fw.id);
                          setSelectedControlIds([]);
                          setCtrlSearch("");
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-semibold transition ${
                          ctrlModalFwId === (fw.framework_id ?? fw.id)
                            ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50"
                        }`}
                      >
                        <Layers size={13} />
                        {fw.name}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Step 2 — Pick a control */}
              {ctrlModalFwId && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Step 2 — Select Control
                  </label>

                  {/* Search */}
                  <div className="relative mb-3">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Search controls..."
                      value={ctrlSearch}
                      onChange={(e) => setCtrlSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
                    />
                  </div>

                  {/* Select All Option */}
                  {!modalCtrlLoading && filteredControls.length > 0 && (
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-xs text-slate-500 font-medium">
                        {selectedControlIds.length} of {filteredControls.length} controls selected
                      </span>
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-xs font-bold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100/80 px-2.5 py-1 rounded-lg transition"
                      >
                        {filteredControls.every((c) => selectedControlIds.includes(c.id))
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>
                  )}

                  {/* Controls list */}
                  <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                    {modalCtrlLoading ? (
                      <div className="flex items-center justify-center py-6 text-slate-400 text-sm gap-2">
                        <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                        Loading controls...
                      </div>
                    ) : filteredControls.length === 0 ? (
                      <div className="text-center py-6 text-slate-400">
                        <Shield size={28} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">
                          {availableControls.length === 0
                            ? "All controls from this framework are already assigned!"
                            : "No controls match your search."}
                        </p>
                      </div>
                    ) : (
                      filteredControls.map((ctrl) => (
                        <button
                          key={ctrl.id}
                          onClick={() => handleToggleControl(ctrl.id)}
                          className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                            selectedControlIds.includes(ctrl.id)
                              ? "border-violet-400 bg-violet-50/50 shadow-sm"
                              : "border-slate-200 hover:border-violet-200 hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                              selectedControlIds.includes(ctrl.id)
                                ? "bg-violet-600"
                                : "bg-slate-100"
                            }`}
                          >
                            <Shield
                              size={14}
                              className={
                                selectedControlIds.includes(ctrl.id)
                                  ? "text-white"
                                  : "text-slate-400"
                              }
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span
                                className={`font-semibold text-sm ${
                                  selectedControlIds.includes(ctrl.id)
                                    ? "text-violet-700"
                                    : "text-slate-800"
                                }`}
                              >
                                {ctrl.title}
                              </span>
                              {ctrl.category && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${CATEGORY_COLORS[ctrl.category] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                  {ctrl.category}
                                </span>
                              )}
                            </div>
                            {ctrl.description && (
                              <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                                {ctrl.description}
                              </p>
                            )}
                          </div>
                          {selectedControlIds.includes(ctrl.id) && (
                            <CheckCircle2
                              size={17}
                              className="text-violet-600 flex-shrink-0 mt-0.5"
                            />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => {
                  setIsAssignCtrlOpen(false);
                  setCtrlModalFwId("");
                  setSelectedControlIds([]);
                  setCtrlSearch("");
                }}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                disabled={
                  selectedControlIds.length === 0 ||
                  !ctrlModalFwId ||
                  assignControlMutation.isPending
                }
                onClick={() =>
                  assignControlMutation.mutate({
                    company_id: id,
                    framework_id: ctrlModalFwId,
                    control_id: selectedControlIds,
                  })
                }
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {assignControlMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Check size={15} /> Assign {selectedControlIds.length > 1 ? `${selectedControlIds.length} Controls` : "Control"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
