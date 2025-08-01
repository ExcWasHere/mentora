module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define(
    'user_profiles',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      district: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('L', 'P'),
        allowNull: true,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      tableName: 'user_profiles',
      timestamps: true,
    }
  );

  UserProfile.associate = function (models) {
    UserProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
  };

  return UserProfile;
};
