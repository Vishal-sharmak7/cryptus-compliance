import { useState, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Upload, FileText, AlertCircle, CheckCircle, Loader2, CloudUpload } from "lucide-react";
import toast from "react-hot-toast";
import { evidenceService } from "../../services/evidence.service";
import { useAuth } from "../../context/AuthContext";

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function EvidenceUploadModal({ open, onClose, controls = [] }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const companyId = user?.company_id || user?.companyId || user?.id || 1;
  const fileInputRef = useRef(null);

  const [file, setFile]               = useState(null);
  const [controlId, setControlId]     = useState("");
  const [dragOver, setDragOver]       = useState(false);

  const { mutate: uploadEvidence, isPending } = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("company_control_id", controlId);
      fd.append("evidence", file);
      return evidenceService.upload(fd);
    },
    onSuccess: () => {
      toast.success("Evidence uploaded successfully!");
      // Invalidate so dashboard stats refresh automatically
      queryClient.invalidateQueries({ queryKey: ["evidence", companyId] });
      handleClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Upload failed. Please try again.");
    },
  });

  const handleClose = () => {
    setFile(null);
    setControlId("");
    setDragOver(false);
    onClose();
  };

  const handleFile = (f) => {
    if (!f) return;
    const maxMB = 10;
    if (f.size > maxMB * 1024 * 1024) {
      toast.error(`File too large. Max size is ${maxMB} MB.`);
      return;
    }
    setFile(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file.");
    if (!controlId) return toast.error("Please select a control.");
    uploadEvidence();
  };

  if (!open) return null;

  const ext = file?.name?.split(".").pop()?.toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeInDown">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <CloudUpload size={18} className="text-indigo-600" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Upload Evidence</h2>
              <p className="text-xs text-slate-400">Max file size 10 MB</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Control selector */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              Select Control <span className="text-red-500">*</span>
            </label>
            {controls.length > 0 ? (
              <select
                value={controlId}
                onChange={(e) => setControlId(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition"
              >
                <option value="">— Choose a control —</option>
                {controls.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.controlName || c.control?.name || c.name || `Control #${c.id}`}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-500">
                <AlertCircle size={14} className="text-amber-500 shrink-0" />
                <input
                  type="number"
                  placeholder="Enter control ID manually"
                  value={controlId}
                  onChange={(e) => setControlId(e.target.value)}
                  required
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
            )}
          </div>

          {/* Dropzone */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              Evidence File <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
                ${dragOver
                  ? "border-indigo-400 bg-indigo-50"
                  : file
                  ? "border-green-300 bg-green-50"
                  : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50"
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />

              {file ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-left">
                    <span className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      {isImage
                        ? <img src={URL.createObjectURL(file)} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        : <FileText size={18} className="text-indigo-500" />
                      }
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate max-w-[220px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); fileInputRef.current.value = ""; }}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition shrink-0"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={24} className={`mx-auto mb-2 ${dragOver ? "text-indigo-500" : "text-slate-300"}`} />
                  <p className="text-sm font-medium text-slate-600">
                    Drag & drop file here, or <span className="text-indigo-600">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PDF, DOC, DOCX, XLS, PNG, JPG — Max 10 MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !file || !controlId}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all
                bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isPending ? (
                <><Loader2 size={15} className="animate-spin" /> Uploading…</>
              ) : (
                <><CheckCircle size={15} /> Upload Evidence</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
