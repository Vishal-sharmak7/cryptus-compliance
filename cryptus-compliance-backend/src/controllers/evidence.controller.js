import db from "../config/db.js";
import { success, created, notFound, forbidden, badRequest } from "../utils/response.js";
import { logActivity, createNotification } from "../utils/logger.js";

const query = (sql, params) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );

// ── GET /api/evidence/company-control/:companyControlId ──────────
export const getEvidenceByControl = async (req, res) => {
  const { companyControlId } = req.params;
  const rows = await query(
    `SELECT e.*, u.name as uploaded_by_name, r.name as reviewed_by_name
     FROM evidences e
     LEFT JOIN users u ON u.id = e.uploaded_by
     LEFT JOIN users r ON r.id = e.reviewed_by
     WHERE e.company_control_id = ?
     ORDER BY e.created_at DESC`,
    [companyControlId]
  );
  return success(res, rows);
};

// ── GET /api/evidence/:id ────────────────────────────────────────
export const getEvidenceById = async (req, res) => {
  const [row] = await query(
    `SELECT e.*, u.name as uploaded_by_name, r.name as reviewed_by_name
     FROM evidences e
     LEFT JOIN users u ON u.id = e.uploaded_by
     LEFT JOIN users r ON r.id = e.reviewed_by
     WHERE e.id = ?`,
    [req.params.id]
  );
  if (!row) return notFound(res);
  return success(res, row);
};

// ── PUT /api/evidence/:id/review ─────────────────────────────────
export const reviewEvidence = async (req, res) => {
  if (!["AUDITOR", "SUPER_ADMIN"].includes(req.user.role))
    return forbidden(res, "Only auditors can review evidence");

  const { status, comments } = req.body;
  const [ev] = await query("SELECT * FROM evidences WHERE id = ?", [req.params.id]);
  if (!ev) return notFound(res, "Evidence not found");

  await query(
    `UPDATE evidences
     SET status = ?, comments = ?, reviewed_by = ?, reviewed_at = NOW(), updated_at = NOW()
     WHERE id = ?`,
    [status, comments, req.user.id, req.params.id]
  );

  // Notify uploader
  createNotification(
    ev.uploaded_by,
    `Evidence ${status === "APPROVED" ? "Approved ✅" : "Rejected ❌"}`,
    `Your evidence (ID: ${ev.id}) has been ${status.toLowerCase()}. ${comments || ""}`,
    status === "APPROVED" ? "SUCCESS" : "WARNING"
  );

  logActivity(req.user.id, null, "EVIDENCE_REVIEWED", "evidence", ev.id,
    `Evidence ${ev.id} ${status}`, req);

  return success(res, { id: ev.id, status }, `Evidence ${status.toLowerCase()}`);
};

// ── DELETE /api/evidence/:id ─────────────────────────────────────
export const deleteEvidence = async (req, res) => {
  const [ev] = await query("SELECT * FROM evidences WHERE id = ?", [req.params.id]);
  if (!ev) return notFound(res, "Evidence not found");

  // Only uploader or admin can delete
  if (req.user.role === "CLIENT" && ev.uploaded_by !== req.user.id)
    return forbidden(res, "You can only delete your own evidence");

  await query("DELETE FROM evidences WHERE id = ?", [req.params.id]);
  logActivity(req.user.id, null, "EVIDENCE_DELETED", "evidence", ev.id, `Evidence ${ev.id} deleted`, req);
  return success(res, {}, "Evidence deleted");
};

// ── GET /api/evidence/summary/:companyId ─────────────────────────
export const getEvidenceSummary = async (req, res) => {
  const { companyId } = req.params;
  const rows = await query(
    `SELECT e.status, COUNT(*) as count
     FROM evidences e
     JOIN company_controls cc ON cc.id = e.company_control_id
     WHERE cc.company_id = ?
     GROUP BY e.status`,
    [companyId]
  );
  const summary = { total: 0, approved: 0, pending: 0, rejected: 0 };
  rows.forEach((r) => {
    const count = Number(r.count);
    summary.total += count;
    if (r.status === "APPROVED")  summary.approved = count;
    if (r.status === "PENDING")   summary.pending  = count;
    if (r.status === "REJECTED")  summary.rejected = count;
  });
  return success(res, summary);
};

// ── GET /api/evidence/company/:companyId ─────────────────────────
export const getEvidenceByCompany = async (req, res) => {
  const { companyId } = req.params;
  const rows = await query(
    `SELECT e.id, e.title, e.description, e.file_name, e.file_path,
            e.status, e.comments, e.created_at, e.uploaded_by,
            u.name as uploaded_by_name
     FROM evidences e
     LEFT JOIN company_controls cc ON cc.id = e.company_control_id
     LEFT JOIN users u ON u.id = e.uploaded_by
     WHERE (cc.company_id = ? OR e.company_id = ?)
     ORDER BY e.created_at DESC`,
    [companyId, companyId]
  );
  return success(res, rows);
};

// ── GET /api/evidence/my ─────────────────────────────────────────
export const getMyEvidence = async (req, res) => {
  const rows = await query(
    `SELECT e.id, e.title, e.description, e.file_name, e.file_path,
            e.status, e.comments, e.created_at, e.company_id,
            u.name as uploaded_by_name
     FROM evidences e
     LEFT JOIN users u ON u.id = e.uploaded_by
     WHERE e.uploaded_by = ?
     ORDER BY e.created_at DESC`,
    [req.user.id]
  );
  return success(res, rows);
};

// ── GET /api/evidence/auditor ─────────────────────────────────────
// Returns all evidence from companies the auditor is assigned to
export const getAuditorEvidence = async (req, res) => {
  const auditorId = req.user.id;

  // Collect company IDs: from assigned audits + user's own company_id
  const auditRows = await query(
    `SELECT DISTINCT company_id FROM audits WHERE auditor_id = ? AND company_id IS NOT NULL`,
    [auditorId]
  );
  const companyIdFromUser = req.user.company_id;
  const companyIdsFromAudits = auditRows.map(r => r.company_id);
  const allCompanyIds = [...new Set([companyIdFromUser, ...companyIdsFromAudits].filter(Boolean))];

  if (!allCompanyIds.length) {
    return success(res, []);
  }

  const ph = allCompanyIds.map(() => "?").join(",");

  const rows = await query(
    `SELECT e.id, e.title, e.description, e.file_name, e.file_path,
            e.status, e.comments, e.created_at, e.company_id,
            e.reviewed_at, e.reviewed_by,
            u.name as uploaded_by_name,
            c.name as company_name,
            rv.name as reviewed_by_name
     FROM evidences e
     LEFT JOIN users u ON u.id = e.uploaded_by
     LEFT JOIN companies c ON c.id = e.company_id
     LEFT JOIN users rv ON rv.id = e.reviewed_by
     WHERE e.company_id IN (${ph})
     ORDER BY
       CASE e.status WHEN 'PENDING' THEN 0 WHEN 'REJECTED' THEN 1 ELSE 2 END,
       e.created_at DESC`,
    allCompanyIds
  );
  return success(res, rows);
};


// ── POST /api/evidence/upload ─────────────────────────────────────
export const uploadEvidence = async (req, res) => {
  const { company_control_id, title, description } = req.body;
  if (!req.file) return badRequest(res, "File is required");

  // company_id is pulled from the authenticated user so clients always own their upload
  const companyId = req.user.companyId || req.user.company_id || null;

  const result = await query(
    `INSERT INTO evidences
       (company_control_id, company_id, title, description, file_name, file_path, uploaded_by, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
    [
      company_control_id || null,
      companyId,
      title || req.file.originalname,
      description || null,
      req.file.filename,
      req.file.path,
      req.user.id,
    ]
  );

  logActivity(req.user.id, null, "EVIDENCE_UPLOADED", "evidence", result.insertId,
    `Evidence uploaded: ${title || req.file.originalname}`, req);

  return created(res, { evidenceId: result.insertId }, "Evidence uploaded successfully");
};