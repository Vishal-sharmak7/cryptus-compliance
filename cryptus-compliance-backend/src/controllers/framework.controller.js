import db from "../config/db.js";

// Create Framework
export const createFramework = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Framework name is required",
    });
  }

  const query = `
    INSERT INTO frameworks(name, description)
    VALUES(?, ?)
  `;

  db.query(
    query,
    [name, description],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Framework created",
        frameworkId: result.insertId,
      });
    }
  );
};

// Get All Frameworks
export const getFrameworks = (req, res) => {
  db.query(
    "SELECT * FROM frameworks ORDER BY id DESC",
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        frameworks: results,
      });
    }
  );
};

// Get Single Framework
export const getFrameworkById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM frameworks WHERE id=?",
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
          message: "Framework not found",
        });
      }

      res.json({
        success: true,
        framework: results[0],
      });
    }
  );
};

// Update Framework
export const updateFramework = (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  db.query(
    `UPDATE frameworks
     SET name=?, description=?, status=?
     WHERE id=?`,
    [name, description, status, id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: "Framework updated",
      });
    }
  );
};

// Delete Framework
export const deleteFramework = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM frameworks WHERE id=?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: "Framework deleted",
      });
    }
  );
};


