module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      content: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      images: {
        allowNull: true,
        type: DataTypes.JSON,
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
    },
    {
      tableName: 'posts',
      underscored: true,
      timestamps: true,
    }
  );

  Post.associate = function (models) {
    Post.belongsTo(models.User, { foreignKey: 'user_id' });
  };
  Post.associate = function (models) {
    Post.hasMany(models.Comment, { foreignKey: 'post_id' });
  };

  return Post;
};
