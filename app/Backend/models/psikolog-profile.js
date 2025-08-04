module.exports = (sequelize, DataTypes) => {
  const PsikologProfile = sequelize.define(
    'PsikologProfile',
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
          model: 'users', 
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

  PsikologProfile.associate = function (models) {
    PsikologProfile.belongsTo(models.User, { foreignKey: 'psikolog_id' });
  };

  return PsikologProfile;
};
