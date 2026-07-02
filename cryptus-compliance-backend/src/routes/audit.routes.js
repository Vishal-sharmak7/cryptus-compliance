import express from "express";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createAuditSchema, updateAuditSchema } from "../utils/schemas.js";
import { createAudit, getAudits, getAuditById, updateAudit, deleteAudit } from "../controllers/audit.controller.js";

const router = express.Router();

router.post("/",    protect, authorize("SUPER_ADMIN","AUDITOR"), validate(createAuditSchema), createAudit);
router.get("/",     protect, getAudits);
router.get("/:id",  protect, getAuditById);
router.put("/:id",  protect, authorize("SUPER_ADMIN","AUDITOR"), validate(updateAuditSchema), updateAudit);
router.delete("/:id", protect, authorize("SUPER_ADMIN"), deleteAudit);

export default router;
