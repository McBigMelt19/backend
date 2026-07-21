// ============================================================
//  Routes: Categorías
//  GET /api/categories         → Todas las categorías
//  GET /api/categories?tipo=INCOME  → Filtrar por tipo
// ============================================================
const router = require('express').Router();
const categoriaController = require('../controllers/categoria.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', categoriaController.obtenerTodas);

module.exports = router;
