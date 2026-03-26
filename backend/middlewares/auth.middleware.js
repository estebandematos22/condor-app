const jwt = require("jsonwebtoken");

// 🔐 Middleware para verificar token
const requireAuth = (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "No autorizado: falta token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Ahora guardamos id, dni y role
    req.user = {
      id: decoded.id,
      dni: decoded.dni,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "No autorizado: token inválido o expirado" });
  }
};

// 🔐 Middleware solo para administradores
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso solo para administradores" });
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
};