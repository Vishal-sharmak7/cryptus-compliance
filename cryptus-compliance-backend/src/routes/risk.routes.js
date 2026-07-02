import express from "express";
import protect from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createRiskSchema, updateRiskSchema } from "../utils/schemas.js";
import { createRisk, getRisks, getRiskById, getRisksByCompany, updateRisk, deleteRisk } from "../controllers/risk.controller.js";

const router = express.Router();

router.post("/",                  protect, validate(createRiskSchema), createRisk);
router.get("/",                   protect, getRisks);
router.get("/company/:companyId", protect, getRisksByCompany);
router.get("/:id",                protect, getRiskById);
router.put("/:id",                protect, validate(updateRiskSchema), updateRisk);
router.delete("/:id",             protect, deleteRisk);

export default router;
