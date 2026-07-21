// ============================================================
//  Router Index — Registra todas las rutas bajo /api
// ============================================================
const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/wallets', require('./cartera.routes'));
router.use('/transactions', require('./transaccion.routes'));
router.use('/categories', require('./categoria.routes'));
router.use('/currencies', require('./moneda.routes'));
router.use('/goals', require('./meta.routes'));
router.use('/dashboard', require('./dashboard.routes'));

module.exports = router;
