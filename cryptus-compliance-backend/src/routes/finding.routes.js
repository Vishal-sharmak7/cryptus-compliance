import express from "express";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createFindingSchema, updateFindingSchema } from "../utils/schemas.js";
import {
  createFinding, getFindings, getFindingById,
  getFindingsByCompany, updateFinding, deleteFinding,
} from "../controllers/finding.controller.js";

const router = express.Router();

router.post("/",                      protect, authorize("SUPER_ADMIN","AUDITOR"), validate(createFindingSchema), createFinding);
router.get("/",                       protect, getFindings);
router.get("/company/:companyId",     protect, getFindingsByCompany);
router.get("/:id",                    protect, getFindingById);
router.put("/:id",                    protect, authorize("SUPER_ADMIN","AUDITOR"), validate(updateFindingSchema), updateFinding);
router.delete("/:id",                 protect, authorize("SUPER_ADMIN","AUDITOR"), deleteFinding);

export default router;
