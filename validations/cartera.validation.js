// ============================================================
//  Validaciones: Carteras (Wallets)
// ============================================================
const { body, param } = require('express-validator');

const validarCrearCartera = [
  body('moneda_id')
    .notEmpty().withMessage('La moneda es obligatoria')
    .isInt({ min: 1 }).withMessage('moneda_id debe ser un entero positivo'),
  
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre de la cartera es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
];

const validarActualizarCartera = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de cartera inválido'),
  
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
];

const validarIdCartera = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de cartera inválido')
];

module.exports = {
  validarCrearCartera,
  validarActualizarCartera,
  validarIdCartera
};
