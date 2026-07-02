import api from "./api";

export const findingService = {
  // Get all findings (with query params)
  getAll: (params) => api.get("/findings", { params }),
  // Get all findings for a specific company
  getByCompany: (companyId) => api.get(`/findings/company/${companyId}`),
  // Create a new finding
  create: (data) => api.post("/findings", data),
  // Delete a finding
  delete: (id) => api.delete(`/findings/${id}`),
};
