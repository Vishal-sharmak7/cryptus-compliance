/**
 * Standard API response helpers.
 */
export const success = (res, data = {}, message = "Success", statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

export const created = (res, data = {}, message = "Created successfully") =>
  success(res, data, message, 201);

export const error = (res, message = "Internal Server Error", statusCode = 500, errors = null) =>
  res.status(statusCode).json({ success: false, message, ...(errors && { errors }) });

export const notFound = (res, message = "Resource not found") =>
  error(res, message, 404);

export const forbidden = (res, message = "Access denied") =>
  error(res, message, 403);

export const badRequest = (res, message = "Bad request", errors = null) =>
  error(res, message, 400, errors);

/**
 * Build paginated meta object.
 */
export const paginate = (total, page, limit) => ({
  total,
  page: Number(page),
  limit: Number(limit),
  pages: Math.ceil(total / limit),
});
