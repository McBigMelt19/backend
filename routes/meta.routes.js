// ============================================================
//  Routes: Metas de Ahorro (Savings Goals)
//  GET    /api/goals
//  GET    /api/goals/:id
//  POST   /api/goals
//  PUT    /api/goals/:id
//  POST   /api/goals/:id/abonar
//  DELETE /api/goals/:id
// ============================================================
const router = require('express').Router();
const metaController = require('../controllers/meta.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validar = require('../middleware/validar.middleware');
const {
  validarCrearMeta,
  validarActualizarMeta,
  validarAbonoMeta,
  validarIdMeta
} = require('../validations/meta.validation');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/', metaController.obtenerTodas);
router.get('/:id', validarIdMeta, validar, metaController.obtenerPorId);
router.post('/', validarCrearMeta, validar, metaController.crear);
router.put('/:id', validarActualizarMeta, validar, metaController.actualizar);
router.post('/:id/abonar', validarAbonoMeta, validar, metaController.abonar);
router.delete('/:id', validarIdMeta, validar, metaController.eliminar);

module.exports = router;
