module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'psikolog', 'pemerintah'),
        allowNull: false,
      },
      nip: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      str_proof: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      underscored: true,
      timestamps: true,
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Emotion, { foreignKey: 'user_id' });
  };
  User.associate = function (models) {
    User.hasMany(models.Post, { foreignKey: 'user_id' });
  };
  User.associate = function (models) {
    User.hasOne(models.UserProfile, { foreignKey: 'user_id' });
  };

  return User;
};
