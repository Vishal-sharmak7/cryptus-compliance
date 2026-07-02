import db from "../config/db.js";
import { success } from "../utils/response.js";

const query = (sql, params) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );

// ── GET /api/notifications ────────────────────────────────────────
export const getNotifications = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const rows = await query(
    `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [req.user.id, Number(limit), offset]
  );
  const [{ total }] = await query(
    "SELECT COUNT(*) as total FROM notifications WHERE user_id = ?", [req.user.id]
  );
  const [{ unread }] = await query(
    "SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND is_read = FALSE", [req.user.id]
  );
  return success(res, { notifications: rows, unread: Number(unread), meta: { total, page: Number(page), limit: Number(limit) } });
};

// ── PUT /api/notifications/:id/read ──────────────────────────────
export const markAsRead = async (req, res) => {
  if (req.params.id === "all") {
    await query("UPDATE notifications SET is_read = TRUE WHERE user_id = ?", [req.user.id]);
    return success(res, {}, "All notifications marked as read");
  }
  await query(
    "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.id]
  );
  return success(res, {}, "Notification marked as read");
};

// ── DELETE /api/notifications/:id ────────────────────────────────
export const deleteNotification = async (req, res) => {
  await query(
    "DELETE FROM notifications WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.id]
  );
  return success(res, {}, "Notification deleted");
};
