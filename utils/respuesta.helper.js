// ============================================================
//  Utils: Helpers de respuesta HTTP estandarizada
// ============================================================

/**
 * Respuesta exitosa estándar
 */
const respuestaExitosa = (res, datos, mensaje = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    ok: true,
    mensaje,
    datos
  });
};

/**
 * Respuesta de creación exitosa (201)
 */
const respuestaCreada = (res, datos, mensaje = 'Recurso creado exitosamente') => {
  return respuestaExitosa(res, datos, mensaje, 201);
};

/**
 * Respuesta de error estándar
 */
const respuestaError = (res, mensaje = 'Error interno del servidor', statusCode = 500, errores = null) => {
  const respuesta = {
    ok: false,
    mensaje
  };
  if (errores) respuesta.errores = errores;
  return res.status(statusCode).json(respuesta);
};

/**
 * Respuesta de no encontrado (404)
 */
const respuestaNoEncontrado = (res, recurso = 'Recurso') => {
  return respuestaError(res, `${recurso} no encontrado`, 404);
};

module.exports = {
  respuestaExitosa,
  respuestaCreada,
  respuestaError,
  respuestaNoEncontrado
};
