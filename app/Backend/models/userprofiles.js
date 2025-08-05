'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define(
    'UserProfile',
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      district_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'districts',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      subdistrict_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'subdistricts',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      gender: {
        type: DataTypes.ENUM('L', 'P'),
        allowNull: false,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      no_wa: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isNumeric: true,
          len: [10, 20],
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'user_profiles',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  UserProfile.associate = function (models) {
    UserProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    UserProfile.belongsTo(models.District, {
      foreignKey: 'district_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    UserProfile.belongsTo(models.Subdistrict, {
      foreignKey: 'subdistrict_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return UserProfile;
};
