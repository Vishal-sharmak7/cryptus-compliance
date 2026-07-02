import api from "./api";

export const companyFrameworkService = {
  assign: (data) => api.post("/company-frameworks/assign", data),
  getByCompany: (companyId) => api.get(`/company-frameworks/company/${companyId}`),
  deassign: (id) => api.delete(`/company-frameworks/${id}`),
};
