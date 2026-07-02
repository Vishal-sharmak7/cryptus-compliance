import express from "express";

import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller.js";

import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  createCompany
);

router.get("/", protect, getCompanies);

router.get("/:id", protect, getCompanyById);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  updateCompany
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  deleteCompany
);

export default router;