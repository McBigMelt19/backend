// ============================================================
//  Modelo: MetaAhorro
//  Tabla: metas_ahorro
// ============================================================
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MetaAhorro extends Model {
    static associate(models) {
      // Una meta de ahorro pertenece a un usuario
      MetaAhorro.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario',
        onDelete: 'CASCADE'
      });
    }

    // Getter: porcentaje de progreso calculado
    get progreso() {
      const objetivo = parseFloat(this.monto_objetivo) || 1;
      const actual = parseFloat(this.monto_actual) || 0;
      return Math.min(Math.round((actual / objetivo) * 100), 100);
    }
  }

  MetaAhorro.init(
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
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      monto_objetivo: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          min: 0.01
        }
      },
      monto_actual: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      fecha_limite: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      estado: {
        type: DataTypes.ENUM('ACTIVA', 'COMPLETADA', 'CANCELADA'),
        allowNull: false,
        defaultValue: 'ACTIVA'
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
      modelName: 'MetaAhorro',
      tableName: 'metas_ahorro',
      timestamps: false
    }
  );

  return MetaAhorro;
};
