// ============================================================
//  Validaciones: Metas de Ahorro
// ============================================================
const { body, param } = require('express-validator');

const validarCrearMeta = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre de la meta es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('monto_objetivo')
    .notEmpty().withMessage('El monto objetivo es obligatorio')
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El monto debe ser un número válido')
    .custom((value) => {
      if (parseFloat(value) <= 0) throw new Error('El monto objetivo debe ser mayor a 0');
      return true;
    }),
  
  body('fecha_limite')
    .optional()
    .isISO8601().withMessage('La fecha límite debe tener formato ISO 8601 válido')
];

const validarActualizarMeta = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de meta inválido'),
  
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('monto_objetivo')
    .optional()
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El monto debe ser un número válido'),
  
  body('monto_actual')
    .optional()
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El monto debe ser un número válido'),
  
  body('estado')
    .optional()
    .isIn(['ACTIVA', 'COMPLETADA', 'CANCELADA']).withMessage('Estado inválido'),
  
  body('fecha_limite')
    .optional()
    .isISO8601().withMessage('La fecha límite debe tener formato ISO 8601 válido')
];

const validarAbonoMeta = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de meta inválido'),
  
  body('monto')
    .notEmpty().withMessage('El monto del abono es obligatorio')
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El monto debe ser un número válido')
    .custom((value) => {
      if (parseFloat(value) <= 0) throw new Error('El monto debe ser mayor a 0');
      return true;
    })
];

const validarIdMeta = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de meta inválido')
];

module.exports = {
  validarCrearMeta,
  validarActualizarMeta,
  validarAbonoMeta,
  validarIdMeta
};
