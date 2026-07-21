// ============================================================
//  Controller: Categorías
// ============================================================
const categoriaService = require('../services/categoria.service');
const { respuestaExitosa } = require('../utils/respuesta.helper');

/**
 * GET /api/categories
 */
const obtenerTodas = async (req, res, next) => {
  try {
    const { tipo } = req.query;
    let categorias;

    if (tipo) {
      categorias = await categoriaService.obtenerCategoriasPorTipo(tipo);
    } else {
      categorias = await categoriaService.obtenerCategorias();
    }

    return respuestaExitosa(res, { categorias }, 'Categorías obtenidas');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerTodas
};
