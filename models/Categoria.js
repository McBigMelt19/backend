// ============================================================
//  Modelo: Categoria
//  Tabla: categorias
// ============================================================
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
      // Una categoría se usa en muchas transacciones
      Categoria.hasMany(models.Transaccion, {
        foreignKey: 'categoria_id',
        as: 'transacciones',
        onDelete: 'RESTRICT'
      });
    }
  }

  Categoria.init(
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
      tipo: {
        type: DataTypes.ENUM('INCOME', 'EXPENSE'),
        allowNull: false
      },
      icono: {
        type: DataTypes.STRING(10),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Categoria',
      tableName: 'categorias',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['nombre', 'tipo'],
          name: 'uq_categoria_nombre_tipo'
        }
      ]
    }
  );

  return Categoria;
};
