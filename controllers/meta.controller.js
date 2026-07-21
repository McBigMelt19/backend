// ============================================================
//  Controller: Metas de Ahorro
// ============================================================
const metaService = require('../services/meta.service');
const { respuestaExitosa, respuestaCreada } = require('../utils/respuesta.helper');

/**
 * GET /api/goals
 */
const obtenerTodas = async (req, res, next) => {
  try {
    const { estado } = req.query;
    const metas = await metaService.obtenerMetas(req.usuarioId, estado);
    return respuestaExitosa(res, { metas }, 'Metas obtenidas');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/goals/:id
 */
const obtenerPorId = async (req, res, next) => {
  try {
    const meta = await metaService.obtenerMetaPorId(req.params.id, req.usuarioId);
    return respuestaExitosa(res, { meta }, 'Meta obtenida');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/goals
 */
const crear = async (req, res, next) => {
  try {
    const meta = await metaService.crearMeta(req.usuarioId, req.body);
    return respuestaCreada(res, { meta }, 'Meta de ahorro creada exitosamente');
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/goals/:id
 */
const actualizar = async (req, res, next) => {
  try {
    const meta = await metaService.actualizarMeta(req.params.id, req.usuarioId, req.body);
    return respuestaExitosa(res, { meta }, 'Meta actualizada');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/goals/:id/abonar
 */
const abonar = async (req, res, next) => {
  try {
    const meta = await metaService.abonarMeta(req.params.id, req.usuarioId, req.body.monto);
    return respuestaExitosa(res, { meta }, 'Abono registrado exitosamente');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/goals/:id
 */
const eliminar = async (req, res, next) => {
  try {
    const resultado = await metaService.eliminarMeta(req.params.id, req.usuarioId);
    return respuestaExitosa(res, resultado, 'Meta eliminada');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  abonar,
  eliminar
};
