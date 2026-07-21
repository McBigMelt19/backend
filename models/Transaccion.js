// ============================================================
//  Modelo: Transaccion
//  Tabla: transacciones (Tabla Central)
// ============================================================
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaccion extends Model {
    static associate(models) {
      // Una transacción pertenece a un usuario
      Transaccion.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario',
        onDelete: 'CASCADE'
      });

      // Una transacción pertenece a una cartera
      Transaccion.belongsTo(models.Cartera, {
        foreignKey: 'cartera_id',
        as: 'cartera',
        onDelete: 'CASCADE'
      });

      // Una transacción pertenece a una categoría
      Transaccion.belongsTo(models.Categoria, {
        foreignKey: 'categoria_id',
        as: 'categoria',
        onDelete: 'RESTRICT'
      });
    }
  }

  Transaccion.init(
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
      cartera_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'carteras',
          key: 'id'
        }
      },
      categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categorias',
          key: 'id'
        }
      },
      tipo: {
        type: DataTypes.ENUM('INCOME', 'EXPENSE'),
        allowNull: false
      },
      monto: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          min: 0.01 // No permitir montos negativos ni cero
        }
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'Transaccion',
      tableName: 'transacciones',
      timestamps: false
    }
  );

  return Transaccion;
};
