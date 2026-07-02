import jwt from "jsonwebtoken";
import db from "../config/db.js";

const protect = (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {

    token =
      req.headers.authorization.split(" ")[1];

    try {

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Fetch fresh user data from DB to ensure role/company_id are up to date
      db.query(
        "SELECT u.id, u.name, u.email, u.role, u.company_id, c.name as company_name FROM users u LEFT JOIN companies c ON c.id = u.company_id WHERE u.id = ?", 
        [decoded.id], 
        (err, results) => {
        if (err || results.length === 0) {
          return res.status(401).json({ message: "Invalid Token or User not found" });
        }
        req.user = results[0];
        next();
      });

    } catch (error) {

      return res.status(401).json({
        message: "Invalid Token",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "No Token",
    });
  }
};

export default protect;