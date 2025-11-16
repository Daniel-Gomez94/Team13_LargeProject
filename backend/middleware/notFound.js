export const notFound = (_req, res) =>
  res.status(404).json({ error: { code: "ERR_NOT_FOUND", message: "Route not found" }});
