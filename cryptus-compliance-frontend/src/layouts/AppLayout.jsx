import { useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  LayoutDashboard, ShieldCheck, ClipboardList, Layers, FileText,
  AlertTriangle, CheckSquare, Settings, LogOut, Menu, X, Bell, Home, ChevronRight, Users, Building2, ClipboardCheck, ShieldAlert
} from "lucide-react";

// Sidebar Navigation config based on role
const getNavItems = (role) => {
  const NAV_ITEMS = {
    SUPER_ADMIN: [
      { label: "Dashboard",  icon: LayoutDashboard, to: "/app/dashboard" },
      { label: "Users",      icon: Users,           to: "/app/users" },
      { label: "Companies",  icon: Building2,       to: "/app/companies" },
      { label: "Audits",     icon: ClipboardCheck,  to: "/app/audits" },
      { label: "Frameworks", icon: Layers,          to: "/app/frameworks" },
      { label: "Controls",   icon: ShieldCheck,     to: "/app/controls" },
      { label: "Reports",    icon: FileText,        to: "/app/reports" },
      { label: "Settings",   icon: Settings,        to: "/app/settings" },
    ],
    AUDITOR: [
      { label: "Dashboard",       icon: LayoutDashboard, to: "/app/dashboard" },
      { label: "Companies",       icon: Building2,       to: "/app/companies" },
      { label: "Evidence Review", icon: ClipboardList,   to: "/app/evidence" },
      { label: "Audits",          icon: ClipboardCheck,  to: "/app/audits" },
      { label: "Findings",        icon: AlertTriangle,   to: "/app/findings" },
      { label: "Risks",           icon: ShieldAlert,     to: "/app/risks" },
      { label: "Tasks",           icon: CheckSquare,     to: "/app/tasks" },
      { label: "Reports",         icon: FileText,        to: "/app/reports" },
      { label: "Settings",        icon: Settings,        to: "/app/settings" },
    ],
    CLIENT: [
      { label: "Dashboard",  icon: LayoutDashboard, to: "/app/dashboard" },
      { label: "Audits",     icon: ClipboardCheck,  to: "/app/audits" },
      { label: "Frameworks", icon: Layers,          to: "/app/frameworks" },
      { label: "Controls",   icon: ShieldCheck,     to: "/app/controls" },
      { label: "Evidence",   icon: FileText,        to: "/app/evidence" },
      { label: "Risks",      icon: ShieldAlert,     to: "/app/risks" },
      { label: "Tasks",      icon: CheckSquare,     to: "/app/tasks" },
      { label: "Settings",   icon: Settings,        to: "/app/settings" },
    ],
  };
  return NAV_ITEMS[role] || [];
};

function Sidebar({ open, onClose, user, logout }) {
  const navItems = getNavItems(user?.role);
  const initials = user?.name ? user.name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase() : "U";

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-40 flex flex-col shadow-xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:shadow-none lg:z-auto`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <ShieldCheck size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">Cryptus</span>
            <span className="text-sm font-bold text-indigo-600">Compliance</span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {user?.role === "SUPER_ADMIN" ? "Admin" : user?.role === "AUDITOR" ? "Auditor" : "Client"} Portal
          </div>
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                  {label}
                  {isActive && <ChevronRight size={14} className="ml-auto text-indigo-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4 space-y-2">
          <div className="flex items-center gap-3 px-2 py-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{initials}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.companyId ? "Client" : user?.role}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ onMenuClick, user }) {
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition">
          <Menu size={18} />
        </button>
        <nav className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400">
          <Link to="/" className="hover:text-slate-600 transition flex items-center gap-1"><Home size={13} /> Home</Link>
          <ChevronRight size={13} />
          <span className="text-slate-900 font-medium">Dashboard</span>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
      </div>
    </header>
  );
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} logout={handleLogout} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
