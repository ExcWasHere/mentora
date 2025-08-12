'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChatbotHistory = sequelize.define(
    'ChatbotHistory',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      session_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'chatbot_sessions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sender: {
        type: DataTypes.ENUM('user', 'bot'), 
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      tableName: 'chatbot_histories', 
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  ChatbotHistory.associate = function (models) {
    ChatbotHistory.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    ChatbotHistory.belongsTo(models.ChatbotSession, {
      foreignKey: 'session_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return ChatbotHistory;
};
