// ============================================================
//  Controller: Monedas
// ============================================================
const monedaService = require('../services/moneda.service');
const { respuestaExitosa } = require('../utils/respuesta.helper');

/**
 * GET /api/currencies
 */
const obtenerTodas = async (req, res, next) => {
  try {
    const monedas = await monedaService.obtenerMonedas();
    return respuestaExitosa(res, { monedas }, 'Monedas obtenidas');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerTodas
};
