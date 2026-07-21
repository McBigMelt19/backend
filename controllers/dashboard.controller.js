// ============================================================
//  Controller: Dashboard
// ============================================================
const dashboardService = require('../services/dashboard.service');
const { respuestaExitosa } = require('../utils/respuesta.helper');

/**
 * GET /api/dashboard
 * Retorna el resumen completo para el Dashboard del frontend
 */
const obtenerResumen = async (req, res, next) => {
  try {
    const resumen = await dashboardService.obtenerResumen(req.usuarioId);
    return respuestaExitosa(res, resumen, 'Resumen del dashboard obtenido');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerResumen
};
