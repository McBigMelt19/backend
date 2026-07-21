// ============================================================
//  Controller: Transacciones
// ============================================================
const transaccionService = require('../services/transaccion.service');
const { respuestaExitosa, respuestaCreada } = require('../utils/respuesta.helper');

/**
 * GET /api/transactions
 */
const obtenerTodas = async (req, res, next) => {
  try {
    const resultado = await transaccionService.obtenerTransacciones(req.usuarioId, req.query);
    return respuestaExitosa(res, resultado, 'Transacciones obtenidas');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/transactions/:id
 */
const obtenerPorId = async (req, res, next) => {
  try {
    const transaccion = await transaccionService.obtenerTransaccionPorId(req.params.id, req.usuarioId);
    return respuestaExitosa(res, { transaccion }, 'Transacción obtenida');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/transactions
 */
const crear = async (req, res, next) => {
  try {
    const transaccion = await transaccionService.crearTransaccion(req.usuarioId, req.body);
    return respuestaCreada(res, { transaccion }, 'Transacción registrada exitosamente');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/transactions/:id
 */
const eliminar = async (req, res, next) => {
  try {
    const resultado = await transaccionService.eliminarTransaccion(req.params.id, req.usuarioId);
    return respuestaExitosa(res, resultado, 'Transacción eliminada');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  eliminar
};
