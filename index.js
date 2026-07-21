// ============================================================
//  WALLET BY JUANJO — Entry Point
//  Express Server con Sequelize + PostgreSQL
// ============================================================
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler.middleware');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
//  MIDDLEWARE GLOBALES
// ============================================================
app.use(helmet());                        // Headers de seguridad
app.use(morgan('dev'));                    // Logger de requests
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true                       // Permitir cookies
}));
app.use(express.json());                   // Parsear JSON body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());                   // Parsear cookies

// ============================================================
//  RUTAS
// ============================================================

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    mensaje: '🚀 Wallet API by JuanJo — Funcionando',
    timestamp: new Date().toISOString()
  });
});

// Montar todas las rutas bajo /api
app.use('/api', routes);

// ============================================================
//  MANEJO DE ERRORES
// ============================================================

// Ruta no encontrada
app.use((_req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: 'Ruta no encontrada'
  });
});

// Error handler global
app.use(errorHandler);

// ============================================================
//  INICIAR SERVIDOR
// ============================================================
const iniciar = async () => {
  try {
    // Probar conexión a la base de datos
    await db.sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');

    // Iniciar servidor Express
    app.listen(PORT, () => {
      console.log(`\n🚀 Wallet API by JuanJo`);
      console.log(`📡 Servidor corriendo en: http://localhost:${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  }
};

iniciar();
