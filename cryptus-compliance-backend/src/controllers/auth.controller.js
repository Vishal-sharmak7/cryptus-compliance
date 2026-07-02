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