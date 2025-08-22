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
      pengalaman_dalam_tahun: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      no_wa: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isNumeric: true,
          len: [10, 20],
        },
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
