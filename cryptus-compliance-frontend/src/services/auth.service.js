import api from "./api";

export const authService = {
  getProfile: () => api.get("/auth/profile"),
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
};

/** Decode JWT payload without a library */
export function decodeToken(token) {
  try {
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}
