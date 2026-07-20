import { useQuery } from "@tanstack/react-query";
import { riskService } from "../../services/risk.service";
import { useAuth } from "../../context/AuthContext";
import { ShieldAlert } from "lucide-react";

export default function RiskOverview() {
  const { user } = useAuth();
  const isClient = user?.role === "CLIENT";
  const companyId = user?.companyId || user?.company_id;

  const { data: response, isLoading } = useQuery({
    queryKey: ["risks", isClient ? companyId : "all"],
    queryFn: () => isClient ? riskService.getByCompany(companyId) : riskService.getAll(),
    enabled: !!user,
  });

  const rawRisks = response?.data?.data || response?.data || response || [];
  const risksList = Array.isArray(rawRisks) ? rawRisks : Array.isArray(rawRisks.risks) ? rawRisks.risks : [];

  const openRisks = risksList.filter((r) => r.status === "OPEN" || r.status === "Open" || r.status === "open");
  const critical = openRisks.filter((r) => r.severity === "CRITICAL").length;
  const high = openRisks.filter((r) => r.severity === "HIGH").length;
  const medium = openRisks.filter((r) => r.severity === "MEDIUM").length;
  const low = openRisks.filter((r) => r.severity === "LOW").length;
  const totalOpen = openRisks.length;

  const RISKS = [
    { label: "Open Risks", value: totalOpen, color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200" },
    { label: "Critical", value: critical, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
    { label: "High", value: high, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
    { label: "Medium", value: medium, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "Low", value: low, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <ShieldAlert size={18} className="text-rose-500" />
        <h2 className="text-base font-semibold text-slate-900">Risk Overview</h2>
      </div>
      {isLoading ? (
        <div className="text-center text-sm text-slate-500 py-8">Loading risks...</div>
      ) : (
        <div className="space-y-2.5">
          {RISKS.map(({ label, value, color, bg, border }) => (
            <div
              key={label}
              className={`flex items-center justify-between px-4 py-2.5 border ${border} ${bg} rounded-xl`}
            >
              <span className={`text-sm font-medium ${color}`}>{label}</span>
              <span className={`text-lg font-bold ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
