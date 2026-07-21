// ============================================================
//  Routes: Transacciones
//  GET    /api/transactions
//  GET    /api/transactions/:id
//  POST   /api/transactions
//  DELETE /api/transactions/:id
// ============================================================
const router = require('express').Router();
const transaccionController = require('../controllers/transaccion.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validar = require('../middleware/validar.middleware');
const {
  validarCrearTransaccion,
  validarFiltrosTransaccion,
  validarIdTransaccion
} = require('../validations/transaccion.validation');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/', validarFiltrosTransaccion, validar, transaccionController.obtenerTodas);
router.get('/:id', validarIdTransaccion, validar, transaccionController.obtenerPorId);
router.post('/', validarCrearTransaccion, validar, transaccionController.crear);
router.delete('/:id', validarIdTransaccion, validar, transaccionController.eliminar);

module.exports = router;
