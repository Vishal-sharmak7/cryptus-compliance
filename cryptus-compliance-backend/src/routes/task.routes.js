import express from "express";
import protect from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../utils/schemas.js";
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/",    protect, validate(createTaskSchema), createTask);
router.get("/",     protect, getTasks);
router.get("/:id",  protect, getTaskById);
router.put("/:id",  protect, validate(updateTaskSchema), updateTask);
router.delete("/:id", protect, deleteTask);

export default router;
