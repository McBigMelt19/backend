// ============================================================
//  Middleware: Validación con express-validator
//  Ejecuta las validaciones y retorna errores si existen
// ============================================================
const { validationResult } = require('express-validator');

const validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(422).json({
      ok: false,
      mensaje: 'Error de validación en los datos enviados',
      errores: errores.array().map((e) => ({
        campo: e.path,
        mensaje: e.msg,
        valor: e.value
      }))
    });
  }
  next();
};

module.exports = validar;
