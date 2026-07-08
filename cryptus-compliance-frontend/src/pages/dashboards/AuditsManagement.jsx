import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { auditService } from "../../services/audit.service";
import { companyService } from "../../services/company.service";
import { frameworkService } from "../../services/framework.service";
import { userService } from "../../services/user.service";
import { FileText, Plus, Search, Edit2, Trash2, X, Building, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AuditsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAudit, setEditingAudit] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", framework_id: "", company_id: "", auditor_id: "", start_date: "", end_date: "" });
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: auditsResp, isLoading } = useQuery({
    queryKey: ["audits"],
    queryFn: () => auditService.getAll().then(res => res.data),
  });

  const { data: companiesResp } = useQuery({ queryKey: ["companies"], queryFn: () => companyService.getAll().then(res => res.data) });
  const { data: frameworksResp } = useQuery({ queryKey: ["frameworks", "all"], queryFn: () => frameworkService.getAll().then(res => res.data) });
  const { data: auditorsResp } = useQuery({ queryKey: ["auditors"], queryFn: () => userService.getAuditors().then(res => res.data) });

  const createMutation = useMutation({
    mutationFn: (data) => auditService.create(data),
    onSuccess: () => {
      toast.success("Audit assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      setIsModalOpen(false);
      setFormData({ title: "", description: "", framework_id: "", company_id: "", auditor_id: "", start_date: "", end_date: "" });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create audit")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => auditService.update(id, data),
    onSuccess: () => {
      toast.success("Audit updated successfully");
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      setIsModalOpen(false);
      setEditingAudit(null);
      setFormData({ title: "", description: "", framework_id: "", company_id: "", auditor_id: "", start_date: "", end_date: "" });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update audit")
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => auditService.delete(id),
    onSuccess: () => {
      toast.success("Audit deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["audits"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete audit")
  });

  const handleEdit = (audit) => {
    setEditingAudit(audit);
    setFormData({
      title: audit.title || "",
      description: audit.description || "",
      framework_id: audit.framework_id || "",
      company_id: audit.company_id || "",
      auditor_id: audit.auditor_id || "",
      start_date: audit.start_date ? new Date(audit.start_date).toISOString().split('T')[0] : "",
      end_date: audit.end_date ? new Date(audit.end_date).toISOString().split('T')[0] : ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this audit?")) {
      deleteMutation.mutate(id);
    }
  };

  const audits = auditsResp?.data?.audits || auditsResp?.audits || (Array.isArray(auditsResp?.data) ? auditsResp.data : []);
  const companies = companiesResp?.companies || [];
  const frameworks = frameworksResp?.frameworks || [];
  const auditors = auditorsResp?.auditors || [];

  const filteredAudits = audits.filter(a => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.auditor_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company_id || !formData.framework_id || !formData.auditor_id) return toast.error("Required fields missing");
    
    const payload = {
      title: formData.title,
      description: formData.description || undefined,
      company_id: Number(formData.company_id),
      framework_id: Number(formData.framework_id),
      auditor_id: Number(formData.auditor_id),
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
    };

    if (editingAudit) {
      updateMutation.mutate({ id: editingAudit.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {user?.role === "CLIENT" ? "My Audits" : "Audits Management"}
          </h1>
          <p className="text-slate-500">
            {user?.role === "CLIENT"
              ? "Track your company compliance audits and verification milestones."
              : "Assign auditors to companies and track compliance progress."}
          </p>
        </div>
        {user?.role !== "CLIENT" && (
          <button 
            onClick={() => {
              setEditingAudit(null);
              setFormData({ title: "", description: "", framework_id: "", company_id: "", auditor_id: "", start_date: "", end_date: "" });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            <Plus size={18} /> Assign Audit
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search audits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Audit Title</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Framework</th>
                <th className="px-6 py-4 font-medium">Auditor</th>
                <th className="px-6 py-4 font-medium">Status</th>
                {user?.role !== "CLIENT" && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading audits...</td>
                </tr>
              ) : filteredAudits.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No audits found.</td>
                </tr>
              ) : (
                filteredAudits.map((a, idx) => (
                  <tr 
                    key={a.id || idx} 
                    onClick={() => navigate(`/app/audits/${a.id}`)}
                    className="hover:bg-indigo-50/30 transition cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <FileText size={20} />
                        </div>
                        <p className="font-medium text-slate-900">{a.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building size={14} className="text-slate-400" />
                        {a.company_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        {a.framework_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{a.auditor_name || "Unassigned"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        a.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        a.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {a.status || 'PLANNED'}
                      </span>
                    </td>
                    {user?.role !== "CLIENT" && (
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(a)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit Audit"
                          >
                            <Edit2 size={15} />
                          </button>
                          {user?.role === "SUPER_ADMIN" && (
                            <button
                              onClick={() => handleDelete(a.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                              title="Delete Audit"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-slate-800">
                {editingAudit ? "Edit Audit" : "Assign Audit"}
              </h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAudit(null);
                }} 
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Audit Title *</label>
                <input
                  type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  placeholder="e.g., Q3 SOC 2 Audit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
                <select required value={formData.company_id} onChange={e => setFormData({...formData, company_id: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none">
                  <option value="">Select Company</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Framework *</label>
                <select required value={formData.framework_id} onChange={e => setFormData({...formData, framework_id: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none">
                  <option value="">Select Framework</option>
                  {frameworks.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Auditor *</label>
                <select required value={formData.auditor_id} onChange={e => setFormData({...formData, auditor_id: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none">
                  <option value="">Select Auditor</option>
                  {auditors.map(a => <option key={a.id} value={a.id}>{a.name} ({a.email})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none" />
                </div>
              </div>
              
              <div className="pt-2 flex gap-3 sticky bottom-0 bg-white">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAudit(null);
                  }} 
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending} 
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium disabled:opacity-50"
                >
                  {editingAudit ? "Save Changes" : "Assign Audit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
