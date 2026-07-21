// ============================================================
//  Routes: Monedas (Currencies)
//  GET /api/currencies
// ============================================================
const router = require('express').Router();
const monedaController = require('../controllers/moneda.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', monedaController.obtenerTodas);

module.exports = router;
