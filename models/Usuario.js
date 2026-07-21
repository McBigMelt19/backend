// ============================================================
//  Modelo: Usuario
//  Tabla: usuarios
// ============================================================
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Un usuario tiene muchas carteras
      Usuario.hasMany(models.Cartera, {
        foreignKey: 'usuario_id',
        as: 'carteras',
        onDelete: 'CASCADE'
      });

      // Un usuario tiene muchas transacciones
      Usuario.hasMany(models.Transaccion, {
        foreignKey: 'usuario_id',
        as: 'transacciones',
        onDelete: 'CASCADE'
      });

      // Un usuario tiene muchas metas de ahorro
      Usuario.hasMany(models.MetaAhorro, {
        foreignKey: 'usuario_id',
        as: 'metasAhorro',
        onDelete: 'CASCADE'
      });
    }

    // Método de instancia: excluir password del JSON
    toJSON() {
      const values = Object.assign({}, this.get());
      delete values.password_hash;
      return values;
    }
  }

  Usuario.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      creado_en: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      actualizado_en: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'usuarios',
      timestamps: false // Manejamos creado_en y actualizado_en manualmente
    }
  );

  return Usuario;
};
