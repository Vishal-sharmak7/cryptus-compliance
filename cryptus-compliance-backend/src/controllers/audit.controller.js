import db from "../config/db.js";
import { success, created, notFound } from "../utils/response.js";
import { logActivity } from "../utils/logger.js";

const query = (sql, params) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );

// ── POST /api/audits ──────────────────────────────────────────────
export const createAudit = async (req, res) => {
  const { title, description, framework_id, company_id, auditor_id, status, start_date, end_date } = req.body;
  const result = await query(
    `INSERT INTO audits (title, description, framework_id, company_id, auditor_id, status, start_date, end_date, created_by)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [title, description, framework_id, company_id, auditor_id, status || "PLANNED", start_date, end_date, req.user.id]
  );
  logActivity(req.user.id, company_id, "AUDIT_CREATED", "audit", result.insertId, `Audit "${title}" created`, req);
  return created(res, { auditId: result.insertId }, "Audit created");
};

// ── GET /api/audits ───────────────────────────────────────────────
export const getAudits = async (req, res) => {
  const { company_id, status, page = 1, limit = 20, search = "" } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  let sql = `SELECT a.*, c.name as company_name, u.name as auditor_name, f.name as framework_name
             FROM audits a
             LEFT JOIN companies c ON c.id = a.company_id
             LEFT JOIN users u ON u.id = a.auditor_id
             LEFT JOIN frameworks f ON f.id = a.framework_id
             WHERE 1=1`;
  const params = [];

  // Role isolation
  if (req.user.role === "CLIENT") {
    sql += " AND a.company_id = ?"; params.push(req.user.company_id);
  } else if (req.user.role === "AUDITOR") {
    sql += " AND a.auditor_id = ?"; params.push(req.user.id);
  } else if (company_id) {
    sql += " AND a.company_id = ?"; params.push(company_id);
  }
  if (status) { sql += " AND a.status = ?"; params.push(status); }
  if (search)  { sql += " AND a.title LIKE ?"; params.push(`%${search}%`); }

  const [{ total }] = await query(
    sql.replace("SELECT a.*, c.name as company_name, u.name as auditor_name, f.name as framework_name", "SELECT COUNT(*) as total"),
    params
  );
  sql += " ORDER BY a.created_at DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), offset);
  const rows = await query(sql, params);
  return success(res, { audits: rows, meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } });
};

// ── GET /api/audits/:id ───────────────────────────────────────────
export const getAuditById = async (req, res) => {
  const [audit] = await query(
    `SELECT a.*, c.name as company_name, u.name as auditor_name, f.name as framework_name
     FROM audits a
     LEFT JOIN companies c ON c.id = a.company_id
     LEFT JOIN users u ON u.id = a.auditor_id
     LEFT JOIN frameworks f ON f.id = a.framework_id
     WHERE a.id = ?`,
    [req.params.id]
  );
  if (!audit) return notFound(res);
  return success(res, audit);
};

// ── PUT /api/audits/:id ───────────────────────────────────────────
export const updateAudit = async (req, res) => {
  const [audit] = await query("SELECT * FROM audits WHERE id = ?", [req.params.id]);
  if (!audit) return notFound(res);

  const fields = ["title", "description", "framework_id", "company_id", "auditor_id", "status", "start_date", "end_date"];
  const updates = []; const params = [];
  fields.forEach((f) => { if (req.body[f] !== undefined) { updates.push(`${f} = ?`); params.push(req.body[f]); } });
  if (!updates.length) return success(res, audit, "Nothing to update");

  params.push(req.params.id);
  await query(`UPDATE audits SET ${updates.join(", ")}, updated_at = NOW() WHERE id = ?`, params);
  logActivity(req.user.id, audit.company_id, "AUDIT_UPDATED", "audit", audit.id, `Audit updated`, req);
  return success(res, {}, "Audit updated");
};

// ── DELETE /api/audits/:id ────────────────────────────────────────
export const deleteAudit = async (req, res) => {
  const [audit] = await query("SELECT * FROM audits WHERE id = ?", [req.params.id]);
  if (!audit) return notFound(res);
  await query("DELETE FROM audits WHERE id = ?", [req.params.id]);
  logActivity(req.user.id, audit.company_id, "AUDIT_DELETED", "audit", audit.id, `Audit deleted`, req);
  return success(res, {}, "Audit deleted");
};
