import api from "./api";

export const reportService = {
  getComplianceReport: (companyId) => api.get(`/reports/compliance/${companyId}`),
  getAuditReport: (auditId) => api.get(`/reports/audit/${auditId}`),
  getRiskReport: (companyId) => api.get(`/reports/risk/${companyId}`),
};
