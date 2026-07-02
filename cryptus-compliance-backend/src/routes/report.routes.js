import express from "express";
import protect from "../middleware/auth.middleware.js";
import { complianceReport, auditReport, riskReport } from "../controllers/report.controller.js";

const router = express.Router();

router.get("/compliance/:companyId", protect, complianceReport);
router.get("/audit/:auditId",        protect, auditReport);
router.get("/risk/:companyId",       protect, riskReport);

export default router;
