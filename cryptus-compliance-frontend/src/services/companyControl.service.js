import api from "./api";

export const companyControlService = {
  getByCompany: (companyId) => api.get(`/company-controls/company/${companyId}`),
  getScore: (companyId) => api.get(`/company-controls/score/${companyId}`),
  updateStatus: (id, data) => api.put(`/company-controls/${id}/status`, data),
  assign: (data) => api.post("/company-controls/assign", data),
  deassign: (id) => api.delete(`/company-controls/${id}`),
};
