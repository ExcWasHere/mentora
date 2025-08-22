module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      comment: {
        allowNull: false,
        type: DataTypes.TEXT,
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
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'posts', // nama tabel target (bukan nama model)
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      tableName: 'comments',
      underscored: true,
      timestamps: true,
    }
  );

  Comment.associate = function (models) {
    Comment.belongsTo(models.Post, { foreignKey: 'post_id' });
    Comment.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Comment;
};
