// ============================================================
//  Modelo: Moneda
//  Tabla: monedas
// ============================================================
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Moneda extends Model {
    static associate(models) {
      // Una moneda es usada por muchas carteras
      Moneda.hasMany(models.Cartera, {
        foreignKey: 'moneda_id',
        as: 'carteras',
        onDelete: 'RESTRICT'
      });
    }
  }

  Moneda.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      codigo: {
        type: DataTypes.STRING(5),
        allowNull: false,
        unique: true
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      simbolo: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      emoji: {
        type: DataTypes.STRING(10),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Moneda',
      tableName: 'monedas',
      timestamps: false
    }
  );

  return Moneda;
};
