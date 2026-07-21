// ============================================================
//  Service: Transacciones
//  CRUD + lógica de actualización de saldo en carteras
// ============================================================
const { Op } = require('sequelize');
const db = require('../models');

/**
 * Obtener transacciones del usuario con filtros y paginación
 */
const obtenerTransacciones = async (usuarioId, filtros = {}) => {
  const {
    tipo,
    cartera_id,
    categoria_id,
    fecha_inicio,
    fecha_fin,
    limite = 20,
    pagina = 1
  } = filtros;

  // Construir condiciones WHERE dinámicamente
  const where = { usuario_id: usuarioId };
  
  if (tipo) where.tipo = tipo;
  if (cartera_id) where.cartera_id = cartera_id;
  if (categoria_id) where.categoria_id = categoria_id;
  if (fecha_inicio || fecha_fin) {
    where.fecha = {};
    if (fecha_inicio) where.fecha[Op.gte] = new Date(fecha_inicio);
    if (fecha_fin) where.fecha[Op.lte] = new Date(fecha_fin);
  }

  const offset = (parseInt(pagina) - 1) * parseInt(limite);

  const { count, rows } = await db.Transaccion.findAndCountAll({
    where,
    include: [
      { model: db.Cartera, as: 'cartera', attributes: ['id', 'nombre'] },
      { model: db.Categoria, as: 'categoria', attributes: ['id', 'nombre', 'tipo', 'icono'] }
    ],
    order: [['fecha', 'DESC']],
    limit: parseInt(limite),
    offset
  });

  return {
    transacciones: rows,
    paginacion: {
      total: count,
      pagina: parseInt(pagina),
      limite: parseInt(limite),
      totalPaginas: Math.ceil(count / parseInt(limite))
    }
  };
};

/**
 * Obtener una transacción por ID
 */
const obtenerTransaccionPorId = async (id, usuarioId) => {
  const transaccion = await db.Transaccion.findOne({
    where: { id, usuario_id: usuarioId },
    include: [
      { model: db.Cartera, as: 'cartera', include: [{ model: db.Moneda, as: 'moneda' }] },
      { model: db.Categoria, as: 'categoria' }
    ]
  });

  if (!transaccion) {
    const error = new Error('Transacción no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return transaccion;
};

/**
 * Crear una transacción y actualizar el saldo de la cartera
 */
const crearTransaccion = async (usuarioId, datos) => {
  const t = await db.sequelize.transaction();

  try {
    // Verificar que la cartera pertenezca al usuario
    const cartera = await db.Cartera.findOne({
      where: { id: datos.cartera_id, usuario_id: usuarioId },
      transaction: t,
      lock: t.LOCK.UPDATE  // Lock para evitar race conditions
    });

    if (!cartera) {
      const error = new Error('Cartera no encontrada o no pertenece al usuario');
      error.statusCode = 404;
      throw error;
    }

    // Verificar que la categoría exista y coincida con el tipo
    const categoria = await db.Categoria.findByPk(datos.categoria_id, { transaction: t });
    if (!categoria) {
      const error = new Error('Categoría no encontrada');
      error.statusCode = 404;
      throw error;
    }
    if (categoria.tipo !== datos.tipo) {
      const error = new Error(`La categoría "${categoria.nombre}" es de tipo ${categoria.tipo}, no coincide con el tipo ${datos.tipo}`);
      error.statusCode = 400;
      throw error;
    }

    // Crear la transacción
    const transaccion = await db.Transaccion.create(
      {
        usuario_id: usuarioId,
        cartera_id: datos.cartera_id,
        categoria_id: datos.categoria_id,
        tipo: datos.tipo,
        monto: datos.monto,
        descripcion: datos.descripcion || null,
        fecha: datos.fecha || new Date()
      },
      { transaction: t }
    );

    // Actualizar saldo de la cartera
    const monto = parseFloat(datos.monto);
    if (datos.tipo === 'INCOME') {
      cartera.saldo_actual = parseFloat(cartera.saldo_actual) + monto;
    } else {
      cartera.saldo_actual = parseFloat(cartera.saldo_actual) - monto;
    }
    cartera.actualizado_en = new Date();
    await cartera.save({ transaction: t });

    await t.commit();

    // Recargar con relaciones
    return await transaccion.reload({
      include: [
        { model: db.Cartera, as: 'cartera', attributes: ['id', 'nombre', 'saldo_actual'] },
        { model: db.Categoria, as: 'categoria', attributes: ['id', 'nombre', 'tipo', 'icono'] }
      ]
    });
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * Eliminar una transacción y revertir el saldo
 */
const eliminarTransaccion = async (id, usuarioId) => {
  const t = await db.sequelize.transaction();

  try {
    const transaccion = await db.Transaccion.findOne({
      where: { id, usuario_id: usuarioId },
      transaction: t
    });

    if (!transaccion) {
      const error = new Error('Transacción no encontrada');
      error.statusCode = 404;
      throw error;
    }

    // Revertir el saldo en la cartera
    const cartera = await db.Cartera.findByPk(transaccion.cartera_id, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (cartera) {
      const monto = parseFloat(transaccion.monto);
      if (transaccion.tipo === 'INCOME') {
        cartera.saldo_actual = parseFloat(cartera.saldo_actual) - monto;
      } else {
        cartera.saldo_actual = parseFloat(cartera.saldo_actual) + monto;
      }
      cartera.actualizado_en = new Date();
      await cartera.save({ transaction: t });
    }

    await transaccion.destroy({ transaction: t });
    await t.commit();

    return { mensaje: 'Transacción eliminada y saldo revertido' };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

module.exports = {
  obtenerTransacciones,
  obtenerTransaccionPorId,
  crearTransaccion,
  eliminarTransaccion
};
