import api from "./api";

export const auditService = {
  getAll: (params) => api.get("/audits", { params }),
  getById: (id) => api.get(`/audits/${id}`),
  create: (data) => api.post("/audits", data),
  update: (id, data) => api.put(`/audits/${id}`, data),
  delete: (id) => api.delete(`/audits/${id}`),
};
