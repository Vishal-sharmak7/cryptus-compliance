import db from "../config/db.js";

// Assign Framework To Company
export const assignFramework = (req, res) => {
  const { company_id, framework_id } = req.body;

  const query = `
    INSERT INTO company_frameworks (company_id, framework_id)
    VALUES (?, ?)
  `;

  db.query(query, [company_id, framework_id], (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(201).json({ success: true, message: "Framework Assigned" });
  });
};

// Get Frameworks Assigned To A Company
export const getCompanyFrameworks = (req, res) => {
  const { companyId } = req.params;

  const query = `
    SELECT
      cf.id,
      f.id   AS framework_id,
      f.name,
      f.description
    FROM company_frameworks cf
    JOIN frameworks f ON cf.framework_id = f.id
    WHERE cf.company_id = ?
  `;

  db.query(query, [companyId], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, frameworks: results });
  });
};

// De-assign (remove) Framework from Company
export const deassignFramework = (req, res) => {
  const { id } = req.params; // company_frameworks row id

  db.query(
    "DELETE FROM company_frameworks WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, message: "Framework removed" });
    }
  );
};