module.exports = (sequelize, DataTypes) => {
  const StreakSelfHarm = sequelize.define(
    'StreakSelfHarm',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      streak_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'streak_self_harm',
    }
  );

  StreakSelfHarm.associate = function (models) {
    StreakSelfHarm.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  return StreakSelfHarm;
};
