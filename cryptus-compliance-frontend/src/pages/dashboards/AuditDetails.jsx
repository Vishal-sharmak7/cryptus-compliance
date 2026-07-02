import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auditService } from "../../services/audit.service";
import { FileText, Building, ShieldCheck, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AuditDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: auditResp, isLoading } = useQuery({
    queryKey: ["audit", id],
    queryFn: () => auditService.getById(id).then(res => res.data),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => auditService.update(id, data),
    onSuccess: () => {
      toast.success("Audit updated successfully");
      queryClient.invalidateQueries({ queryKey: ["audit", id] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update audit")
  });

  const audit = auditResp?.audit || auditResp || {};

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading audit details...</div>;
  if (!audit.id) return <div className="p-8 text-center text-slate-500">Audit not found.</div>;

  const handleStatusChange = (status) => {
    updateMutation.mutate({ status });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{audit.title}</h1>
          <p className="text-slate-500">Review client evidence and track compliance progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Evidence Review</h2>
            </div>
            <div className="p-8 text-center text-slate-500">
              <FileText size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="mb-2 text-slate-800 font-medium">Evidence submitted by client will appear here.</p>
              <p className="text-sm">This section is ready to be connected to the Evidence Management API.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Audit Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Company</p>
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <Building size={16} className="text-slate-400" />
                  {audit.company_name || `Company ID: ${audit.company_id}`}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Framework</p>
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  {audit.framework_name || `Framework ID: ${audit.framework_id}`}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  audit.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                  audit.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {audit.status || 'PLANNED'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => handleStatusChange("IN_PROGRESS")}
                disabled={audit.status === "IN_PROGRESS" || updateMutation.isPending}
                className="w-full py-2.5 px-4 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Mark In Progress
              </button>
              <button 
                onClick={() => handleStatusChange("COMPLETED")}
                disabled={audit.status === "COMPLETED" || updateMutation.isPending}
                className="w-full py-2.5 px-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle size={18} /> Complete Audit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
