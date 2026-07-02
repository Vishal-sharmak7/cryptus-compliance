import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { evidenceService, getFileUrl } from "../../services/evidence.service";
import { useAuth } from "../../context/AuthContext";
import {
  FileText, FileImage, FileSpreadsheet, File, Plus, Search,
  Trash2, X, Download, Upload, CheckCircle, Clock, XCircle,
  Eye, Building2, ThumbsUp, ThumbsDown, MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

// ── helpers ───────────────────────────────────────────────────────────────────

function getFileIcon(fileName) {
  if (!fileName) return <File size={20} className="text-slate-400" />;
  const ext = fileName.split(".").pop().toLowerCase();
  if (["jpg","jpeg","png","gif","svg","webp"].includes(ext))
    return <FileImage size={20} className="text-emerald-500" />;
  if (["xls","xlsx","csv"].includes(ext))
    return <FileSpreadsheet size={20} className="text-green-600" />;
  if (["pdf"].includes(ext))
    return <FileText size={20} className="text-red-500" />;
  if (["doc","docx"].includes(ext))
    return <FileText size={20} className="text-blue-500" />;
  return <File size={20} className="text-indigo-500" />;
}

function StatusBadge({ status }) {
  const map = {
    PENDING:  { label: "Pending Review", cls: "bg-amber-50 text-amber-700 border-amber-200",     Icon: Clock },
    APPROVED: { label: "Approved",       cls: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircle },
    REJECTED: { label: "Rejected",       cls: "bg-red-50 text-red-700 border-red-200",            Icon: XCircle },
  };
  const { label, cls, Icon } = map[status] || map.PENDING;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>
      <Icon size={12} /> {label}
    </span>
  );
}

function fmt(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}

function normalise(raw) {
  const d = raw?.data ?? raw;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.evidence)) return d.evidence;
  return [];
}

// ── Review modal (auditor) ────────────────────────────────────────────────────
function ReviewModal({ ev, onClose, onSubmit, isPending }) {
  const [status, setStatus]   = useState("APPROVED");
  const [comments, setComments] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
              <MessageSquare size={16} className="text-violet-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Review Evidence</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1 transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Evidence info */}
          <div className="bg-slate-50 rounded-xl p-3 flex items-start gap-3">
            {getFileIcon(ev.file_name)}
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate">{ev.title || ev.file_name}</p>
              <p className="text-xs text-slate-400 mt-0.5">Uploaded by {ev.uploaded_by_name || "Client"} · {fmt(ev.created_at)}</p>
            </div>
          </div>

          {/* Status toggle */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Decision *</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button"
                onClick={() => setStatus("APPROVED")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm border-2 transition ${
                  status === "APPROVED"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 text-slate-500 hover:border-emerald-300"
                }`}>
                <ThumbsUp size={16} /> Approve
              </button>
              <button type="button"
                onClick={() => setStatus("REJECTED")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm border-2 transition ${
                  status === "REJECTED"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-slate-200 text-slate-500 hover:border-red-300"
                }`}>
                <ThumbsDown size={16} /> Reject
              </button>
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Comments {status === "REJECTED" && <span className="text-red-500">*</span>}
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={status === "APPROVED" ? "Optional remarks…" : "Reason for rejection (required)"}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition text-sm">
              Cancel
            </button>
            <button
              onClick={() => {
                if (status === "REJECTED" && !comments.trim())
                  return toast.error("Please provide a reason for rejection");
                onSubmit({ status, comments: comments.trim() });
              }}
              disabled={isPending}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition disabled:opacity-50 ${
                status === "APPROVED"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}>
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : status === "APPROVED" ? (
                <><ThumbsUp size={15} /> Approve</>
              ) : (
                <><ThumbsDown size={15} /> Reject</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function EvidenceManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isClient  = user?.role === "CLIENT";
  const isAuditor = user?.role === "AUDITOR";

  const [searchTerm, setSearchTerm]     = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null); // evidence item being reviewed
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver]         = useState(false);
  const [formData, setFormData]         = useState({ title: "", description: "" });

  // ── fetch ────────────────────────────────────────────────────────
  const queryKey = isAuditor ? ["evidence", "auditor"] : ["evidence", "my"];
  const { data: rawData, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      isAuditor
        ? evidenceService.getAuditorEvidence()
        : evidenceService.getMyEvidence(),
  });

  const evidences = normalise(rawData);

  // filter
  const filtered = evidences.filter((e) => {
    const q = searchTerm.toLowerCase();
    const matchQ =
      (e.title || e.file_name || "").toLowerCase().includes(q) ||
      (e.description || "").toLowerCase().includes(q) ||
      (e.uploaded_by_name || "").toLowerCase().includes(q) ||
      (e.company_name || "").toLowerCase().includes(q);
    const matchStatus = filterStatus === "ALL" || e.status === filterStatus;
    return matchQ && matchStatus;
  });

  // counts
  const counts = {
    ALL:      evidences.length,
    PENDING:  evidences.filter(e => e.status === "PENDING").length,
    APPROVED: evidences.filter(e => e.status === "APPROVED").length,
    REJECTED: evidences.filter(e => e.status === "REJECTED").length,
  };

  // ── mutations ────────────────────────────────────────────────────
  const uploadMutation = useMutation({
    mutationFn: (fd) => evidenceService.upload(fd),
    onSuccess: () => {
      toast.success("Evidence uploaded successfully!");
      queryClient.invalidateQueries({ queryKey });
      closeUploadModal();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Upload failed"),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, ...data }) => evidenceService.review(id, data),
    onSuccess: (_, vars) => {
      toast.success(`Evidence ${vars.status === "APPROVED" ? "approved ✅" : "rejected ❌"}`);
      queryClient.invalidateQueries({ queryKey });
      setReviewTarget(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Review failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => evidenceService.delete(id),
    onSuccess: () => {
      toast.success("Evidence deleted.");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Delete failed"),
  });

  // ── handlers ─────────────────────────────────────────────────────
  const closeUploadModal = () => {
    setIsModalOpen(false);
    setFormData({ title: "", description: "" });
    setSelectedFile(null);
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setSelectedFile(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error("Title is required");
    if (!selectedFile) return toast.error("Please select a file");
    const fd = new FormData();
    fd.append("title", formData.title.trim());
    fd.append("description", formData.description.trim());
    fd.append("file", selectedFile);
    uploadMutation.mutate(fd);
  };

  // ── render ────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Evidence Management</h1>
          <p className="text-slate-500 mt-0.5">
            {isAuditor
              ? "Review evidence submitted by your assigned companies."
              : "Upload and track your compliance evidence files."}
          </p>
        </div>
        {isClient && (
          <button onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 active:scale-95 transition shadow-sm">
            <Plus size={18} /> Upload Evidence
          </button>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "ALL",      label: "All" },
          { key: "PENDING",  label: "Pending Review" },
          { key: "APPROVED", label: "Approved" },
          { key: "REJECTED", label: "Rejected" },
        ].map(({ key, label }) => (
          <button key={key}
            onClick={() => setFilterStatus(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
              filterStatus === key
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            }`}>
            {label}
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
              filterStatus === key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
            }`}>{counts[key]}</span>
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input type="text"
              placeholder="Search evidence…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-medium">Evidence</th>
                {isAuditor && <th className="px-6 py-3 font-medium">Company</th>}
                <th className="px-6 py-3 font-medium">Uploaded By</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={isAuditor ? 6 : 5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Loading evidence…</span>
                  </div>
                </td></tr>
              ) : isError ? (
                <tr><td colSpan={isAuditor ? 6 : 5} className="px-6 py-10 text-center text-red-500 text-sm">
                  Failed to load evidence. Please refresh.
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={isAuditor ? 6 : 5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Upload size={40} className="text-slate-200" />
                    <p className="text-sm font-medium">
                      {searchTerm || filterStatus !== "ALL"
                        ? "No evidence matches your filter."
                        : isAuditor
                        ? "No evidence has been submitted by your assigned companies yet."
                        : "No evidence uploaded yet."}
                    </p>
                    {!searchTerm && filterStatus === "ALL" && isClient && (
                      <button onClick={() => setIsModalOpen(true)}
                        className="mt-1 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">
                        Upload your first evidence
                      </button>
                    )}
                  </div>
                </td></tr>
              ) : (
                filtered.map((ev, idx) => {
                  const fileUrl = getFileUrl(ev.file_path);
                  return (
                    <tr key={ev.id || idx} className="hover:bg-indigo-50/20 transition-colors group">
                      {/* Evidence title + filename */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0">{getFileIcon(ev.file_name)}</div>
                          <div>
                            <p className="font-semibold text-slate-800">{ev.title || ev.file_name}</p>
                            <p className="text-xs text-slate-400 mt-0.5 font-mono truncate max-w-[180px]">{ev.file_name}</p>
                            {ev.description && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ev.description}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Company (auditor only) */}
                      {isAuditor && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Building2 size={14} className="text-slate-400 flex-shrink-0" />
                            <span className="text-sm">{ev.company_name || "—"}</span>
                          </div>
                        </td>
                      )}

                      {/* Uploaded by */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{ev.uploaded_by_name || "—"}</span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={ev.status || "PENDING"} />
                        {ev.status === "REJECTED" && ev.comments && (
                          <p className="mt-1 text-xs text-red-500 max-w-[160px] line-clamp-1" title={ev.comments}>
                            {ev.comments}
                          </p>
                        )}
                        {ev.status === "APPROVED" && ev.reviewed_by_name && (
                          <p className="mt-1 text-xs text-slate-400">by {ev.reviewed_by_name}</p>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{fmt(ev.created_at)}</td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {fileUrl && (
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" title="View"
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                              <Eye size={16} />
                            </a>
                          )}
                          {fileUrl && (
                            <a href={fileUrl} download title="Download"
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
                              <Download size={16} />
                            </a>
                          )}
                          {/* Auditor: Review button (only for PENDING) */}
                          {isAuditor && ev.status === "PENDING" && (
                            <button onClick={() => setReviewTarget(ev)} title="Review"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-medium hover:bg-violet-700 transition">
                              <MessageSquare size={13} /> Review
                            </button>
                          )}
                          {/* Client: Delete own evidence */}
                          {isClient && (
                            <button onClick={() => {
                              if (!window.confirm(`Delete "${ev.title || ev.file_name}"?`)) return;
                              deleteMutation.mutate(ev.id);
                            }}
                              disabled={deleteMutation.isPending}
                              title="Delete"
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Review Modal (Auditor) ──────────────────────────────── */}
      {reviewTarget && (
        <ReviewModal
          ev={reviewTarget}
          onClose={() => setReviewTarget(null)}
          isPending={reviewMutation.isPending}
          onSubmit={(data) => reviewMutation.mutate({ id: reviewTarget.id, ...data })}
        />
      )}

      {/* ── Upload Modal (Client) ───────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
             onClick={(e) => e.target === e.currentTarget && closeUploadModal()}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Upload size={16} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Upload Evidence</h2>
              </div>
              <button onClick={closeUploadModal} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1 transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
                  placeholder="e.g., Security Policy Document" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows={2} value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none text-sm"
                  placeholder="Brief description of what this evidence proves…" />
              </div>
              {/* Drop zone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File <span className="text-red-500">*</span></label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("ev-file-input").click()}
                  className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition ${
                    dragOver ? "border-indigo-500 bg-indigo-50"
                    : selectedFile ? "border-emerald-400 bg-emerald-50"
                    : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50"
                  }`}>
                  <input id="ev-file-input" type="file" className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.txt,.zip" />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      {getFileIcon(selectedFile.name)}
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-700 truncate max-w-[240px]">{selectedFile.name}</p>
                        <p className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB · click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400">
                      <Upload size={28} className="mx-auto mb-2 text-slate-300" />
                      <p className="text-sm">Drag & drop or <span className="text-indigo-600 font-medium">browse</span></p>
                      <p className="text-xs mt-1">PDF, Word, Excel, Images, ZIP</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={closeUploadModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={uploadMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition text-sm disabled:opacity-50">
                  {uploadMutation.isPending
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading…</>
                    : <><Upload size={16} /> Upload</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
