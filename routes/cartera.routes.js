// ============================================================
//  Routes: Carteras (Wallets)
//  GET    /api/wallets
//  GET    /api/wallets/:id
//  POST   /api/wallets
//  PUT    /api/wallets/:id
//  DELETE /api/wallets/:id
// ============================================================
const router = require('express').Router();
const carteraController = require('../controllers/cartera.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validar = require('../middleware/validar.middleware');
const {
  validarCrearCartera,
  validarActualizarCartera,
  validarIdCartera
} = require('../validations/cartera.validation');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/', carteraController.obtenerTodas);
router.get('/:id', validarIdCartera, validar, carteraController.obtenerPorId);
router.post('/', validarCrearCartera, validar, carteraController.crear);
router.put('/:id', validarActualizarCartera, validar, carteraController.actualizar);
router.delete('/:id', validarIdCartera, validar, carteraController.eliminar);

module.exports = router;
