import bcrypt from "bcryptjs";
import db from "../config/db.js";

// Get all users (Super Admin only)
export const getUsers = (req, res) => {
  db.query(
    "SELECT id, name, email, role, company_id, created_at FROM users ORDER BY id DESC",
    (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, users: results });
    }
  );
};

// Create user (Super Admin only)
export const createUser = async (req, res) => {
  const { name, email, password, role, company_id } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "Please provide all required fields" });
  }

  try {
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (results.length > 0) return res.status(400).json({ success: false, message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const compId = (role === "CLIENT" || role === "AUDITOR") ? (company_id || null) : null;

      db.query(
        "INSERT INTO users (name, email, password, role, company_id) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, role, compId],
        (err, result) => {
          if (err) return res.status(500).json({ success: false, error: err.message });
          res.status(201).json({ success: true, message: "User created successfully", userId: result.insertId });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Auditors (To assign to companies/audits)
export const getAuditors = (req, res) => {
  db.query(
    "SELECT id, name, email FROM users WHERE role = 'AUDITOR'",
    (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, auditors: results });
    }
  );
};

// Update user (Super Admin only)
export const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, role, company_id } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: "Please provide required fields" });
  }

  const compId = (role === "CLIENT" || role === "AUDITOR") ? (company_id || null) : null;

  db.query(
    "UPDATE users SET name = ?, email = ?, role = ?, company_id = ? WHERE id = ?",
    [name, email, role, compId, id],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "User not found" });
      res.json({ success: true, message: "User updated successfully" });
    }
  );
};

// Delete user (Super Admin only)
export const deleteUser = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  });
};
