import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { findingService } from "../../services/finding.service";
import { companyService } from "../../services/company.service";
import { auditService } from "../../services/audit.service";
import { controlService } from "../../services/control.service";
import { useAuth } from "../../context/AuthContext";
import { AlertTriangle, Plus, Search, Edit2, Trash2, X, AlertCircle, ShieldAlert, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

const severityColors = {
  CRITICAL: "bg-red-50 text-red-700 border-red-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const statusColors = {
  OPEN: "bg-rose-50 text-rose-700 border-rose-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200",
  RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CLOSED: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function FindingManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isClient = user?.role === "CLIENT";
  const companyId = user?.companyId || user?.company_id;

  const [formData, setFormData] = useState({
    company_id: isClient ? companyId : "",
    audit_id: "",
    control_id: "",
    title: "",
    description: "",
    severity: "MEDIUM",
    status: "OPEN",
    due_date: "",
  });

  // Fetch Findings
  const { data: response, isLoading } = useQuery({
    queryKey: ["findings", isClient ? companyId : "all"],
    queryFn: () => isClient ? findingService.getByCompany(companyId) : findingService.getAll(),
  });

  const rawFindings = response?.data?.data?.findings || 
                      response?.data?.data || 
                      response?.data?.findings || 
                      response?.data || 
                      [];
  const findings = Array.isArray(rawFindings) ? rawFindings : [];

  // Fetch Companies (required for SUPER_ADMIN/AUDITOR to select a company)
  const { data: companiesResponse } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companyService.getAll(),
    enabled: !isClient,
  });
  const companies = companiesResponse?.data?.companies || companiesResponse?.data || [];

  // Fetch Audits for the selected/current company
  const activeCompanyId = isClient ? companyId : formData.company_id;
  const { data: auditsResponse } = useQuery({
    queryKey: ["audits", activeCompanyId],
    queryFn: () => auditService.getAll(activeCompanyId ? { company_id: activeCompanyId } : {}),
    enabled: true, // Fetch always, or filter by company if activeCompanyId is selected
  });
  const rawAudits = auditsResponse?.data?.audits || auditsResponse?.data?.data?.audits || auditsResponse?.data || [];
  const audits = Array.isArray(rawAudits) ? rawAudits : [];
  
  // Filter audits that belong to the active company
  const filteredAudits = activeCompanyId 
    ? audits.filter(a => Number(a.company_id) === Number(activeCompanyId))
    : audits;

  // Fetch Controls for the active company
  const { data: controlsResponse } = useQuery({
    queryKey: ["controls", activeCompanyId],
    queryFn: () => controlService.getByCompany(activeCompanyId),
    enabled: !!activeCompanyId,
  });
  const rawControls = controlsResponse?.data?.data || controlsResponse?.data || [];
  const controls = Array.isArray(rawControls) ? rawControls : [];

  // Frontend filters
  const filtered = findings.filter((f) => {
    const matchesSearch =
      (f.title || f.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter ? f.severity === severityFilter : true;
    const matchesStatus = statusFilter ? f.status === statusFilter : true;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Stats
  const totalCount = findings.length;
  const criticalCount = findings.filter((f) => f.severity === "CRITICAL" || f.severity === "HIGH").length;
  const openCount = findings.filter((f) => f.status === "OPEN" || f.status === "IN_PROGRESS").length;
  const resolvedCount = findings.filter((f) => f.status === "RESOLVED" || f.status === "CLOSED").length;

  const createMutation = useMutation({
    mutationFn: (data) => findingService.create(data),
    onSuccess: () => {
      toast.success("Finding registered successfully");
      queryClient.invalidateQueries({ queryKey: ["findings"] });
      setIsModalOpen(false);
      setFormData({
        company_id: isClient ? companyId : "",
        audit_id: "",
        control_id: "",
        title: "",
        description: "",
        severity: "MEDIUM",
        status: "OPEN",
        due_date: "",
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create finding");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => findingService.delete(id),
    onSuccess: () => {
      toast.success("Finding deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["findings"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete finding");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company_id) return toast.error("Please select a Company");
    if (!formData.audit_id) return toast.error("Please select an Audit");
    if (!formData.title) return toast.error("Finding Title is required");

    const payload = {
      ...formData,
      company_id: Number(formData.company_id),
      audit_id: Number(formData.audit_id),
      ...(formData.control_id && { control_id: Number(formData.control_id) }),
      ...(formData.due_date && { due_date: formData.due_date }),
    };

    createMutation.mutate(payload);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this finding?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finding Management</h1>
          <p className="text-slate-500">Log, track, and resolve compliance audit findings.</p>
        </div>
        {!isClient && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus size={18} /> Register Finding
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0">
            <AlertCircle size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
            <p className="text-sm text-slate-500 mt-0.5">Total Findings</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
            <ShieldAlert size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            <p className="text-sm text-slate-500 mt-0.5">High/Critical Severity</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-rose-600">{openCount}</p>
            <p className="text-sm text-slate-500 mt-0.5">Active / Open</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">{resolvedCount}</p>
            <p className="text-sm text-slate-500 mt-0.5">Resolved / Closed</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search findings by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Findings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Finding Title &amp; Details</th>
                {!isClient && <th className="px-6 py-4 font-medium">Company</th>}
                <th className="px-6 py-4 font-medium">Audit &amp; Control</th>
                <th className="px-6 py-4 font-medium">Severity</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={isClient ? 6 : 7} className="px-6 py-8 text-center text-slate-500">
                    Loading findings...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={isClient ? 6 : 7} className="px-6 py-8 text-center text-slate-500">
                    No findings recorded.
                  </td>
                </tr>
              ) : (
                filtered.map((finding, idx) => (
                  <tr key={finding.id || idx} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 whitespace-normal max-w-sm">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="text-amber-600 mt-0.5 flex-shrink-0" size={18} />
                        <div>
                          <p className="font-semibold text-slate-900">{finding.title || finding.name}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{finding.description}</p>
                        </div>
                      </div>
                    </td>
                    {!isClient && (
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {finding.company_name || `Company #${finding.company_id}`}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5 max-w-xs whitespace-normal">
                        <p><span className="text-slate-400">Audit:</span> <span className="font-medium text-slate-700">{finding.audit_title || `Audit #${finding.audit_id}`}</span></p>
                        <p><span className="text-slate-400">Control:</span> <span className="font-medium text-slate-600">{finding.control_name || "None"}</span></p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${severityColors[finding.severity] || severityColors.LOW}`}>
                        {finding.severity || "LOW"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[finding.status] || statusColors.OPEN}`}>
                        {finding.status || "OPEN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                      {finding.due_date
                        ? new Date(finding.due_date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isClient && (
                          <button
                            onClick={() => handleDelete(finding.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Finding"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Finding Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Register Finding</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {!isClient && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Company *</label>
                  <select
                    required
                    value={formData.company_id}
                    onChange={(e) => setFormData({ ...formData, company_id: e.target.value, audit_id: "", control_id: "" })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white"
                  >
                    <option value="">Select Company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Associated Audit *</label>
                <select
                  required
                  disabled={!activeCompanyId || filteredAudits.length === 0}
                  value={formData.audit_id}
                  onChange={(e) => setFormData({ ...formData, audit_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white disabled:opacity-65"
                >
                  <option value="">
                    {!activeCompanyId 
                      ? "Please select a company first" 
                      : filteredAudits.length === 0 
                      ? "No audits found / assigned to you" 
                      : "Select Audit"
                    }
                  </option>
                  {filteredAudits.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
                {activeCompanyId && filteredAudits.length === 0 && (
                  <p className="text-red-500 text-xs mt-1">
                    No audits are currently assigned to you for this company. Please create or assign an audit under the Audits tab first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Associated Control (Optional)</label>
                <select
                  disabled={!activeCompanyId}
                  value={formData.control_id}
                  onChange={(e) => setFormData({ ...formData, control_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white disabled:opacity-65"
                >
                  <option value="">{!activeCompanyId ? "Please select a company first" : "Select Control"}</option>
                  {controls.map((c) => (
                    <option key={c.id} value={c.control_id || c.id}>
                      {c.control_code || c.code} - {c.control_name || c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Finding Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
                  placeholder="e.g., Sensitive backups stored publicly"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none text-sm"
                  placeholder="Details of the finding"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Severity *</label>
                  <select
                    required
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {createMutation.isPending ? "Saving..." : "Save Finding"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
