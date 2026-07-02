import { CalendarDays, Clock, User, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { auditService } from "../../services/audit.service";
import { useAuth } from "../../context/AuthContext";

export default function UpcomingAudits() {
  const { user } = useAuth();
  
  const { data: auditsResp, isLoading } = useQuery({
    queryKey: ["audits", "upcoming", user?.company_id],
    queryFn: () => auditService.getAll().then(res => res.data),
    enabled: !!user?.company_id
  });

  const audits = auditsResp?.data?.audits || auditsResp?.audits || (Array.isArray(auditsResp?.data) ? auditsResp.data : []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <CalendarDays size={18} className="text-indigo-500" />
        <h2 className="text-base font-semibold text-slate-900">Upcoming Audits</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-sm font-medium text-slate-500">Loading audits...</p>
        </div>
      ) : audits.length === 0 ? (
        <div className="text-center py-8">
          <CalendarDays size={36} className="mx-auto text-slate-200 mb-2" />
          <p className="text-sm font-medium text-slate-500">No upcoming audits</p>
          <p className="text-xs text-slate-400 mt-1">
            Your scheduled audits will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {audits.map((a) => (
            <div key={a.id} className="flex flex-col gap-2 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <ShieldCheck size={14} className="text-indigo-600" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.framework_name}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  a.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                  a.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {a.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <User size={12} /> Auditor: <span className="font-medium text-slate-600">{a.auditor_name || 'Unassigned'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {a.start_date ? new Date(a.start_date).toLocaleDateString() : 'TBD'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
