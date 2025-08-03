'use strict';

module.exports = (sequelize, DataTypes) => {
  const Subdistrict = sequelize.define('Subdistrict', {
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
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    tableName: 'subdistricts',
    underscored: true
  });

  Subdistrict.associate = function(models) {
    Subdistrict.hasMany(models.EmologHistory, {
      foreignKey: 'subdistrict_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };

  return Subdistrict;
};
