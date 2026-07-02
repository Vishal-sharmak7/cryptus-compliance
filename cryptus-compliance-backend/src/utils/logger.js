import db from "../config/db.js";

/**
 * Log an activity to the activity_logs table.
 * Call this from controllers after important actions.
 */
export const logActivity = (
  userId, companyId, action, entity, entityId, description, req = null
) => {
  const ip        = req ? (req.ip || req.connection?.remoteAddress) : null;
  const userAgent = req ? req.headers?.["user-agent"] : null;

  db.query(
    `INSERT INTO activity_logs
      (user_id, company_id, action, entity, entity_id, description, ip_address, user_agent)
     VALUES (?,?,?,?,?,?,?,?)`,
    [userId, companyId, action, entity, entityId, description, ip, userAgent],
    () => {} // fire-and-forget
  );
};

/**
 * Create a notification for a user.
 */
export const createNotification = (userId, title, message, type = "INFO", link = null) => {
  db.query(
    `INSERT INTO notifications (user_id, title, message, type, link) VALUES (?,?,?,?,?)`,
    [userId, title, message, type, link],
    () => {}
  );
};
