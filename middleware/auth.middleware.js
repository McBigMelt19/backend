// ============================================================
//  Middleware: Autenticación JWT
//  Verifica el token en cookies o en el header Authorization
// ============================================================
const jwt = require('jsonwebtoken');
const db = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Buscar token en cookies o en el header Authorization
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Acceso denegado. No se proporcionó token de autenticación.'
      });
    }

    // 2. Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Verificar que el usuario aún existe en la DB
    const usuario = await db.Usuario.findByPk(decoded.id);
    if (!usuario) {
      return res.status(401).json({
        ok: false,
        mensaje: 'El usuario asociado a este token ya no existe.'
      });
    }

    // 4. Adjuntar usuario al request para uso posterior
    req.usuario = usuario;
    req.usuarioId = usuario.id;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        mensaje: 'Token expirado. Por favor inicia sesión nuevamente.'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        ok: false,
        mensaje: 'Token inválido.'
      });
    }
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno en la autenticación.'
    });
  }
};

module.exports = authMiddleware;
