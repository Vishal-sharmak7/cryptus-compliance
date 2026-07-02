import api from "./api";

export const taskService = {
  // Get all tasks for a company or user
  getAll: (companyId) => api.get(`/tasks/company/${companyId}`),
  // Create a new task
  create: (data) => api.post("/tasks", data),
  // Update an existing task
  update: (id, data) => api.put(`/tasks/${id}`, data),
  // Delete a task
  delete: (id) => api.delete(`/tasks/${id}`),
};
