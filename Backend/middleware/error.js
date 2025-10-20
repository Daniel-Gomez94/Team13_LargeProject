export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: { code: err.code || "ERR_INTERNAL", message: err.message || "Internal Server Error", details: err.details }
  });
};
