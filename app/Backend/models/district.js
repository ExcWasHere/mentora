'use strict';

module.exports = (sequelize, DataTypes) => {
  const District = sequelize.define('District', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    tableName: 'districts',
    underscored: true
  });

  District.associate = function(models) {
    District.hasMany(models.Subdistrict, { foreignKey: 'district_id' });
  };

  return District;
};
