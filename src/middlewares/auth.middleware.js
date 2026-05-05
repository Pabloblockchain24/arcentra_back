// middleware/auth.middleware.js

import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const protect = (req, res, next) => {
  try {
    let token;

    // 🔍 1. Buscar token en headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 🍪 2. Opcional: también desde cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // ❌ 3. Si no hay token
    if (!token) {
      return res.status(401).json({ error: "No autorizado, token requerido" });
    }

    // 🔓 4. Verificar token
    const decoded = jwt.verify(token, config.TOKEN_SECRET);

    // 🔥 5. Inyectar usuario en request
    req.user = {
      id: decoded.id,
      clienteId: decoded.clienteId || null,
      tipoUsuario: decoded.tipoUsuario
    };

    next();

  } catch (error) {
    return res.status(401).json({
      error: "Token inválido o expirado"
    });
  }
};