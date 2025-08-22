module.exports = (sequelize, DataTypes) => {
  const Emotion = sequelize.define('Emotion', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    interaction_with: {
      type: DataTypes.ENUM('Teman', 'Keluarga', 'Rekan Kerja', 'Pasangan', 'Lainnya'),
      allowNull: false
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mood: {
      type: DataTypes.ENUM('Positif', 'Netral', 'Negatif'),
      allowNull: false
    },
    emotion: {
      type: DataTypes.ENUM('Sangat Baik', 'Baik', 'Biasa', 'Sedih', 'Cemas', 'Marah'),
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'emotions',
    underscored: true,
    timestamps: true
  });

  Emotion.associate = function(models) {
    Emotion.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Emotion;
};