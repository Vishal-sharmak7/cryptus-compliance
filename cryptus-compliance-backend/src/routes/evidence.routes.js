import express from "express";
import upload from "../config/multer.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { checkEvidenceOwner } from "../middleware/company.middleware.js";
import { reviewEvidenceSchema } from "../utils/schemas.js";
import {
  uploadEvidence,
  getEvidenceByControl,
  getEvidenceById,
  reviewEvidence,
  deleteEvidence,
  getEvidenceSummary,
  getEvidenceByCompany,
  getMyEvidence,
  getAuditorEvidence,
} from "../controllers/evidence.controller.js";

const router = express.Router();

router.post("/upload",                   protect, upload.single("file"), uploadEvidence);
router.get("/my",                        protect, getMyEvidence);
router.get("/auditor",                   protect, authorize("AUDITOR","SUPER_ADMIN"), getAuditorEvidence);
router.get("/company-control/:companyControlId", protect, getEvidenceByControl);
router.get("/summary/:companyId",        protect, getEvidenceSummary);
router.get("/company/:companyId",        protect, getEvidenceByCompany);
router.get("/:id",                       protect, checkEvidenceOwner, getEvidenceById);
router.put("/:id/review",               protect, authorize("AUDITOR","SUPER_ADMIN"), validate(reviewEvidenceSchema), reviewEvidence);
router.delete("/:id",                   protect, checkEvidenceOwner, deleteEvidence);

export default router;