import api from "./api";

export const dashboardService = {
  // Legacy / specific data
  getScore: (companyId) => api.get(`/company-controls/score/${companyId}`),
  getFrameworks: (companyId) => api.get(`/company-frameworks/company/${companyId}`),
  getControls: (companyId) => api.get(`/company-controls/company/${companyId}`),
  getEvidence: (companyId) => api.get(`/evidence/company/${companyId}`),

  // Unified dashboard endpoints
  getClientDashboard: () => api.get("/dashboard/client"),
  getAdminDashboard: () => api.get("/dashboard/admin"),
  getAuditorDashboard: () => api.get("/dashboard/auditor"),
};
