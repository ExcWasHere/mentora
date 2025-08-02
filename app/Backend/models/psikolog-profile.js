module.exports = (sequelize, DataTypes) => {
  const psikologProfile = sequelize.define(
    'psikologProfile',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nama_tempat_praktek: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alamat_tempat_praktek: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    {
      tableName: 'psikolog_profiles',
      underscored: true,
      timestamps: true,
    }
  );

  psikologProfile.associate = function (models) {
    psikologProfile.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return psikologProfile;
};
