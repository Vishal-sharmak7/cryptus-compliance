import db from "../config/db.js";
import { forbidden } from "../utils/response.js";

/**
 * Middleware: ensure a CLIENT user can only access resources
 * belonging to their own company.
 *
 * Usage:
 *   router.get("/company/:companyId/...", protect, checkCompanyAccess("companyId"), controller)
 *
 * companyParamKey - the req.params key that holds the company ID in the route.
 */
export const checkCompanyAccess = (companyParamKey = "companyId") => {
  return (req, res, next) => {
    const role      = req.user?.role;
    const userCompany = req.user?.company_id || req.user?.companyId;

    // SUPER_ADMIN and AUDITOR pass freely
    if (role === "SUPER_ADMIN" || role === "AUDITOR") return next();

    // CLIENT must own the requested company
    const requestedCompanyId = Number(req.params[companyParamKey]);
    if (!requestedCompanyId || Number(userCompany) !== requestedCompanyId) {
      return forbidden(res, "You do not have access to this company's resources");
    }

    next();
  };
};

/**
 * Middleware: ensure CLIENT owns the evidence record they are accessing.
 * Looks up evidence by req.params.id and compares uploaded_by / company_id.
 */
export const checkEvidenceOwner = (req, res, next) => {
  if (req.user?.role !== "CLIENT") return next();

  const id = req.params.id;
  db.query(
    `SELECT e.uploaded_by, cc.company_id
     FROM evidences e
     JOIN company_controls cc ON cc.id = e.company_control_id
     WHERE e.id = ?`,
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!rows.length) return res.status(404).json({ success: false, message: "Evidence not found" });
      if (Number(rows[0].company_id) !== Number(req.user.company_id)) {
        return forbidden(res, "Access denied to this evidence");
      }
      next();
    }
  );
};
