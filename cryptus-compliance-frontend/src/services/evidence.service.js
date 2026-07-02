import api from "./api";

export const evidenceService = {
  getByCompanyControl: (id) =>
    api.get(`/evidence/company-control/${id}`),
  getByCompany: (companyId) =>
    api.get(`/evidence/company/${companyId}`),
  getMyEvidence: () =>
    api.get("/evidence/my"),
  getAuditorEvidence: () =>
    api.get("/evidence/auditor"),
  upload: (formData) =>
    api.post("/evidence/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  review: (id, data) => api.put(`/evidence/${id}/review`, data),
  delete: (id) => api.delete(`/evidence/${id}`),
};

/** Build a URL to serve/download an uploaded file */
export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  return `http://localhost:5000/${filePath.replace(/\\/g, "/")}`;
};
