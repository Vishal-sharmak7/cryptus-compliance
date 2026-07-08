import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// ── Routes ────────────────────────────────────────────────────────
import authRoutes           from "./src/routes/auth.routes.js";
import companyRoutes        from "./src/routes/company.routes.js";
import frameworkRoutes      from "./src/routes/framework.routes.js";
import controlRoutes        from "./src/routes/control.routes.js";
import companyFrameworkRoutes from "./src/routes/companyFramework.routes.js";
import companyControlRoutes from "./src/routes/companyControl.routes.js";
import evidenceRoutes       from "./src/routes/evidence.routes.js";
import auditRoutes          from "./src/routes/audit.routes.js";
import findingRoutes        from "./src/routes/finding.routes.js";
import riskRoutes           from "./src/routes/risk.routes.js";
import taskRoutes           from "./src/routes/task.routes.js";
import notificationRoutes   from "./src/routes/notification.routes.js";
import dashboardRoutes      from "./src/routes/dashboard.routes.js";
import reportRoutes         from "./src/routes/report.routes.js";
import userRoutes           from "./src/routes/user.routes.js";

// ── Swagger UI ────────────────────────────────────────────────────
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./src/config/swagger.js";

// ── Middleware ────────────────────────────────────────────────────
import { errorHandler, notFoundHandler } from "./src/middleware/error.middleware.js";

const app = express();

// ── Security ──────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow file access
  })
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ── Rate Limiting ─────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts. Try again in 15 minutes." },
});

app.use(globalLimiter);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Serve uploaded files ──────────────────────────────────────────
app.use("/uploads", express.static("uploads"));

// ── Health Check ──────────────────────────────────────────────────
app.get("/", (req, res) =>
  res.json({ success: true, message: "Cryptus Compliance API v2.0", timestamp: new Date().toISOString() })
);

// ── Swagger Docs ──────────────────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ── API Routes ────────────────────────────────────────────────────
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth",              authRoutes);
app.use("/api/companies",         companyRoutes);
app.use("/api/frameworks",        frameworkRoutes);
app.use("/api/controls",          controlRoutes);
app.use("/api/company-frameworks",companyFrameworkRoutes);
app.use("/api/company-controls",  companyControlRoutes);
app.use("/api/evidence",          evidenceRoutes);
app.use("/api/audits",            auditRoutes);
app.use("/api/findings",          findingRoutes);
app.use("/api/risks",             riskRoutes);
app.use("/api/tasks",             taskRoutes);
app.use("/api/notifications",     notificationRoutes);
app.use("/api/dashboard",         dashboardRoutes);
app.use("/api/reports",           reportRoutes);
app.use("/api/users",             userRoutes);

// ── 404 + Global Error Handler ────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
