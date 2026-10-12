import { verifyToken } from "../utils/token.js";

function extractToken(req) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  return scheme === "Bearer" && token ? token : null;
}

/** Requires a valid JWT. Sets req.userId. */
export function protect(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: "Please log in to continue." });

  try {
    req.userId = verifyToken(token).sub;
    next();
  } catch {
    res.status(401).json({ error: "Your session has expired. Please log in again." });
  }
}

/** Works for guests too — if a valid JWT is present, req.userId is set; otherwise it's left undefined. */
export function optionalAuth(req, res, next) {
  const token = extractToken(req);
  if (token) {
    try {
      req.userId = verifyToken(token).sub;
    } catch {
      // Bad/expired token on an optional route: treat as a guest.
    }
  }
  next();
}
