import api from "./api";

export const userService = {
  getAll: () => api.get("/users"),
  create: (data) => api.post("/users", data),
  getAuditors: () => api.get("/users/auditors"),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};
