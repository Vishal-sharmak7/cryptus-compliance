import express from "express";

import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

import {
  createControl,
  getControlsByFramework,
  getControlById,
  updateControl,
  updateControlStatus,
  deleteControl,
  getControls
} from "../controllers/control.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  createControl
);

router.get("/", protect, getControls);

router.get(
  "/framework/:frameworkId",
  protect,
  getControlsByFramework
);

router.get(
  "/:id",
  protect,
  getControlById
);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  updateControl
);

router.put(
  "/:id/status",
  protect,
  updateControlStatus
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  deleteControl
);

export default router;