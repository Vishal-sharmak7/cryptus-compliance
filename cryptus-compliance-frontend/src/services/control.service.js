import api from "./api";

export const controlService = {
  getByCompany: (companyId) =>
    api.get(`/company-controls/company/${companyId}`),
  getScore: (companyId) =>
    api.get(`/company-controls/score/${companyId}`),
  updateStatus: (id, data) =>
    api.put(`/company-controls/${id}`, data),

  // Admin endpoints
  create: (data) => api.post("/controls", data),
  update: (id, data) => api.put(`/controls/${id}`, data),
  getByFramework: (frameworkId) => api.get(`/controls/framework/${frameworkId}`),
  getAll: () => api.get("/controls"),
  delete: (id) => api.delete(`/controls/${id}`),
};

