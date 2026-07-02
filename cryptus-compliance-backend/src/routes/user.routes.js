import express from "express";
import { getUsers, createUser, getAuditors, updateUser, deleteUser } from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", protect, authorize("SUPER_ADMIN"), getUsers);
router.post("/", protect, authorize("SUPER_ADMIN"), createUser);
router.get("/auditors", protect, authorize("SUPER_ADMIN"), getAuditors);
router.put("/:id", protect, authorize("SUPER_ADMIN"), updateUser);
router.delete("/:id", protect, authorize("SUPER_ADMIN"), deleteUser);

export default router;
