import { env } from "../config/env.js";

export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.message === "Not allowed by CORS") return res.status(403).json({ error: err.message });
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Request body must be valid JSON." });

  console.error(err);
  const status = err.status || 500;
  const message = status === 500 && env.isProduction ? "Something went wrong on the server." : err.message;
  res.status(status).json({ error: message });
}
