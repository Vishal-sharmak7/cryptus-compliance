import db from "../config/db.js";
import { success, notFound } from "../utils/response.js";

const query = (sql, params) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );

// ── GET /api/reports/compliance/:companyId ────────────────────────
export const complianceReport = async (req, res) => {
  const { companyId } = req.params;

  const [company]    = await query("SELECT * FROM companies WHERE id = ?", [companyId]);
  if (!company) return notFound(res, "Company not found");

  const frameworks   = await query(
    `SELECT f.name, cf.progress_percentage FROM company_frameworks cf
     JOIN frameworks f ON f.id = cf.framework_id WHERE cf.company_id = ?`, [companyId]
  );
  const controls     = await query(
    "SELECT status, COUNT(*) as count FROM company_controls WHERE company_id = ? GROUP BY status", [companyId]
  );
  const evidence     = await query(
    `SELECT e.status, COUNT(*) as count FROM evidences e
     JOIN company_controls cc ON cc.id = e.company_control_id
     WHERE cc.company_id = ? GROUP BY e.status`, [companyId]
  );
  const findings     = await query(
    "SELECT severity, status, COUNT(*) as count FROM findings WHERE company_id = ? GROUP BY severity, status", [companyId]
  );
  const risks        = await query(
    "SELECT severity, status, COUNT(*) as count FROM risks WHERE company_id = ? GROUP BY severity, status", [companyId]
  );

  return success(res, {
    generatedAt: new Date().toISOString(),
    company:     { id: company.id, name: company.name },
    frameworks,
    controls:    Object.fromEntries(controls.map((r) => [r.status, Number(r.count)])),
    evidence:    Object.fromEntries(evidence.map((r) => [r.status, Number(r.count)])),
    findings,
    risks,
  });
};

// ── GET /api/reports/audit/:auditId ──────────────────────────────
export const auditReport = async (req, res) => {
  const { auditId } = req.params;
  const [audit] = await query(
    `SELECT a.*, c.name as company_name, u.name as auditor_name, f.name as framework_name
     FROM audits a
     LEFT JOIN companies c ON c.id = a.company_id
     LEFT JOIN users u ON u.id = a.auditor_id
     LEFT JOIN frameworks f ON f.id = a.framework_id
     WHERE a.id = ?`, [auditId]
  );
  if (!audit) return notFound(res, "Audit not found");

  const findings = await query(
    "SELECT * FROM findings WHERE audit_id = ? ORDER BY FIELD(severity,'CRITICAL','HIGH','MEDIUM','LOW')", [auditId]
  );

  return success(res, {
    generatedAt: new Date().toISOString(),
    audit,
    findings,
    summary: {
      critical: findings.filter((f) => f.severity === "CRITICAL").length,
      high:     findings.filter((f) => f.severity === "HIGH").length,
      medium:   findings.filter((f) => f.severity === "MEDIUM").length,
      low:      findings.filter((f) => f.severity === "LOW").length,
      open:     findings.filter((f) => f.status === "OPEN").length,
      resolved: findings.filter((f) => f.status === "RESOLVED").length,
    },
  });
};

// ── GET /api/reports/risk/:companyId ─────────────────────────────
export const riskReport = async (req, res) => {
  const { companyId } = req.params;
  const [company] = await query("SELECT * FROM companies WHERE id = ?", [companyId]);
  if (!company) return notFound(res, "Company not found");

  const risks = await query(
    "SELECT * FROM risks WHERE company_id = ? ORDER BY FIELD(severity,'CRITICAL','HIGH','MEDIUM','LOW')", [companyId]
  );

  return success(res, {
    generatedAt: new Date().toISOString(),
    company: { id: company.id, name: company.name },
    risks,
    summary: {
      total:    risks.length,
      critical: risks.filter((r) => r.severity === "CRITICAL").length,
      high:     risks.filter((r) => r.severity === "HIGH").length,
      medium:   risks.filter((r) => r.severity === "MEDIUM").length,
      low:      risks.filter((r) => r.severity === "LOW").length,
      open:     risks.filter((r) => r.status === "OPEN").length,
      mitigated:risks.filter((r) => r.status === "MITIGATED").length,
    },
  });
};
