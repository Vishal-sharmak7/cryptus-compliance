import bcrypt from "bcryptjs";
import db from "../config/db.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {

        if (results.length > 0) {
          return res.status(400).json({
            message: "User already exists",
          });
        }

        const hashedPassword =
          await bcrypt.hash(password, 10);

        db.query(
          `INSERT INTO users
          (name,email,password)
          VALUES(?,?,?)`,
          [name, email, hashedPassword],
          (err, result) => {

            if (err) {
              return res.status(500).json(err);
            }

            res.status(201).json({
              message: "User registered",
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

export const login = (req, res) => {

  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, results) => {

      if (results.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const user = results[0];

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const token = generateToken(user);

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  );
};


export const profile = (req, res) => {
  res.json({
    user: req.user,
  });
};

export const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.id;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Name and email are required." });
  }

  try {
    // Check if email is already taken by another user
    db.query(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, userId],
      async (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (results.length > 0) {
          return res.status(400).json({ success: false, message: "Email is already in use by another account." });
        }

        let query, params;
        if (password && password.trim() !== "") {
          const hashedPassword = await bcrypt.hash(password, 10);
          query = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
          params = [name, email, hashedPassword, userId];
        } else {
          query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
          params = [name, email, userId];
        }

        db.query(query, params, (err, result) => {
          if (err) return res.status(500).json({ success: false, error: err.message });
          if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "User not found." });
          }

          // Fetch updated user to return a fresh token
          db.query(
            "SELECT u.id, u.name, u.email, u.role, u.company_id, c.name as company_name FROM users u LEFT JOIN companies c ON c.id = u.company_id WHERE u.id = ?",
            [userId],
            (err, rows) => {
              if (err) return res.status(500).json({ success: false, error: err.message });
              const updatedUser = rows[0];
              const token = generateToken(updatedUser);
              res.json({
                success: true,
                message: "Profile updated successfully.",
                token,
                user: updatedUser,
              });
            }
          );
        });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};