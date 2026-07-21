// ============================================================
//  Service: Carteras (Wallets)
//  CRUD de carteras del usuario autenticado
// ============================================================
const db = require('../models');

/**
 * Obtener todas las carteras del usuario con su moneda
 */
const obtenerCarteras = async (usuarioId) => {
  return await db.Cartera.findAll({
    where: { usuario_id: usuarioId },
    include: [{ model: db.Moneda, as: 'moneda' }],
    order: [['id', 'ASC']]
  });
};

/**
 * Obtener una cartera por ID (verificando que pertenezca al usuario)
 */
const obtenerCarteraPorId = async (id, usuarioId) => {
  const cartera = await db.Cartera.findOne({
    where: { id, usuario_id: usuarioId },
    include: [{ model: db.Moneda, as: 'moneda' }]
  });

  if (!cartera) {
    const error = new Error('Cartera no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return cartera;
};

/**
 * Crear una nueva cartera
 */
const crearCartera = async (usuarioId, datos) => {
  // Verificar que la moneda exista
  const moneda = await db.Moneda.findByPk(datos.moneda_id);
  if (!moneda) {
    const error = new Error('La moneda especificada no existe');
    error.statusCode = 400;
    throw error;
  }

  const cartera = await db.Cartera.create({
    usuario_id: usuarioId,
    moneda_id: datos.moneda_id,
    nombre: datos.nombre,
    saldo_actual: 0
  });

  // Recargar con la moneda incluida
  return await cartera.reload({
    include: [{ model: db.Moneda, as: 'moneda' }]
  });
};

/**
 * Actualizar nombre de una cartera
 */
const actualizarCartera = async (id, usuarioId, datos) => {
  const cartera = await obtenerCarteraPorId(id, usuarioId);

  if (datos.nombre) {
    cartera.nombre = datos.nombre;
  }
  cartera.actualizado_en = new Date();
  await cartera.save();

  return await cartera.reload({
    include: [{ model: db.Moneda, as: 'moneda' }]
  });
};

/**
 * Eliminar una cartera (solo si no tiene transacciones)
 */
const eliminarCartera = async (id, usuarioId) => {
  const cartera = await obtenerCarteraPorId(id, usuarioId);

  // Verificar si tiene transacciones asociadas
  const transacciones = await db.Transaccion.count({
    where: { cartera_id: id }
  });

  if (transacciones > 0) {
    const error = new Error('No se puede eliminar una cartera con transacciones. Elimina las transacciones primero.');
    error.statusCode = 400;
    throw error;
  }

  await cartera.destroy();
  return { mensaje: 'Cartera eliminada exitosamente' };
};

module.exports = {
  obtenerCarteras,
  obtenerCarteraPorId,
  crearCartera,
  actualizarCartera,
  eliminarCartera
};
