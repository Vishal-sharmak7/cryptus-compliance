import express from "express";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { clientDashboard, adminDashboard, auditorDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/client",   protect, clientDashboard);
router.get("/admin",    protect, authorize("SUPER_ADMIN"), adminDashboard);
router.get("/auditor",  protect, authorize("AUDITOR", "SUPER_ADMIN"), auditorDashboard);

export default router;
