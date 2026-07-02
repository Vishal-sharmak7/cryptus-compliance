import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { companyService } from "../../services/company.service";
import { companyFrameworkService } from "../../services/companyFramework.service";
import { frameworkService } from "../../services/framework.service";
import {
  Building2, Plus, Search, Edit2, Trash2, X, Globe, Briefcase,
  Layers, ChevronRight, CheckCircle2, Check, AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

const EMPTY_FORM = { name: "", industry: "", website: "" };

/* ── Inline framework badges per row ──────────────────────────────── */
function CompanyFrameworkBadges({ companyId }) {
  const { data } = useQuery({
    queryKey: ["company-frameworks", companyId],
    queryFn: () =>
      companyFrameworkService.getByCompany(companyId).then((r) => r.data),
    staleTime: 60000,
  });
  const frameworks = data?.frameworks || data?.data || [];
  if (frameworks.length === 0)
    return <span className="text-xs text-slate-400 italic">None assigned</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {frameworks.map((fw, i) => (
        <span
          key={fw.id || i}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-semibold"
        >
          <CheckCircle2 size={10} />
          {fw.name}
        </span>
      ))}
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────── */
export default function CompaniesManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queryKey = ["companies"];

  /* State */
  const [searchTerm, setSearchTerm]           = useState("");
  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [editTarget, setEditTarget]           = useState(null);   // company being edited
  const [deleteTarget, setDeleteTarget]       = useState(null);   // company awaiting delete
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState("");
  const [formData, setFormData]               = useState(EMPTY_FORM);

  /* ── Queries ────────────────────────────────────────────────────── */
  const { data: response, isLoading } = useQuery({
    queryKey,
    queryFn: () => companyService.getAll().then((r) => r.data),
  });

  const { data: frameworksResp } = useQuery({
    queryKey: ["frameworks", "all"],
    queryFn: () => frameworkService.getAll().then((r) => r.data),
  });

  /* ── Mutations ──────────────────────────────────────────────────── */
  const createMutation = useMutation({
    mutationFn: (data) => companyService.create(data),
    onSuccess: () => {
      toast.success("Company created successfully");
      queryClient.invalidateQueries({ queryKey });
      closeModal();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to create company"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => companyService.update(id, data),
    onSuccess: () => {
      toast.success("Company updated successfully");
      queryClient.invalidateQueries({ queryKey });
      closeModal();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update company"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => companyService.delete(id),
    onSuccess: () => {
      toast.success("Company deleted");
      queryClient.invalidateQueries({ queryKey });
      setDeleteTarget(null);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to delete company"),
  });

  const assignMutation = useMutation({
    mutationFn: (data) => companyFrameworkService.assign(data),
    onSuccess: () => {
      toast.success("Framework assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["company-frameworks", selectedCompanyId] });
      setIsAssignModalOpen(false);
      setSelectedFrameworkId("");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to assign framework"),
  });

  /* ── Helpers ────────────────────────────────────────────────────── */
  const openCreate = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (company) => {
    setEditTarget(company);
    setFormData({
      name: company.name || "",
      industry: company.industry || "",
      website: company.website || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditTarget(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Company name is required");
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  /* ── Derived data ────────────────────────────────────────────────── */
  const frameworks = frameworksResp?.frameworks || frameworksResp?.data || [];
  const companies = Array.isArray(response?.companies)
    ? response.companies
    : Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
    ? response
    : [];

  const filtered = companies.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSaving = (editTarget ? updateMutation : createMutation).isPending;

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Companies Management</h1>
          <p className="text-slate-500">Manage client organizations and tenants.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200"
        >
          <Plus size={18} /> Add Company
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Company Name</th>
                <th className="px-6 py-4 font-medium">Industry</th>
                <th className="px-6 py-4 font-medium">Website</th>
                <th className="px-6 py-4 font-medium">Assigned Frameworks</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      Loading companies...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                    No companies found.
                  </td>
                </tr>
              ) : (
                filtered.map((company, idx) => (
                  <tr
                    key={company.id || idx}
                    className="hover:bg-indigo-50/30 transition cursor-pointer group"
                  >
                    {/* Company Name — click to navigate */}
                    <td
                      className="px-6 py-4"
                      onClick={() => navigate(`/app/companies/${company.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition flex-shrink-0">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-indigo-700 transition flex items-center gap-1">
                            {company.name}
                            <ChevronRight
                              size={13}
                              className="opacity-0 group-hover:opacity-100 transition text-indigo-400"
                            />
                          </p>
                          <p className="text-xs text-slate-400">Click to view details</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Briefcase size={13} className="text-slate-400 flex-shrink-0" />
                        {company.industry || <span className="text-slate-400">N/A</span>}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {company.website ? (
                        <a
                          href={
                            company.website.startsWith("http")
                              ? company.website
                              : `https://${company.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-indigo-600 hover:underline text-sm"
                        >
                          <Globe size={13} className="flex-shrink-0" />
                          <span className="truncate max-w-[160px]">{company.website}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <CompanyFrameworkBadges companyId={company.id} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Assign Framework */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCompanyId(company.id);
                            setIsAssignModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition font-medium text-xs"
                        >
                          <Layers size={13} /> Assign Framework
                        </button>

                        {/* Edit */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(company);
                          }}
                          title="Edit company"
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <Edit2 size={15} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(company);
                          }}
                          title="Delete company"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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

      {/* ── Create / Edit Company Modal ──────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            style={{ animation: "fadeInScale 0.18s ease" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <Building2 size={17} className="text-white" />
                </div>
                <h2 className="text-base font-bold text-slate-800">
                  {editTarget ? "Edit Company" : "Add Company"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
                  placeholder="e.g., Cryptus Cyber Security"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
                  placeholder="e.g., Cyber Security"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
                  placeholder="e.g., https://cryptus.in"
                />
              </div>
              <div className="pt-1 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={15} />
                      {editTarget ? "Save Changes" : "Create Company"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
            style={{ animation: "fadeInScale 0.18s ease" }}
          >
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Delete Company?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                <span className="font-semibold text-slate-700">
                  "{deleteTarget.name}"
                </span>{" "}
                and all its assigned frameworks will be permanently removed. This
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteTarget.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 text-sm"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={15} /> Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Assign Framework Modal ───────────────────────────────── */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            style={{ animation: "fadeInScale 0.18s ease" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <Layers size={17} className="text-white" />
                </div>
                <h2 className="text-base font-bold text-slate-800">Assign Framework</h2>
              </div>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedFrameworkId("");
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!selectedFrameworkId)
                  return toast.error("Please select a framework");
                assignMutation.mutate({
                  company_id: selectedCompanyId,
                  framework_id: selectedFrameworkId,
                });
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Framework *
                </label>
                <select
                  required
                  value={selectedFrameworkId}
                  onChange={(e) => setSelectedFrameworkId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
                >
                  <option value="">-- Choose Framework --</option>
                  {frameworks.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAssignModalOpen(false);
                    setSelectedFrameworkId("");
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
                >
                  {assignMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <Check size={15} /> Assign
                    </>
                  )}
                </button>
              </div>
            </form>
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
