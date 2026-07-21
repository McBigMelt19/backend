// ============================================================
//  Controller: Carteras (Wallets)
// ============================================================
const carteraService = require('../services/cartera.service');
const { respuestaExitosa, respuestaCreada } = require('../utils/respuesta.helper');

/**
 * GET /api/wallets
 */
const obtenerTodas = async (req, res, next) => {
  try {
    const carteras = await carteraService.obtenerCarteras(req.usuarioId);
    return respuestaExitosa(res, { carteras }, 'Carteras obtenidas');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/wallets/:id
 */
const obtenerPorId = async (req, res, next) => {
  try {
    const cartera = await carteraService.obtenerCarteraPorId(req.params.id, req.usuarioId);
    return respuestaExitosa(res, { cartera }, 'Cartera obtenida');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/wallets
 */
const crear = async (req, res, next) => {
  try {
    const cartera = await carteraService.crearCartera(req.usuarioId, req.body);
    return respuestaCreada(res, { cartera }, 'Cartera creada exitosamente');
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/wallets/:id
 */
const actualizar = async (req, res, next) => {
  try {
    const cartera = await carteraService.actualizarCartera(req.params.id, req.usuarioId, req.body);
    return respuestaExitosa(res, { cartera }, 'Cartera actualizada');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/wallets/:id
 */
const eliminar = async (req, res, next) => {
  try {
    const resultado = await carteraService.eliminarCartera(req.params.id, req.usuarioId);
    return respuestaExitosa(res, resultado, 'Cartera eliminada');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};
