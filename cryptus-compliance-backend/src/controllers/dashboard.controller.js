import db from "../config/db.js";
import { success } from "../utils/response.js";

const query = (sql, params) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );

// ── GET /api/dashboard/client ─────────────────────────────────────
export const clientDashboard = async (req, res) => {
  const companyId = req.user.company_id || req.user.companyId;

  const [[score]] = await Promise.all([
    query(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status='COMPLETED' THEN 1 ELSE 0 END) as completed
       FROM company_controls WHERE company_id = ?`,
      [companyId]
    ),
  ]);

  const [[fw]] = await Promise.all([
    query("SELECT COUNT(*) as cnt FROM company_frameworks WHERE company_id = ?", [companyId]),
  ]);

  const [[ev]] = await Promise.all([
    query(
      `SELECT COUNT(*) as cnt FROM evidences e
       JOIN company_controls cc ON cc.id = e.company_control_id
       WHERE cc.company_id = ?`,
      [companyId]
    ),
  ]);

  const [[findings]] = await Promise.all([
    query(
      "SELECT COUNT(*) as cnt FROM findings WHERE company_id = ? AND status = 'OPEN'",
      [companyId]
    ),
  ]);

  const [[risks]] = await Promise.all([
    query(
      "SELECT COUNT(*) as cnt FROM risks WHERE company_id = ? AND status = 'OPEN'",
      [companyId]
    ),
  ]);

  const [[tasks]] = await Promise.all([
    query(
      "SELECT COUNT(*) as cnt FROM tasks WHERE company_id = ? AND status != 'DONE'",
      [companyId]
    ),
  ]);

  const total     = Number(score?.total     || 0);
  const completed = Number(score?.completed || 0);
  const scoreVal  = total ? Math.round((completed / total) * 100) : 0;

  return success(res, {
    complianceScore:    scoreVal,
    frameworks:         Number(fw?.cnt        || 0),
    controls:           total,
    completedControls:  completed,
    pendingControls:    total - completed,
    evidence:           Number(ev?.cnt        || 0),
    openFindings:       Number(findings?.cnt  || 0),
    openRisks:          Number(risks?.cnt     || 0),
    openTasks:          Number(tasks?.cnt     || 0),
  });
};

// ── GET /api/dashboard/admin ──────────────────────────────────────
export const adminDashboard = async (req, res) => {
  const [[companies]] = await Promise.all([query("SELECT COUNT(*) as cnt FROM companies", [])]);
  const [[users]]     = await Promise.all([query("SELECT COUNT(*) as cnt FROM users", [])]);
  const [[frameworks]]= await Promise.all([query("SELECT COUNT(*) as cnt FROM frameworks", [])]);
  const [[controls]]  = await Promise.all([query("SELECT COUNT(*) as cnt FROM controls", [])]);
  const [[evidence]]  = await Promise.all([query("SELECT COUNT(*) as cnt FROM evidences", [])]);
  const [[audits]]    = await Promise.all([query("SELECT COUNT(*) as cnt FROM audits", [])]);
  const [[findings]]  = await Promise.all([query("SELECT COUNT(*) as cnt FROM findings WHERE status='OPEN'", [])]);
  const [[risks]]     = await Promise.all([query("SELECT COUNT(*) as cnt FROM risks WHERE status='OPEN'", [])]);

  const byCompany = await query(
    `SELECT c.name, COUNT(cc.id) as controls,
       SUM(CASE WHEN cc.status='COMPLETED' THEN 1 ELSE 0 END) as completed
     FROM companies c
     LEFT JOIN company_controls cc ON cc.company_id = c.id
     GROUP BY c.id, c.name
     ORDER BY c.name`,
    []
  );

  return success(res, {
    platform: {
      companies:  Number(companies?.cnt  || 0),
      users:      Number(users?.cnt      || 0),
      frameworks: Number(frameworks?.cnt || 0),
      controls:   Number(controls?.cnt   || 0),
      evidence:   Number(evidence?.cnt   || 0),
      audits:     Number(audits?.cnt     || 0),
      openFindings: Number(findings?.cnt || 0),
      openRisks:    Number(risks?.cnt    || 0),
    },
    byCompany,
  });
};

// ── GET /api/dashboard/auditor ────────────────────────────────────
export const auditorDashboard = async (req, res) => {
  const auditorId = req.user.id;

  // 1. Audits assigned to this auditor
  const audits = await query(
    `SELECT a.id, a.title, a.status, a.start_date, a.end_date,
            c.id as company_id, c.name as company_name, c.industry,
            f.id as framework_id, f.name as framework_name
     FROM audits a
     LEFT JOIN companies c ON c.id = a.company_id
     LEFT JOIN frameworks f ON f.id = a.framework_id
     WHERE a.auditor_id = ?
     ORDER BY a.created_at DESC`,
    [auditorId]
  );

  // 2. Collect unique company IDs (from audits + user's own company_id)
  const companyIdFromUser = req.user.company_id;
  const companyIdsFromAudits = [...new Set(audits.map(a => a.company_id).filter(Boolean))];
  const allCompanyIds = [...new Set([companyIdFromUser, ...companyIdsFromAudits].filter(Boolean))];

  if (!allCompanyIds.length) {
    return success(res, {
      audits,
      companies: [],
      summary: { totalAudits: audits.length, totalCompanies: 0, totalFrameworks: 0, totalControls: 0 },
    });
  }

  const ph = allCompanyIds.map(() => "?").join(",");

  // 3. Companies
  const companies = await query(
    `SELECT c.id, c.name, c.industry, c.website FROM companies c WHERE c.id IN (${ph})`,
    allCompanyIds
  );

  // 4. Frameworks assigned to those companies with control counts
  const companyFrameworks = await query(
    `SELECT cf.company_id, cf.framework_id,
            f.name as framework_name, f.description as framework_description,
            COUNT(DISTINCT cc.id) as total_controls,
            SUM(CASE WHEN cc.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_controls,
            SUM(CASE WHEN cc.status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress_controls
     FROM company_frameworks cf
     JOIN frameworks f ON f.id = cf.framework_id
     LEFT JOIN company_controls cc ON cc.framework_id = cf.framework_id AND cc.company_id = cf.company_id
     WHERE cf.company_id IN (${ph})
     GROUP BY cf.company_id, cf.framework_id, f.name, f.description`,
    allCompanyIds
  );

  // 5. Controls per company+framework
  const controls = await query(
    `SELECT cc.company_id, cc.framework_id, cc.id as company_control_id,
            co.id as control_id, co.title as control_title, co.description as control_description,
            cc.status
     FROM company_controls cc
     JOIN controls co ON co.id = cc.control_id
     WHERE cc.company_id IN (${ph})
     ORDER BY cc.framework_id, co.title`,
    allCompanyIds
  );

  // 6. Evidence summary per company
  const evidenceSummary = await query(
    `SELECT e.company_id,
            COUNT(*) as total,
            SUM(CASE WHEN e.status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN e.status = 'PENDING' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN e.status = 'REJECTED' THEN 1 ELSE 0 END) as rejected
     FROM evidences e
     WHERE e.company_id IN (${ph})
     GROUP BY e.company_id`,
    allCompanyIds
  );

  // Build nested: companies → frameworks → controls
  const companiesWithData = companies.map(company => {
    const frameworks = companyFrameworks
      .filter(cf => cf.company_id === company.id)
      .map(fw => ({
        ...fw,
        total_controls: Number(fw.total_controls || 0),
        completed_controls: Number(fw.completed_controls || 0),
        in_progress_controls: Number(fw.in_progress_controls || 0),
        controls: controls.filter(
          c => c.company_id === company.id && c.framework_id === fw.framework_id
        ),
      }));

    const ev = evidenceSummary.find(e => e.company_id === company.id) || {};
    return {
      ...company,
      frameworks,
      evidence: {
        total: Number(ev.total || 0),
        approved: Number(ev.approved || 0),
        pending: Number(ev.pending || 0),
        rejected: Number(ev.rejected || 0),
      },
    };
  });

  return success(res, {
    audits,
    companies: companiesWithData,
    summary: {
      totalAudits: audits.length,
      totalCompanies: companies.length,
      totalFrameworks: companyFrameworks.length,
      totalControls: controls.length,
    },
  });
};
