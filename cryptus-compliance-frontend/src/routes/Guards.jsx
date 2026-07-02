import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Redirect unauthenticated users to /login */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="h-screen flex items-center justify-center text-slate-400 text-sm">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

/** Only allow certain roles; redirect others to their home */
export function RoleRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return children;
}
