import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { decodeToken } from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { setUser(null); setLoading(false); return; }
    
    // Check if token itself is expired before making request
    const decoded = decodeToken(token);
    if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Use dynamic import or a dedicated api method to avoid circular deps if needed
      // but auth.service can provide this:
      const { authService } = await import("../services/auth.service.js");
      const res = await authService.getProfile();
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      // Fallback to token if backend call fails (e.g., offline) but token is valid
      setUser(decoded);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = (token) => {
    localStorage.setItem("token", token);
    return loadUser(); // return the promise so callers can await it
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
