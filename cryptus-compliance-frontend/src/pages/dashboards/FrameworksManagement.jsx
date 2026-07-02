import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { frameworkService } from "../../services/framework.service";
import { useAuth } from "../../context/AuthContext";
import {
  Layers, Plus, Search, Edit2, Trash2, ShieldCheck, X, Check, AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

const EMPTY_FORM = { name: "", description: "" };

export default function FrameworksManagement() {
  const [searchTerm, setSearchTerm]       = useState("");
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [editTarget, setEditTarget]       = useState(null);   // framework being edited
  const [deleteTarget, setDeleteTarget]   = useState(null);   // framework awaiting confirm
  const [formData, setFormData]           = useState(EMPTY_FORM);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isClient  = user?.role === "CLIENT";
  const companyId = user?.companyId || user?.company_id || 1;
  const queryKey  = ["frameworks", isClient ? companyId : "all"];

  /* ── Queries ──────────────────────────────────────────────────── */
  const { data: response, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      isClient
        ? frameworkService.getByCompany(companyId).then((r) => r.data)
        : frameworkService.getAll().then((r) => r.data),
  });

  /* ── Mutations ────────────────────────────────────────────────── */
  const createMutation = useMutation({
    mutationFn: (data) => frameworkService.create(data),
    onSuccess: () => {
      toast.success("Framework created successfully");
      queryClient.invalidateQueries({ queryKey });
      closeModal();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to create framework"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => frameworkService.update(id, data),
    onSuccess: () => {
      toast.success("Framework updated");
      queryClient.invalidateQueries({ queryKey });
      closeModal();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update framework"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => frameworkService.delete(id),
    onSuccess: () => {
      toast.success("Framework deleted");
      queryClient.invalidateQueries({ queryKey });
      setDeleteTarget(null);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to delete framework"),
  });

  /* ── Helpers ──────────────────────────────────────────────────── */
  const openCreate = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (fw) => {
    setEditTarget(fw);
    setFormData({ name: fw.name || fw.framework_name || "", description: fw.description || "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditTarget(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Name is required");
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const frameworks = Array.isArray(response?.frameworks)
    ? response.frameworks
    : Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
    ? response
    : [];

  const filtered = frameworks.filter(
    (fw) =>
      (fw.name || fw.framework_name)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      fw.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSaving =
    (editTarget ? updateMutation : createMutation).isPending;

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <div className="space-y-6 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isClient ? "My Frameworks" : "Frameworks"}
          </h1>
          <p className="text-slate-500">
            {isClient
              ? "Frameworks your company is currently implementing."
              : "Manage compliance frameworks across the platform."}
          </p>
        </div>
        {!isClient && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200"
          >
            <Plus size={18} /> Add Framework
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              placeholder="Search frameworks..."
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
                <th className="px-6 py-4 font-medium">Framework</th>
                {isClient ? (
                  <th className="px-6 py-4 font-medium">Progress</th>
                ) : (
                  <th className="px-6 py-4 font-medium">Version</th>
                )}
                {!isClient && (
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      Loading frameworks...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400">
                    No frameworks found.
                  </td>
                </tr>
              ) : (
                filtered.map((fw, idx) => (
                  <tr key={fw.id || idx} className="hover:bg-slate-50/60 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
                          {isClient && fw.status === "COMPLETED" ? (
                            <ShieldCheck size={20} />
                          ) : (
                            <Layers size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {fw.name || fw.framework_name}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-sm mt-0.5">
                            {fw.description || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isClient ? (
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-slate-100 rounded-full h-2 max-w-[120px]">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${fw.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-slate-600 text-xs font-medium">
                            {fw.progress || 0}%
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          v{fw.version || "1.0"}
                        </span>
                      )}
                    </td>
                    {!isClient && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(fw)}
                            title="Edit framework"
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(fw)}
                            title="Delete framework"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create / Edit Modal ──────────────────────────────────── */}
      {isModalOpen && (
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
                <h2 className="text-base font-bold text-slate-800">
                  {editTarget ? "Edit Framework" : "Add Framework"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Framework Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
                  placeholder="e.g., SOC 2 Type II"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none text-sm"
                  placeholder="Security and Availability Controls..."
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
                      {editTarget ? "Save Changes" : "Create Framework"}
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
                Delete Framework?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                <span className="font-semibold text-slate-700">
                  "{deleteTarget.name || deleteTarget.framework_name}"
                </span>{" "}
                will be permanently deleted. This action cannot be undone.
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

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
