import api from "./api";

export const frameworkService = {
  getByCompany: (companyId) =>
    api.get(`/company-frameworks/company/${companyId}`),
  getAll: () => api.get("/frameworks"),
  create: (data) => api.post("/frameworks", data),
  update: (id, data) => api.put(`/frameworks/${id}`, data),
  delete: (id) => api.delete(`/frameworks/${id}`),
};
