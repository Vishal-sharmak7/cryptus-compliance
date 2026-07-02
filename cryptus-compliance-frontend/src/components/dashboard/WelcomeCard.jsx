import { Shield, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function WelcomeCard() {
  const { user } = useAuth();
  const name = user?.name || "User";
  const role = user?.role || "Client";
  const company = user?.company_name || user?.companyName || "Your Company";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {name} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Track your compliance progress and stay audit-ready.
        </p>
        <div className="flex items-center gap-3 mt-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-full">
            <Shield size={12} />
            {role.toUpperCase()}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full">
            <Building2 size={12} />
            {company}
          </span>
        </div>
      </div>
      <div className="text-right hidden sm:block">
        <p className="text-xs text-slate-400">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
