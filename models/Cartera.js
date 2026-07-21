// ============================================================
//  Modelo: Cartera
//  Tabla: carteras
// ============================================================
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cartera extends Model {
    static associate(models) {
      // Una cartera pertenece a un usuario
      Cartera.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario',
        onDelete: 'CASCADE'
      });

      // Una cartera usa una moneda
      Cartera.belongsTo(models.Moneda, {
        foreignKey: 'moneda_id',
        as: 'moneda',
        onDelete: 'RESTRICT'
      });

      // Una cartera tiene muchas transacciones
      Cartera.hasMany(models.Transaccion, {
        foreignKey: 'cartera_id',
        as: 'transacciones',
        onDelete: 'CASCADE'
      });
    }
  }

  Cartera.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      moneda_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'monedas',
          key: 'id'
        }
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      saldo_actual: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
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
      modelName: 'Cartera',
      tableName: 'carteras',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['usuario_id', 'moneda_id'],
          name: 'uq_cartera_usuario_moneda'
        }
      ]
    }
  );

  return Cartera;
};
