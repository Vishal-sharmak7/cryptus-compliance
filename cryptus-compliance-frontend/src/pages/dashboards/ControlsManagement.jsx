import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { controlService } from "../../services/control.service";
import { frameworkService } from "../../services/framework.service";
import { useAuth } from "../../context/AuthContext";
import {
  ClipboardList, Plus, Search, Edit2, Trash2, X, Layers, Check, AlertTriangle, Shield,
} from "lucide-react";
import toast from "react-hot-toast";

const EMPTY_FORM = { title: "", description: "" };

const STATUS_STYLE = {
  PASSED:   "bg-emerald-100 text-emerald-800",
  FAILED:   "bg-red-100 text-red-800",
  REVIEWED: "bg-blue-100 text-blue-800",
  default:  "bg-amber-100 text-amber-800",
};

export default function ControlsManagement() {
  const [searchTerm, setSearchTerm]       = useState("");
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [editTarget, setEditTarget]       = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState("");
  const [formData, setFormData]           = useState(EMPTY_FORM);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isClient  = user?.role === "CLIENT";
  const companyId = user?.companyId || user?.company_id || 1;

  /* ── Frameworks dropdown (Admin only) ─────────────────────────── */
  const { data: fwResp } = useQuery({
    queryKey: ["all-frameworks"],
    queryFn: () => frameworkService.getAll().then((r) => r.data),
    enabled: !isClient,
  });
  const frameworks = Array.isArray(fwResp?.frameworks)
    ? fwResp.frameworks
    : Array.isArray(fwResp?.data)
    ? fwResp.data
    : [];

  // Auto-select first framework
  if (!isClient && !selectedFrameworkId && frameworks.length > 0) {
    setSelectedFrameworkId(frameworks[0].id.toString());
  }

  /* ── Controls query ───────────────────────────────────────────── */
  const queryKey = isClient
    ? ["controls", companyId]
    : ["controls", "framework", selectedFrameworkId];

  const { data: response, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      isClient
        ? controlService.getByCompany(companyId).then((r) => r.data)
        : controlService.getByFramework(selectedFrameworkId).then((r) => r.data),
    enabled: isClient || !!selectedFrameworkId,
  });

  const controls = Array.isArray(response?.controls)
    ? response.controls
    : Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
    ? response
    : [];

  const filtered = controls.filter(
    (c) =>
      (c.title || c.control_title)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ── Mutations ────────────────────────────────────────────────── */
  const createMutation = useMutation({
    mutationFn: (data) =>
      controlService.create({ ...data, framework_id: Number(selectedFrameworkId) }),
    onSuccess: () => {
      toast.success("Control created successfully");
      queryClient.invalidateQueries({ queryKey });
      closeModal();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to create control"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => controlService.update(id, data),
    onSuccess: () => {
      toast.success("Control updated");
      queryClient.invalidateQueries({ queryKey });
      closeModal();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update control"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => controlService.delete(id),
    onSuccess: () => {
      toast.success("Control deleted");
      queryClient.invalidateQueries({ queryKey });
      setDeleteTarget(null);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to delete control"),
  });

  /* ── Helpers ──────────────────────────────────────────────────── */
  const openCreate = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (ctrl) => {
    setEditTarget(ctrl);
    setFormData({
      title: ctrl.title || ctrl.control_title || "",
      description: ctrl.description || "",
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
    if (!formData.title) return toast.error("Title is required");
    if (!isClient && !selectedFrameworkId)
      return toast.error("Please select a framework");

    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSaving = (editTarget ? updateMutation : createMutation).isPending;
  const selectedFwName =
    frameworks.find((f) => f.id.toString() === selectedFrameworkId)?.name || "";

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <div className="space-y-6 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isClient ? "My Controls" : "Controls Database"}
          </h1>
          <p className="text-slate-500">
            {isClient
              ? "Controls your company needs to implement."
              : "Manage global controls associated with frameworks."}
          </p>
        </div>
        {!isClient && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200"
          >
            <Plus size={18} /> Add Control
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />
            <input
              type="text"
              placeholder="Search controls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition text-sm"
            />
          </div>

          {!isClient && frameworks.length > 0 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <Layers size={15} className="text-slate-400" />
              <span className="text-sm text-slate-500 font-medium">Framework:</span>
              <select
                value={selectedFrameworkId}
                onChange={(e) => setSelectedFrameworkId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-2 outline-none"
              >
                {frameworks.map((fw) => (
                  <option key={fw.id} value={fw.id}>
                    {fw.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Control</th>
                {isClient && <th className="px-6 py-4 font-medium">Status</th>}
                {!isClient && (
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={2} className="px-6 py-10 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      Loading controls...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-10 text-center text-slate-400">
                    No controls found.
                  </td>
                </tr>
              ) : (
                filtered.map((ctrl, idx) => (
                  <tr
                    key={ctrl.id || idx}
                    className="hover:bg-slate-50/60 transition group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-200 group-hover:scale-105 transition-transform">
                          <Shield size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {ctrl.title || ctrl.control_title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2 max-w-lg">
                            {ctrl.description || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {isClient && (
                      <td className="px-6 py-4 align-top pt-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            STATUS_STYLE[ctrl.status] || STATUS_STYLE.default
                          }`}
                        >
                          {ctrl.status || "PENDING"}
                        </span>
                      </td>
                    )}

                    {!isClient && (
                      <td className="px-6 py-4 text-right align-top pt-5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(ctrl)}
                            title="Edit control"
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(ctrl)}
                            title="Delete control"
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <Shield size={17} className="text-white" />
                </div>
                <h2 className="text-base font-bold text-slate-800">
                  {editTarget ? "Edit Control" : "Add Control"}
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
              {/* Framework badge (read-only when creating) */}
              {!editTarget && selectedFwName && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Target Framework
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700">
                    <Layers size={15} className="text-slate-400" />
                    {selectedFwName}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Control Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm"
                  placeholder="e.g., Access Control Management"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-none text-sm"
                  placeholder="Detail the requirement for this control..."
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
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50 text-sm"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={15} />
                      {editTarget ? "Save Changes" : "Create Control"}
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
                Delete Control?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                <span className="font-semibold text-slate-700">
                  "{deleteTarget.title || deleteTarget.control_title}"
                </span>{" "}
                will be permanently deleted. This cannot be undone.
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
