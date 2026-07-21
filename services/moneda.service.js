// ============================================================
//  Service: Monedas
//  Consulta de monedas (solo lectura — son datos semilla)
// ============================================================
const db = require('../models');

/**
 * Obtener todas las monedas disponibles
 */
const obtenerMonedas = async () => {
  return await db.Moneda.findAll({
    order: [['id', 'ASC']]
  });
};

module.exports = {
  obtenerMonedas
};
