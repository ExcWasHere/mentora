'use strict';
module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define(
    'Appointment',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // nama tabel target (bukan nama model)
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'psikolog_schedules', // nama tabel target (bukan nama model)
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nomor_antrian: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Pending', 'Selesai'),
        allowNull: false,
        defaultValue: 'Pending',
      },
    },
    {
      tableName: 'appointments',
      underscored: true, // Agar created_at & updated_at terbaca
      timestamps: true, // Otomatis handle created_at & updated_at
    }
  );

  Appointment.associate = function (models) {
    // Relasi ke User
    Appointment.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    // Relasi ke PsikologSchedule
    Appointment.belongsTo(models.PsikologSchedule, {
      foreignKey: 'schedule_id',
      onDelete: 'CASCADE',
    });
  };

  return Appointment;
};
