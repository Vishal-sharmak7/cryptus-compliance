import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { riskService } from "../../services/risk.service";
import { companyService } from "../../services/company.service";
import { useAuth } from "../../context/AuthContext";
import {
  AlertTriangle, Plus, Search, Edit2, Trash2, X,
  ShieldAlert, ShieldCheck, CheckCircle2, AlertCircle, Clock, User
} from "lucide-react";
import toast from "react-hot-toast";

const severityColors = {
  CRITICAL: "bg-red-50 text-red-700 border-red-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const statusColors = {
  OPEN: "bg-rose-50 text-rose-700 border-rose-200",
  MITIGATED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ACCEPTED: "bg-blue-50 text-blue-700 border-blue-200",
  CLOSED: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function RiskManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState(null);
  
  const [formData, setFormData] = useState({
    company_id: "",
    title: "",
    description: "",
    impact: "MEDIUM",
    likelihood: "MEDIUM",
    severity: "MEDIUM",
    status: "OPEN",
    owner: "",
    mitigation: "",
    due_date: "",
  });

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isClient = user?.role === "CLIENT";
  const companyId = user?.companyId || user?.company_id;

  // Fetch Companies (needed for SUPER_ADMIN/AUDITOR to select a company when creating/updating a risk)
  const { data: companiesResponse } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companyService.getAll(),
    enabled: !isClient,
  });
  const companiesList = companiesResponse?.data?.companies || companiesResponse?.data || [];

  // Fetch Risks
  const { data: risksResponse, isLoading } = useQuery({
    queryKey: ["risks", isClient ? companyId : "all"],
    queryFn: () => isClient ? riskService.getByCompany(companyId) : riskService.getAll(),
  });

  const rawRisksList = risksResponse?.data?.data?.risks || 
                       risksResponse?.data?.data || 
                       risksResponse?.data?.risks || 
                       risksResponse?.data || 
                       [];

  const risks = Array.isArray(rawRisksList) ? rawRisksList : [];

  // Filter risks on frontend for search and filter selections
  const filteredRisks = risks.filter((r) => {
    const matchesSearch =
      r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.owner?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter ? r.severity === severityFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Calculate statistics
  const totalCount = risks.length;
  const criticalCount = risks.filter((r) => r.severity === "CRITICAL" || r.severity === "HIGH").length;
  const openCount = risks.filter((r) => r.status === "OPEN").length;
  const mitigatedCount = risks.filter((r) => r.status === "MITIGATED" || r.status === "CLOSED").length;

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (data) => riskService.create(data),
    onSuccess: () => {
      toast.success("Risk registered successfully");
      queryClient.invalidateQueries({ queryKey: ["risks"] });
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create risk");
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => riskService.update(id, data),
    onSuccess: () => {
      toast.success("Risk updated successfully");
      queryClient.invalidateQueries({ queryKey: ["risks"] });
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update risk");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => riskService.delete(id),
    onSuccess: () => {
      toast.success("Risk deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["risks"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete risk");
    },
  });

  const openAddModal = () => {
    setEditingRisk(null);
    setFormData({
      company_id: isClient ? companyId : "",
      title: "",
      description: "",
      impact: "MEDIUM",
      likelihood: "MEDIUM",
      severity: "MEDIUM",
      status: "OPEN",
      owner: "",
      mitigation: "",
      due_date: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (risk) => {
    setEditingRisk(risk);
    
    // Format date string for the date input field (YYYY-MM-DD)
    let formattedDate = "";
    if (risk.due_date) {
      formattedDate = new Date(risk.due_date).toISOString().substring(0, 10);
    }

    setFormData({
      company_id: risk.company_id || "",
      title: risk.title || "",
      description: risk.description || "",
      impact: risk.impact || "MEDIUM",
      likelihood: risk.likelihood || "MEDIUM",
      severity: risk.severity || "MEDIUM",
      status: risk.status || "OPEN",
      owner: risk.owner || "",
      mitigation: risk.mitigation || "",
      due_date: formattedDate,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRisk(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return toast.error("Risk Title is required");
    if (!formData.company_id) return toast.error("Please select a Company");

    const payload = {
      ...formData,
      company_id: Number(formData.company_id),
    };

    if (editingRisk) {
      updateMutation.mutate({ id: editingRisk.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this risk?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Risk Register</h1>
          <p className="text-slate-500">Assess, track, and mitigate compliance &amp; operational risks.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus size={18} /> Register Risk
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0">
            <ShieldAlert size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
            <p className="text-sm text-slate-500 mt-0.5">Total Risks</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
            <AlertCircle size={22} />
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
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">{mitigatedCount}</p>
            <p className="text-sm text-slate-500 mt-0.5">Mitigated / Closed</p>
          </div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search risks by title, desc, owner..."
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
            <option value="MITIGATED">Mitigated</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Risks table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Risk Title &amp; Mitigation</th>
                {!isClient && <th className="px-6 py-4 font-medium">Company</th>}
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">Severity</th>
                <th className="px-6 py-4 font-medium">Impact / Likelihood</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={isClient ? 7 : 8} className="px-6 py-8 text-center text-slate-500">
                    Loading Risk Register...
                  </td>
                </tr>
              ) : filteredRisks.length === 0 ? (
                <tr>
                  <td colSpan={isClient ? 7 : 8} className="px-6 py-8 text-center text-slate-500">
                    No risks documented in this register.
                  </td>
                </tr>
              ) : (
                filteredRisks.map((risk) => (
                  <tr key={risk.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="max-w-md whitespace-normal">
                        <p className="font-semibold text-slate-900">{risk.title}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{risk.description}</p>
                        {risk.mitigation && (
                          <div className="mt-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100 text-slate-600">
                            <span className="font-semibold block text-slate-700">Mitigation Strategy:</span>
                            {risk.mitigation}
                          </div>
                        )}
                      </div>
                    </td>
                    {!isClient && (
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {risk.company_name || `Company #${risk.company_id}`}
                      </td>
                    )}
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <User size={12} />
                        </div>
                        <span className="font-medium text-xs">{risk.owner || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${severityColors[risk.severity] || severityColors.LOW}`}>
                        {risk.severity || "LOW"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="text-xs space-y-0.5">
                        <p><span className="text-slate-400">Impact:</span> <span className="font-medium">{risk.impact}</span></p>
                        <p><span className="text-slate-400">Likelihood:</span> <span className="font-medium">{risk.likelihood}</span></p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[risk.status] || statusColors.OPEN}`}>
                        {risk.status || "OPEN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                      {risk.due_date
                        ? new Date(risk.due_date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(risk)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Edit Risk"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(risk.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Risk"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register/Edit Risk Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">{editingRisk ? "Edit Registered Risk" : "Register Compliance Risk"}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition">
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
                    onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white"
                  >
                    <option value="">Select Company</option>
                    {companiesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Risk Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
                  placeholder="e.g., Sensitive backup logs stored in public S3 bucket"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none text-sm"
                  placeholder="Elaborate on the vulnerability or operational risk"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Impact</label>
                  <select
                    value={formData.impact}
                    onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Likelihood</label>
                  <select
                    value={formData.likelihood}
                    onChange={(e) => setFormData({ ...formData, likelihood: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm bg-white"
                  >
                    <option value="OPEN">Open</option>
                    <option value="MITIGATED">Mitigated</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Risk Owner</label>
                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
                    placeholder="e.g., Security Team lead"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Mitigation Plan</label>
                <textarea
                  rows={2}
                  value={formData.mitigation}
                  onChange={(e) => setFormData({ ...formData, mitigation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none text-sm"
                  placeholder="e.g., Restrict S3 policy, run encryption checks"
                />
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
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Risk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
