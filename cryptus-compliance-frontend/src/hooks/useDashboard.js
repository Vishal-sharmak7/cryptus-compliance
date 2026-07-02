import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";
import { useAuth } from "../context/AuthContext";

export function useDashboard() {
  const { user } = useAuth();
  const companyId = user?.company_id || user?.companyId || user?.id || null;

  const score = useQuery({
    queryKey: ["score", companyId],
    queryFn: () => dashboardService.getScore(companyId).then((r) => r.data),
    enabled: !!companyId,
    staleTime: 30_000,
  });

  const frameworks = useQuery({
    queryKey: ["frameworks", companyId],
    queryFn: () => dashboardService.getFrameworks(companyId).then((r) => r.data),
    enabled: !!companyId,
    staleTime: 30_000,
  });

  const controls = useQuery({
    queryKey: ["controls", companyId],
    queryFn: () => dashboardService.getControls(companyId).then((r) => r.data),
    enabled: !!companyId,
    staleTime: 30_000,
  });

  const evidence = useQuery({
    queryKey: ["evidence", companyId],
    queryFn: () => dashboardService.getEvidence(companyId).then((r) => r.data),
    enabled: !!companyId,
    staleTime: 30_000,
  });

  const isLoading =
    score.isLoading || frameworks.isLoading || controls.isLoading || evidence.isLoading;

  return {
    companyId,
    score,
    frameworks,
    controls,
    evidence,
    isLoading,
  };
}
