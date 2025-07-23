module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true
  });

  User.associate = function(models) {
    User.hasMany(models.Emotion, { foreignKey: 'user_id' });
  };

  return User;
};