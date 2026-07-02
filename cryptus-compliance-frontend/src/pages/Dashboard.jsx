import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./dashboards/AdminDashboard";
import AuditorDashboard from "./dashboards/AuditorDashboard";
import ClientDashboard from "./dashboards/ClientDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "SUPER_ADMIN") {
    return <AdminDashboard />;
  }

  if (user.role === "CLIENT") {
    return <ClientDashboard />;
  }

  if (user.role === "AUDITOR") {
    return <AuditorDashboard />;
  }

  return <div>Unknown Role</div>;
}
