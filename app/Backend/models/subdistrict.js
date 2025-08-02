'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class subdistrict extends Model {
    static associate(models) {
      subdistrict.hasMany(models.emologhistories, {
        foreignKey: 'subdistrict_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
  }

  subdistrict.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    district_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'districts', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',

    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
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
    modelName: 'subdistrict',
    tableName: 'subdistricts',
    underscored: true
  });

  return subdistrict;
};
