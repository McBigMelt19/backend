// ============================================================
//  Controller: Autenticación
// ============================================================
const authService = require('../services/auth.service');
const { respuestaExitosa, respuestaCreada, respuestaError } = require('../utils/respuesta.helper');

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { usuario, token } = await authService.registrar(req.body);

    // Setear cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    return respuestaCreada(res, { usuario, token }, 'Registro exitoso');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { usuario, token } = await authService.login(req.body);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return respuestaExitosa(res, { usuario, token }, 'Login exitoso');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  res.clearCookie('token');
  return respuestaExitosa(res, null, 'Sesión cerrada exitosamente');
};

/**
 * GET /api/auth/perfil
 */
const perfil = async (req, res, next) => {
  try {
    const usuario = await authService.obtenerPerfil(req.usuarioId);
    return respuestaExitosa(res, { usuario }, 'Perfil obtenido');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  perfil
};
