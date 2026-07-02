import express from "express";

import {
  createFramework,
  getFrameworks,
  getFrameworkById,
  updateFramework,
  deleteFramework,
} from "../controllers/framework.controller.js";

import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  createFramework
);

router.get("/", protect, getFrameworks);

router.get("/:id", protect, getFrameworkById);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  updateFramework
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  deleteFramework
);

export default router;