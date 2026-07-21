// ============================================================
//  Configuración de conexión a PostgreSQL con Sequelize
//  Lee las variables de entorno desde .env
// ============================================================
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'wallet_juanjo',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres',
    logging: console.log,
    define: {
      timestamps: false,    // Manejamos timestamps manualmente en cada modelo
      underscored: true,    // snake_case en la DB
      freezeTableName: true // No pluralizar nombres de tabla
    }
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || null,
    database: (process.env.DB_NAME || 'wallet_juanjo') + '_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: false,
      underscored: true,
      freezeTableName: true
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: false,
      underscored: true,
      freezeTableName: true
    }
  }
};
