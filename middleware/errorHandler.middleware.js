// ============================================================
//  Middleware: Manejo Global de Errores
//  Captura todos los errores no manejados y retorna respuesta limpia
// ============================================================

const errorHandler = (err, req, res, _next) => {
  console.error('❌ Error:', err);

  // Error de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const errores = err.errors.map((e) => ({
      campo: e.path,
      mensaje: e.message
    }));
    return res.status(400).json({
      ok: false,
      mensaje: 'Error de validación',
      errores
    });
  }

  // Error de constraint único de Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    const errores = err.errors.map((e) => ({
      campo: e.path,
      mensaje: `El valor '${e.value}' ya está en uso para el campo '${e.path}'.`
    }));
    return res.status(409).json({
      ok: false,
      mensaje: 'Conflicto: registro duplicado',
      errores
    });
  }

  // Error de foreign key de Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      ok: false,
      mensaje: 'Error de referencia: el registro relacionado no existe o no puede eliminarse.'
    });
  }

  // Error de validación de express-validator (personalizado)
  if (err.status === 422) {
    return res.status(422).json({
      ok: false,
      mensaje: err.message || 'Error de validación',
      errores: err.errores || []
    });
  }

  // Error genérico
  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    ok: false,
    mensaje: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
