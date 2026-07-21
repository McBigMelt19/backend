// ============================================================
//  Routes: Autenticación
//  POST /api/auth/register
//  POST /api/auth/login
//  POST /api/auth/logout
//  GET  /api/auth/perfil
// ============================================================
const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validar = require('../middleware/validar.middleware');
const { validarRegistro, validarLogin } = require('../validations/auth.validation');

router.post('/register', validarRegistro, validar, authController.register);
router.post('/login', validarLogin, validar, authController.login);
router.post('/logout', authController.logout);
router.get('/perfil', authMiddleware, authController.perfil);

module.exports = router;
