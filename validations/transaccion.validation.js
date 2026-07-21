// ============================================================
//  Validaciones: Transacciones
// ============================================================
const { body, param, query } = require('express-validator');

const validarCrearTransaccion = [
  body('cartera_id')
    .notEmpty().withMessage('La cartera es obligatoria')
    .isInt({ min: 1 }).withMessage('cartera_id debe ser un entero positivo'),
  
  body('categoria_id')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isInt({ min: 1 }).withMessage('categoria_id debe ser un entero positivo'),
  
  body('tipo')
    .notEmpty().withMessage('El tipo es obligatorio')
    .isIn(['INCOME', 'EXPENSE']).withMessage('El tipo debe ser INCOME o EXPENSE'),
  
  body('monto')
    .notEmpty().withMessage('El monto es obligatorio')
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El monto debe ser un número válido')
    .custom((value) => {
      if (parseFloat(value) <= 0) throw new Error('El monto debe ser mayor a 0');
      return true;
    }),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('La descripción no puede superar 255 caracteres'),
  
  body('fecha')
    .optional()
    .isISO8601().withMessage('La fecha debe tener formato ISO 8601 válido')
];

const validarFiltrosTransaccion = [
  query('tipo')
    .optional()
    .isIn(['INCOME', 'EXPENSE']).withMessage('El filtro tipo debe ser INCOME o EXPENSE'),
  
  query('cartera_id')
    .optional()
    .isInt({ min: 1 }).withMessage('cartera_id debe ser un entero positivo'),
  
  query('categoria_id')
    .optional()
    .isInt({ min: 1 }).withMessage('categoria_id debe ser un entero positivo'),
  
  query('fecha_inicio')
    .optional()
    .isISO8601().withMessage('fecha_inicio debe tener formato ISO 8601'),
  
  query('fecha_fin')
    .optional()
    .isISO8601().withMessage('fecha_fin debe tener formato ISO 8601'),
  
  query('limite')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('límite debe ser entre 1 y 100'),
  
  query('pagina')
    .optional()
    .isInt({ min: 1 }).withMessage('página debe ser mayor a 0')
];

const validarIdTransaccion = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de transacción inválido')
];

module.exports = {
  validarCrearTransaccion,
  validarFiltrosTransaccion,
  validarIdTransaccion
};
