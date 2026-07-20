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
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  db.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Profile updated successfully" });
    }
  );
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All password fields are required" });
  }

  db.query(
    "SELECT password FROM users WHERE id = ?",
    [req.user.id],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: "User not found" });

      const user = results[0];
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect current password" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, req.user.id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Password updated successfully" });
        }
      );
    }
  );
};