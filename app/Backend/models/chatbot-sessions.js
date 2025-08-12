'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChatbotSession = sequelize.define(
    'ChatbotSession',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_message_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: 'chatbot_sessions',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { fields: ['user_id', 'updated_at'] }, 
      ],
      defaultScope: {
        order: [['updated_at', 'DESC']],
      },
      scopes: {
        byUser(userId) {
          return { where: { user_id: userId } };
        },
        active: { where: { is_active: true } },
      },
    }
  );

  ChatbotSession.associate = (models) => {
    ChatbotSession.belongsTo(models.User, { foreignKey: 'user_id' });
    ChatbotSession.hasMany(models.ChatbotHistory, {
      foreignKey: 'session_id',
      sourceKey: 'id',
      as: 'messages',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return ChatbotSession;
};
