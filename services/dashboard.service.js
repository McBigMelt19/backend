// ============================================================
//  Service: Dashboard
//  Consultas agregadas para el Dashboard del frontend
// ============================================================
const { Op, fn, col, literal } = require('sequelize');
const db = require('../models');
const { rangoMesActual, rangoSemanaActual } = require('../utils/fecha.helper');

/**
 * Obtener resumen completo del Dashboard
 */
const obtenerResumen = async (usuarioId) => {
  const [
    flujoNeto,
    flujoSemanal,
    topFugas,
    carteras,
    metaActiva
  ] = await Promise.all([
    calcularFlujoNeto(usuarioId),
    calcularFlujoSemanal(usuarioId),
    obtenerTopFugas(usuarioId),
    obtenerEstadoCarteras(usuarioId),
    obtenerMetaActiva(usuarioId)
  ]);

  return {
    flujoNeto,
    flujoSemanal,
    topFugas,
    carteras,
    metaActiva
  };
};

/**
 * Flujo neto del mes actual (ingresos - gastos)
 */
const calcularFlujoNeto = async (usuarioId) => {
  const { inicio, fin } = rangoMesActual();

  const resultado = await db.Transaccion.findAll({
    where: {
      usuario_id: usuarioId,
      fecha: { [Op.between]: [inicio, fin] }
    },
    attributes: [
      'tipo',
      [fn('COALESCE', fn('SUM', col('monto')), 0), 'total']
    ],
    group: ['tipo'],
    raw: true
  });

  let ingresos = 0;
  let gastos = 0;
  resultado.forEach((r) => {
    if (r.tipo === 'INCOME') ingresos = parseFloat(r.total);
    if (r.tipo === 'EXPENSE') gastos = parseFloat(r.total);
  });

  return {
    ingresos,
    gastos,
    neto: ingresos - gastos,
    periodo: { inicio, fin }
  };
};

/**
 * Flujo semanal (ingresos y gastos de la semana actual)
 */
const calcularFlujoSemanal = async (usuarioId) => {
  const { inicio, fin } = rangoSemanaActual();

  const resultado = await db.Transaccion.findAll({
    where: {
      usuario_id: usuarioId,
      fecha: { [Op.between]: [inicio, fin] }
    },
    attributes: [
      'tipo',
      [fn('COALESCE', fn('SUM', col('monto')), 0), 'total']
    ],
    group: ['tipo'],
    raw: true
  });

  let ingresosSemana = 0;
  let gastosSemana = 0;
  resultado.forEach((r) => {
    if (r.tipo === 'INCOME') ingresosSemana = parseFloat(r.total);
    if (r.tipo === 'EXPENSE') gastosSemana = parseFloat(r.total);
  });

  return {
    ingresosSemana,
    gastosSemana,
    neto: ingresosSemana - gastosSemana,
    periodo: { inicio, fin }
  };
};

/**
 * Top 3 categorías con más gastos del mes (fugas de capital)
 */
const obtenerTopFugas = async (usuarioId, limite = 3) => {
  const { inicio, fin } = rangoMesActual();

  return await db.Transaccion.findAll({
    where: {
      usuario_id: usuarioId,
      tipo: 'EXPENSE',
      fecha: { [Op.between]: [inicio, fin] }
    },
    attributes: [
      [fn('SUM', col('monto')), 'total']
    ],
    include: [{
      model: db.Categoria,
      as: 'categoria',
      attributes: ['id', 'nombre', 'icono']
    }],
    group: ['categoria.id', 'categoria.nombre', 'categoria.icono'],
    order: [[literal('total'), 'DESC']],
    limit: limite,
    raw: true,
    nest: true
  });
};

/**
 * Estado de todas las carteras del usuario
 */
const obtenerEstadoCarteras = async (usuarioId) => {
  return await db.Cartera.findAll({
    where: { usuario_id: usuarioId },
    include: [{ model: db.Moneda, as: 'moneda' }],
    order: [['id', 'ASC']]
  });
};

/**
 * Meta de ahorro activa principal (la más reciente)
 */
const obtenerMetaActiva = async (usuarioId) => {
  return await db.MetaAhorro.findOne({
    where: {
      usuario_id: usuarioId,
      estado: 'ACTIVA'
    },
    order: [['creado_en', 'DESC']]
  });
};

module.exports = {
  obtenerResumen,
  calcularFlujoNeto,
  calcularFlujoSemanal,
  obtenerTopFugas,
  obtenerEstadoCarteras,
  obtenerMetaActiva
};
