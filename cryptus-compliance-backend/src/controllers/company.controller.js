import db from "../config/db.js";



// Create Company
export const createCompany = (req, res) => {
  const { name, industry, website } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Company name is required",
    });
  }

  const query = `
    INSERT INTO companies (name, industry, website)
    VALUES (?, ?, ?)
  `;

  db.query(
    query,
    [name, industry, website],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Company created successfully",
        companyId: result.insertId,
      });
    }
  );
};

// Get All Companies
export const getCompanies = (req, res) => {
  db.query(
    "SELECT * FROM companies ORDER BY id DESC",
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        companies: results,
      });
    }
  );
};

// Get Single Company
export const getCompanyById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM companies WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      res.json({
        success: true,
        company: results[0],
      });
    }
  );
};

// Update Company
export const updateCompany = (req, res) => {
  const { id } = req.params;
  const { name, industry, website } = req.body;

  db.query(
    `UPDATE companies
     SET name=?, industry=?, website=?
     WHERE id=?`,
    [name, industry, website, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: "Company updated successfully",
      });
    }
  );
};

// Delete Company
export const deleteCompany = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM companies WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: "Company deleted successfully",
      });
    }
  );
};