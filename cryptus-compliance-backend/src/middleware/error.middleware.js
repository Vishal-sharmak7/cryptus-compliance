/**
 * Global async error handler.
 * Catches any unhandled errors from async controllers and sends a clean JSON response.
 */
export const errorHandler = (err, req, res, next) => {
  console.error("[ERROR]", err.message, err.stack?.split("\n")[1] || "");

  const statusCode = err.statusCode || err.status || 500;
  const message    = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * 404 handler — mount last, before errorHandler.
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};
