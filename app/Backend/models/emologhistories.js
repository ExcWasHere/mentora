'use strict';

module.exports = (sequelize, DataTypes) => {
  const EmologHistory = sequelize.define(
    'EmologHistory',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      subdistrict_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'subdistricts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      emotion_label: {
        type: DataTypes.STRING,
        allowNull: false
      },
      text_input: {
        type: DataTypes.STRING,
        allowNull: false
      },
      recorded_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      tableName: 'emolog_histories',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  EmologHistory.associate = function (models) {
    EmologHistory.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    EmologHistory.belongsTo(models.Subdistrict, {
      foreignKey: 'subdistrict_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };

  return EmologHistory;
};
