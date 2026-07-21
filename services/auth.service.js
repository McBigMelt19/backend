// ============================================================
//  Service: Autenticación
//  Registro, Login, Perfil
// ============================================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const SALT_ROUNDS = 10;

/**
 * Registrar un nuevo usuario
 */
const registrar = async ({ nombre, email, password }) => {
  // Verificar si el email ya existe
  const existente = await db.Usuario.findOne({ where: { email } });
  if (existente) {
    const error = new Error('Ya existe una cuenta con este email');
    error.statusCode = 409;
    throw error;
  }

  // Hashear password
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  // Crear usuario
  const usuario = await db.Usuario.create({
    nombre,
    email,
    password_hash
  });

  // Generar token
  const token = generarToken(usuario.id);

  // Crear carteras por defecto (una por cada moneda existente)
  const monedas = await db.Moneda.findAll();
  for (const moneda of monedas) {
    await db.Cartera.create({
      usuario_id: usuario.id,
      moneda_id: moneda.id,
      nombre: `Efectivo ${moneda.nombre}`,
      saldo_actual: 0
    });
  }

  return { usuario, token };
};

/**
 * Iniciar sesión
 */
const login = async ({ email, password }) => {
  // Buscar usuario por email
  const usuario = await db.Usuario.findOne({ where: { email } });
  if (!usuario) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  // Verificar password
  const passwordValido = await bcrypt.compare(password, usuario.password_hash);
  if (!passwordValido) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  // Generar token
  const token = generarToken(usuario.id);

  return { usuario, token };
};

/**
 * Obtener perfil del usuario autenticado
 */
const obtenerPerfil = async (usuarioId) => {
  const usuario = await db.Usuario.findByPk(usuarioId, {
    include: [
      {
        model: db.Cartera,
        as: 'carteras',
        include: [{ model: db.Moneda, as: 'moneda' }]
      }
    ]
  });

  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return usuario;
};

/**
 * Generar JWT
 */
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

module.exports = {
  registrar,
  login,
  obtenerPerfil,
  generarToken
};
