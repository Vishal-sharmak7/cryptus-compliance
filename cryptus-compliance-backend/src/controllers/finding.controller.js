import db from "../config/db.js";
import { success, created, notFound } from "../utils/response.js";
import { logActivity } from "../utils/logger.js";

const query = (sql, params) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );

const buildQuery = (base, req, { search, companyId, status, severity } = {}) => {
  let sql = base; const params = [];
  if (req.user.role === "CLIENT") {
    sql += " AND f.company_id = ?"; params.push(req.user.company_id);
  } else if (companyId) {
    sql += " AND f.company_id = ?"; params.push(companyId);
  }
  if (status)   { sql += " AND f.status = ?";   params.push(status);   }
  if (severity) { sql += " AND f.severity = ?"; params.push(severity); }
  if (search)   { sql += " AND f.title LIKE ?"; params.push(`%${search}%`); }
  return { sql, params };
};

// ── POST /api/findings ────────────────────────────────────────────
export const createFinding = async (req, res) => {
  const { audit_id, control_id, company_id, title, description, severity, status, assigned_to, due_date } = req.body;
  const result = await query(
    `INSERT INTO findings (audit_id, control_id, company_id, title, description, severity, status, assigned_to, due_date, created_by)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [audit_id, control_id, company_id, title, description, severity, status || "OPEN", assigned_to, due_date, req.user.id]
  );
  logActivity(req.user.id, company_id, "FINDING_CREATED", "finding", result.insertId, `Finding "${title}" created`, req);
  return created(res, { findingId: result.insertId }, "Finding created");
};

const BASE_SELECT = `SELECT f.*, a.title as audit_title, u.name as assigned_to_name, c.name as control_name
                     FROM findings f
                     LEFT JOIN audits a ON a.id = f.audit_id
                     LEFT JOIN users u ON u.id = f.assigned_to
                     LEFT JOIN controls c ON c.id = f.control_id
                     WHERE 1=1`;

// ── GET /api/findings ─────────────────────────────────────────────
export const getFindings = async (req, res) => {
  const { status, severity, company_id, search, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const { sql, params } = buildQuery(BASE_SELECT, req, { search, companyId: company_id, status, severity });

  const countSql = sql.replace(
    "SELECT f.*, a.title as audit_title, u.name as assigned_to_name, c.name as control_name",
    "SELECT COUNT(*) as total"
  );
  const [{ total }] = await query(countSql, params);
  const rows = await query(`${sql} ORDER BY f.created_at DESC LIMIT ? OFFSET ?`, [...params, Number(limit), offset]);
  return success(res, { findings: rows, meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } });
};

// ── GET /api/findings/:id ─────────────────────────────────────────
export const getFindingById = async (req, res) => {
  const [row] = await query(
    `${BASE_SELECT} AND f.id = ?`,
    [req.params.id]
  );
  if (!row) return notFound(res);
  return success(res, row);
};

// ── GET /api/findings/company/:companyId ──────────────────────────
export const getFindingsByCompany = async (req, res) => {
  const rows = await query(
    `${BASE_SELECT} AND f.company_id = ? ORDER BY FIELD(f.severity,'CRITICAL','HIGH','MEDIUM','LOW'), f.created_at DESC`,
    [req.params.companyId]
  );
  return success(res, rows);
};

// ── PUT /api/findings/:id ─────────────────────────────────────────
export const updateFinding = async (req, res) => {
  const [finding] = await query("SELECT * FROM findings WHERE id = ?", [req.params.id]);
  if (!finding) return notFound(res);
  const fields = ["title", "description", "severity", "status", "assigned_to", "due_date", "control_id"];
  const updates = []; const params = [];
  fields.forEach((f) => { if (req.body[f] !== undefined) { updates.push(`${f} = ?`); params.push(req.body[f]); } });
  if (req.body.status === "RESOLVED") { updates.push("resolved_at = NOW()"); }
  if (!updates.length) return success(res, finding, "Nothing to update");
  params.push(req.params.id);
  await query(`UPDATE findings SET ${updates.join(", ")}, updated_at = NOW() WHERE id = ?`, params);
  logActivity(req.user.id, finding.company_id, "FINDING_UPDATED", "finding", finding.id, `Finding updated`, req);
  return success(res, {}, "Finding updated");
};

// ── DELETE /api/findings/:id ──────────────────────────────────────
export const deleteFinding = async (req, res) => {
  const [finding] = await query("SELECT * FROM findings WHERE id = ?", [req.params.id]);
  if (!finding) return notFound(res);
  await query("DELETE FROM findings WHERE id = ?", [req.params.id]);
  logActivity(req.user.id, finding.company_id, "FINDING_DELETED", "finding", finding.id, `Finding deleted`, req);
  return success(res, {}, "Finding deleted");
};
