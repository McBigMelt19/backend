// ============================================================
//  Service: Categorías
//  Consulta de categorías (solo lectura — son datos semilla)
// ============================================================
const db = require('../models');

/**
 * Obtener todas las categorías
 */
const obtenerCategorias = async () => {
  return await db.Categoria.findAll({
    order: [['tipo', 'ASC'], ['nombre', 'ASC']]
  });
};

/**
 * Obtener categorías filtradas por tipo
 */
const obtenerCategoriasPorTipo = async (tipo) => {
  return await db.Categoria.findAll({
    where: { tipo },
    order: [['nombre', 'ASC']]
  });
};

module.exports = {
  obtenerCategorias,
  obtenerCategoriasPorTipo
};
