'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class emologhistories extends Model {
    static associate(models) {
      emologhistories.belongsTo(models.user, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      emologhistories.belongsTo(models.subdistrict, {
        foreignKey: 'subdistrict_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }

  emologhistories.init({
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
      allowNull: true 
    },
    emotion_label: {
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
  }, {
    sequelize,
    modelName: 'emologhistories',
    tableName: 'emolog_histories',
    underscored: true
  });

  return emologhistories;
};
