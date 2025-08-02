'use strict';
module.exports = (sequelize, DataTypes) => {
  const PsikologSchedule = sequelize.define(
    'PsikologSchedule',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      psikolog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // nama tabel target (bukan nama model)
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      kuota: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('tersedia', 'penuh', 'tutup'),
        allowNull: false,
        defaultValue: 'tersedia',
      },
    },
    {
      tableName: 'psikolog_schedules',
      underscored: true,
      timestamps: true,
    }
  );

  PsikologSchedule.associate = function (models) {
    PsikologSchedule.belongsTo(models.User, {
      foreignKey: 'psikolog_id',
      onDelete: 'CASCADE',
    });
  };

  return PsikologSchedule;
};
