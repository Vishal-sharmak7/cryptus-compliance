import db from "../config/db.js";
import { success, created, notFound, forbidden } from "../utils/response.js";
import { logActivity } from "../utils/logger.js";

const query = (sql, params) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );

export const createRisk = async (req, res) => {
  const { company_id, title, description, impact, likelihood, severity, status, owner, mitigation, due_date } = req.body;
  if (req.user.role === "CLIENT" && Number(req.user.company_id) !== Number(company_id))
    return forbidden(res);
  const result = await query(
    `INSERT INTO risks (company_id, title, description, impact, likelihood, severity, status, owner, mitigation, due_date, created_by)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [company_id, title, description, impact, likelihood, severity, status || "OPEN", owner, mitigation, due_date, req.user.id]
  );
  logActivity(req.user.id, company_id, "RISK_CREATED", "risk", result.insertId, `Risk "${title}" created`, req);
  return created(res, { riskId: result.insertId }, "Risk created");
};

export const getRisks = async (req, res) => {
  const { status, severity, page = 1, limit = 20, search = "" } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  let sql = `SELECT r.*, c.name as company_name FROM risks r LEFT JOIN companies c ON c.id = r.company_id WHERE 1=1`;
  const params = [];
  if (req.user.role === "CLIENT") { sql += " AND r.company_id = ?"; params.push(req.user.company_id); }
  if (status)   { sql += " AND r.status = ?";   params.push(status);   }
  if (severity) { sql += " AND r.severity = ?"; params.push(severity); }
  if (search)   { sql += " AND r.title LIKE ?"; params.push(`%${search}%`); }
  const [{ total }] = await query(sql.replace("SELECT r.*, c.name as company_name", "SELECT COUNT(*) as total"), params);
  sql += " ORDER BY FIELD(r.severity,'CRITICAL','HIGH','MEDIUM','LOW'), r.created_at DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), offset);
  const rows = await query(sql, params);
  return success(res, { risks: rows, meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } });
};

export const getRiskById = async (req, res) => {
  const [row] = await query(
    `SELECT r.*, c.name as company_name FROM risks r LEFT JOIN companies c ON c.id = r.company_id WHERE r.id = ?`,
    [req.params.id]
  );
  if (!row) return notFound(res);
  if (req.user.role === "CLIENT" && Number(row.company_id) !== Number(req.user.company_id)) return forbidden(res);
  return success(res, row);
};

export const getRisksByCompany = async (req, res) => {
  const { companyId } = req.params;
  if (req.user.role === "CLIENT" && Number(req.user.company_id) !== Number(companyId)) return forbidden(res);
  const rows = await query(
    `SELECT * FROM risks WHERE company_id = ? ORDER BY FIELD(severity,'CRITICAL','HIGH','MEDIUM','LOW'), created_at DESC`,
    [companyId]
  );
  return success(res, rows);
};

export const updateRisk = async (req, res) => {
  const [risk] = await query("SELECT * FROM risks WHERE id = ?", [req.params.id]);
  if (!risk) return notFound(res);
  if (req.user.role === "CLIENT" && Number(risk.company_id) !== Number(req.user.company_id)) return forbidden(res);
  const fields = ["title", "description", "impact", "likelihood", "severity", "status", "owner", "mitigation", "due_date"];
  const updates = []; const params = [];
  fields.forEach((f) => { if (req.body[f] !== undefined) { updates.push(`${f} = ?`); params.push(req.body[f]); } });
  if (!updates.length) return success(res, risk, "Nothing to update");
  params.push(req.params.id);
  await query(`UPDATE risks SET ${updates.join(", ")}, updated_at = NOW() WHERE id = ?`, params);
  logActivity(req.user.id, risk.company_id, "RISK_UPDATED", "risk", risk.id, `Risk updated`, req);
  return success(res, {}, "Risk updated");
};

export const deleteRisk = async (req, res) => {
  const [risk] = await query("SELECT * FROM risks WHERE id = ?", [req.params.id]);
  if (!risk) return notFound(res);
  if (req.user.role === "CLIENT" && Number(risk.company_id) !== Number(req.user.company_id)) return forbidden(res);
  await query("DELETE FROM risks WHERE id = ?", [req.params.id]);
  logActivity(req.user.id, risk.company_id, "RISK_DELETED", "risk", risk.id, `Risk deleted`, req);
  return success(res, {}, "Risk deleted");
};
