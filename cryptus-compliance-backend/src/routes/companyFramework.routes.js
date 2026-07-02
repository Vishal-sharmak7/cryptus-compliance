import express from "express";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import {
  assignFramework,
  getCompanyFrameworks,
  deassignFramework,
} from "../controllers/companyFramework.controller.js";

const router = express.Router();

router.post(
  "/assign",
  protect,
  authorize("SUPER_ADMIN"),
  assignFramework
);

router.get(
  "/company/:companyId",
  protect,
  getCompanyFrameworks
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  deassignFramework
);

export default router;