import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../services/dashboard.service";
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton";
import { LayoutDashboard, Users, ShieldCheck, ClipboardList, FileText, AlertTriangle, Building2, CheckSquare } from "lucide-react";

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: () => dashboardService.getAdminDashboard().then(res => res.data.data),
    staleTime: 30_000,
  });

  if (isLoading) return <DashboardSkeleton />;

  const platform = data?.platform || {};
  const byCompany = data?.byCompany || [];

  const stats = [
    { label: "Total Companies", value: platform.companies, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Users", value: platform.users, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Active Frameworks", value: platform.frameworks, icon: LayoutDashboard, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Controls", value: platform.controls, icon: ClipboardList, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Evidence Uploaded", value: platform.evidence, icon: FileText, color: "text-cyan-600", bg: "bg-cyan-50" },
    { label: "Active Audits", value: platform.audits, icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Open Findings", value: platform.openFindings, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Open Risks", value: platform.openRisks, icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="text-slate-500">System-wide statistics and company performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value || 0}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Company Progress</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Company Name</th>
                <th className="px-6 py-4 font-medium">Controls Implemented</th>
                <th className="px-6 py-4 font-medium">Completion %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {byCompany.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-500">No company data available.</td>
                </tr>
              )}
              {byCompany.map((comp, i) => {
                const total = Number(comp.controls || 0);
                const completed = Number(comp.completed || 0);
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
                
                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">{comp.name}</td>
                    <td className="px-6 py-4 text-slate-600">{completed} / {total}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-slate-100 rounded-full h-2 max-w-[120px]">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-slate-600 text-xs font-medium">{percent}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
