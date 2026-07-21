// ============================================================
//  Service: Metas de Ahorro
//  CRUD + lógica de abonos y cambios de estado
// ============================================================
const db = require('../models');

/**
 * Obtener todas las metas del usuario
 */
const obtenerMetas = async (usuarioId, estado = null) => {
  const where = { usuario_id: usuarioId };
  if (estado) where.estado = estado;

  return await db.MetaAhorro.findAll({
    where,
    order: [['creado_en', 'DESC']]
  });
};

/**
 * Obtener una meta por ID
 */
const obtenerMetaPorId = async (id, usuarioId) => {
  const meta = await db.MetaAhorro.findOne({
    where: { id, usuario_id: usuarioId }
  });

  if (!meta) {
    const error = new Error('Meta de ahorro no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return meta;
};

/**
 * Crear una nueva meta de ahorro
 */
const crearMeta = async (usuarioId, datos) => {
  return await db.MetaAhorro.create({
    usuario_id: usuarioId,
    nombre: datos.nombre,
    monto_objetivo: datos.monto_objetivo,
    monto_actual: 0,
    fecha_inicio: datos.fecha_inicio || new Date(),
    fecha_limite: datos.fecha_limite || null,
    estado: 'ACTIVA'
  });
};

/**
 * Actualizar una meta de ahorro
 */
const actualizarMeta = async (id, usuarioId, datos) => {
  const meta = await obtenerMetaPorId(id, usuarioId);

  // Actualizar campos permitidos
  if (datos.nombre !== undefined) meta.nombre = datos.nombre;
  if (datos.monto_objetivo !== undefined) meta.monto_objetivo = datos.monto_objetivo;
  if (datos.monto_actual !== undefined) meta.monto_actual = datos.monto_actual;
  if (datos.fecha_limite !== undefined) meta.fecha_limite = datos.fecha_limite;
  if (datos.estado !== undefined) meta.estado = datos.estado;

  meta.actualizado_en = new Date();

  // Auto-completar si el monto actual alcanza el objetivo
  if (parseFloat(meta.monto_actual) >= parseFloat(meta.monto_objetivo)) {
    meta.estado = 'COMPLETADA';
  }

  await meta.save();
  return meta;
};

/**
 * Abonar monto a una meta de ahorro
 */
const abonarMeta = async (id, usuarioId, monto) => {
  const meta = await obtenerMetaPorId(id, usuarioId);

  if (meta.estado !== 'ACTIVA') {
    const error = new Error('Solo se puede abonar a metas activas');
    error.statusCode = 400;
    throw error;
  }

  meta.monto_actual = parseFloat(meta.monto_actual) + parseFloat(monto);
  meta.actualizado_en = new Date();

  // Auto-completar si se alcanza el objetivo
  if (parseFloat(meta.monto_actual) >= parseFloat(meta.monto_objetivo)) {
    meta.estado = 'COMPLETADA';
  }

  await meta.save();
  return meta;
};

/**
 * Eliminar una meta de ahorro
 */
const eliminarMeta = async (id, usuarioId) => {
  const meta = await obtenerMetaPorId(id, usuarioId);
  await meta.destroy();
  return { mensaje: 'Meta de ahorro eliminada exitosamente' };
};

module.exports = {
  obtenerMetas,
  obtenerMetaPorId,
  crearMeta,
  actualizarMeta,
  abonarMeta,
  eliminarMeta
};
