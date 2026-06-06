const ADMIN_KEY = process.env.ADMIN_KEY || "tadiwa-admin-2026";

export function requireAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];

  if (!key || key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Admin key haisi kukodza." });
  }

  next();
}

export function verifyAdminKey(key) {
  return key === ADMIN_KEY;
}
