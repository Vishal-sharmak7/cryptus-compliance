import api from "./api";

export const riskService = {
  getAll: () => api.get("/risks"),
  getByCompany: (companyId) => api.get(`/risks/company/${companyId}`),
  create: (data) => api.post("/risks", data),
  update: (id, data) => api.put(`/risks/${id}`, data),
  delete: (id) => api.delete(`/risks/${id}`),
};
