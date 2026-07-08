import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// ── Pages ────────────────────────────────────────────────────────────
import Home from "./components/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import FeaturesPage from "./pages/Features";
import FrameworksPage from "./pages/Frameworks";
import FrameworkCard from "./pages/FrameworkCard";
import PricingPage from "./pages/Pricing";
import ResourcesPage from "./pages/Resources";
import FrameworkControlsPage from "./pages/FrameworkControllers/FrameworkControlsPage";
import FrameworkControlDetail from "./pages/FrameworkControllers/FrameworkControlDetail";

// ── App Pages ────────────────────────────────────────────────────────
import Dashboard from "./pages/Dashboard";
import FrameworksManagement from "./pages/dashboards/FrameworksManagement";
import ControlsManagement from "./pages/dashboards/ControlsManagement";
import CompaniesManagement from "./pages/dashboards/CompaniesManagement";
import UsersManagement from "./pages/dashboards/UsersManagement";
import AuditsManagement from "./pages/dashboards/AuditsManagement";
import AuditDetails from "./pages/dashboards/AuditDetails";
import EvidenceManagement from "./pages/dashboards/EvidenceManagement";
import TaskManagement from "./pages/dashboards/TaskManagement";
import FindingManagement from "./pages/dashboards/FindingManagement";
import CompanyDetail from "./pages/dashboards/CompanyDetail";
import RiskManagement from "./pages/dashboards/RiskManagement";

// ── Layouts & Guards ─────────────────────────────────────────────────
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import AppLayout from "./layouts/AppLayout";
import { ProtectedRoute, RoleRoute } from "./routes/Guards";

// Temporary placeholder for missing pages
const Placeholder = ({ title }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-[60vh]">
    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
    <p className="text-slate-500">This module is under construction.</p>
  </div>
);

function AppRoutes() {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith("/app");
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!isAppRoute && !isAuthPage && <Header />}
      {!isAppRoute && <ScrollToTop />}

      <main
        className={`flex-1 ${!isAppRoute && !isAuthPage ? "pt-[70px]" : ""}`}
      >
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/frameworks" element={<FrameworksPage />} />
          <Route path="/framework-card/:slug" element={<FrameworkCard />} />
          <Route path="/framework-card-controller/:slug" element={<FrameworkControlsPage />} />
          <Route path="/framework-card-controller/:slug/:controlId" element={<FrameworkControlDetail />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/resources" element={<ResourcesPage />} />

          {/* Protected App Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Default redirect based on role could go here, for now default to dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />

            {/* SUPER_ADMIN only */}
            <Route
              path="users"
              element={
                <RoleRoute roles={["SUPER_ADMIN"]}>
                  <UsersManagement />
                </RoleRoute>
              }
            />
            
            {/* SUPER_ADMIN & AUDITOR */}
            <Route
              path="companies"
              element={
                <RoleRoute roles={["SUPER_ADMIN", "AUDITOR"]}>
                  <CompaniesManagement />
                </RoleRoute>
              }
            />
            <Route
              path="companies/:id"
              element={
                <RoleRoute roles={["SUPER_ADMIN", "AUDITOR"]}>
                  <CompanyDetail />
                </RoleRoute>
              }
            />

            {/* SUPER_ADMIN & AUDITOR & CLIENT */}
            <Route
              path="audits"
              element={
                <RoleRoute roles={["SUPER_ADMIN", "AUDITOR", "CLIENT"]}>
                  <AuditsManagement />
                </RoleRoute>
              }
            />

            {/* SUPER_ADMIN & AUDITOR & CLIENT */}
            <Route
              path="audits/:id"
              element={
                <RoleRoute roles={["SUPER_ADMIN", "AUDITOR", "CLIENT"]}>
                  <AuditDetails />
                </RoleRoute>
              }
            />

            {/* SUPER_ADMIN & CLIENT */}
            <Route
              path="frameworks"
              element={
                <RoleRoute roles={["SUPER_ADMIN", "CLIENT"]}>
                  <FrameworksManagement />
                </RoleRoute>
              }
            />
            <Route
              path="controls"
              element={
                <RoleRoute roles={["SUPER_ADMIN", "CLIENT"]}>
                  <ControlsManagement />
                </RoleRoute>
              }
            />

            {/* CLIENT + AUDITOR + SUPER_ADMIN */}
            <Route
              path="evidence"
              element={
                <RoleRoute roles={["CLIENT", "AUDITOR", "SUPER_ADMIN"]}>
                  <EvidenceManagement />
                </RoleRoute>
              }
            />
            <Route
              path="tasks"
              element={
                <RoleRoute roles={["CLIENT", "AUDITOR"]}>
                  <TaskManagement />
                </RoleRoute>
              }
            />

            {/* SUPER_ADMIN & AUDITOR */}
            <Route
              path="findings"
              element={
                <RoleRoute roles={["SUPER_ADMIN", "AUDITOR"]}>
                  <FindingManagement />
                </RoleRoute>
              }
            />

            {/* SUPER_ADMIN & AUDITOR & CLIENT */}
            <Route
              path="risks"
              element={
                <RoleRoute roles={["SUPER_ADMIN", "AUDITOR", "CLIENT"]}>
                  <RiskManagement />
                </RoleRoute>
              }
            />

            {/* SUPER_ADMIN & AUDITOR & CLIENT */}
            <Route
              path="reports"
              element={
                <RoleRoute roles={["SUPER_ADMIN", "AUDITOR", "CLIENT"]}>
                  <Placeholder title="Reports" />
                </RoleRoute>
              }
            />

            {/* ALL Roles */}
            <Route path="settings" element={<Placeholder title="Settings" />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAppRoute && !isAuthPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen w-full relative">
      {/* Dashed Grid for public pages only */}
      <div
        className="absolute inset-0 z-0 pointer-events-none hidden" // Hiding the grid globally if needed, or adjust z-index. The public pages have their own background handling now.
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
