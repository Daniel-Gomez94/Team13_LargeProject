export const validate = (schema) => (req, _res, next) => {
  try { const parsed = schema.parse({ body: req.body, query: req.query, params: req.params });
        Object.assign(req, parsed); next(); }
  catch (e) { next({ status: 400, code: "ERR_VALIDATION", message: "Invalid request", details: e.errors }); }
};
