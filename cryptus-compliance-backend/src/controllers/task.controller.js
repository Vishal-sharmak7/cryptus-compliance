import db from "../config/db.js";
import { success, created, notFound, forbidden } from "../utils/response.js";
import { logActivity } from "../utils/logger.js";

const query = (sql, params) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );

// ── POST /api/tasks ───────────────────────────────────────────────
export const createTask = async (req, res) => {
  const { company_id, control_id, assigned_to, title, description, due_date, priority, status } = req.body;
  if (req.user.role === "CLIENT" && Number(req.user.company_id) !== Number(company_id))
    return forbidden(res);
  const result = await query(
    `INSERT INTO tasks (company_id, control_id, assigned_to, title, description, due_date, priority, status, created_by)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [company_id, control_id, assigned_to, title, description, due_date, priority || "MEDIUM", status || "TODO", req.user.id]
  );
  logActivity(req.user.id, company_id, "TASK_CREATED", "task", result.insertId, `Task "${title}" created`, req);
  return created(res, { taskId: result.insertId }, "Task created");
};

// ── GET /api/tasks ────────────────────────────────────────────────
export const getTasks = async (req, res) => {
  const { status, priority, page = 1, limit = 20, search = "" } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  let sql = `SELECT t.*, u.name as assigned_to_name, c.name as control_name
             FROM tasks t
             LEFT JOIN users u ON u.id = t.assigned_to
             LEFT JOIN controls c ON c.id = t.control_id
             WHERE 1=1`;
  const params = [];
  if (req.user.role === "CLIENT") { sql += " AND t.company_id = ?"; params.push(req.user.company_id); }
  if (status)   { sql += " AND t.status = ?";   params.push(status);   }
  if (priority) { sql += " AND t.priority = ?"; params.push(priority); }
  if (search)   { sql += " AND t.title LIKE ?"; params.push(`%${search}%`); }
  const [{ total }] = await query(
    sql.replace("SELECT t.*, u.name as assigned_to_name, c.name as control_name", "SELECT COUNT(*) as total"), params
  );
  sql += " ORDER BY t.due_date ASC, t.priority DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), offset);
  const rows = await query(sql, params);
  return success(res, { tasks: rows, meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } });
};

// ── GET /api/tasks/:id ────────────────────────────────────────────
export const getTaskById = async (req, res) => {
  const [row] = await query(
    `SELECT t.*, u.name as assigned_to_name FROM tasks t LEFT JOIN users u ON u.id = t.assigned_to WHERE t.id = ?`,
    [req.params.id]
  );
  if (!row) return notFound(res);
  if (req.user.role === "CLIENT" && Number(row.company_id) !== Number(req.user.company_id))
    return forbidden(res);
  return success(res, row);
};

// ── PUT /api/tasks/:id ────────────────────────────────────────────
export const updateTask = async (req, res) => {
  const [task] = await query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
  if (!task) return notFound(res);
  if (req.user.role === "CLIENT" && Number(task.company_id) !== Number(req.user.company_id))
    return forbidden(res);
  const fields = ["title", "description", "assigned_to", "due_date", "priority", "status", "control_id"];
  const updates = []; const params = [];
  fields.forEach((f) => { if (req.body[f] !== undefined) { updates.push(`${f} = ?`); params.push(req.body[f]); } });
  if (!updates.length) return success(res, task, "Nothing to update");
  params.push(req.params.id);
  await query(`UPDATE tasks SET ${updates.join(", ")}, updated_at = NOW() WHERE id = ?`, params);
  logActivity(req.user.id, task.company_id, "TASK_UPDATED", "task", task.id, `Task updated`, req);
  return success(res, {}, "Task updated");
};

// ── DELETE /api/tasks/:id ─────────────────────────────────────────
export const deleteTask = async (req, res) => {
  const [task] = await query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
  if (!task) return notFound(res);
  if (req.user.role === "CLIENT" && Number(task.company_id) !== Number(req.user.company_id))
    return forbidden(res);
  await query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
  logActivity(req.user.id, task.company_id, "TASK_DELETED", "task", task.id, `Task deleted`, req);
  return success(res, {}, "Task deleted");
};
