import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../services/dashboard.service";
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import QuickActions from "../../components/dashboard/QuickActions";
import UpcomingAudits from "../../components/dashboard/UpcomingAudits";
import RiskOverview from "../../components/dashboard/RiskOverview";
import EvidenceUploadModal from "../../components/dashboard/EvidenceUploadModal";
import { useAuth } from "../../context/AuthContext";

export default function ClientDashboard() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { user } = useAuth();
  const companyId = user?.companyId || user?.company_id || 1; // Fallback to 1 for dev if needed

  // Use the new aggregated client dashboard endpoint
  const { data: dashboardData, isLoading: dashLoading } = useQuery({
    queryKey: ["clientDashboard"],
    queryFn: () => dashboardService.getClientDashboard().then(res => res.data.data),
    staleTime: 30_000,
  });

  // Fetch controls for the upload modal
  const { data: controlsData } = useQuery({
    queryKey: ["controls", companyId],
    queryFn: () => dashboardService.getControls(companyId).then((r) => r.data),
    enabled: !!companyId,
    staleTime: 30_000,
  });

  if (dashLoading) return <DashboardSkeleton />;

  const stats = dashboardData || {};
  const controlsList = Array.isArray(controlsData) ? controlsData : controlsData?.data ?? [];

  return (
    <div className="space-y-6">
      <WelcomeCard />

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Frameworks", value: stats.frameworks || 0 },
          { label: "Controls", value: `${stats.completedControls || 0} / ${stats.controls || 0}` },
          { label: "Evidence", value: stats.evidence || 0 },
          { label: "Open Findings", value: stats.openFindings || 0 }
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <p className="text-3xl font-bold text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
             <h3 className="text-lg font-bold text-slate-800 mb-2">Compliance Score</h3>
             <div className="text-5xl font-black text-indigo-600">{stats.complianceScore || 0}%</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
             <QuickActions onUploadClick={() => setUploadModalOpen(true)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingAudits />
        <RiskOverview />
      </div>

      <EvidenceUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        controls={controlsList}
      />
    </div>
  );
}
