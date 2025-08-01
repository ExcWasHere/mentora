'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('emotions', {
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      interaction_with: {
        type: Sequelize.ENUM('Teman', 'Keluarga', 'Rekan Kerja', 'Pasangan', 'Lainnya'),
        allowNull: false,
      },
      activity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mood: {
        type: Sequelize.ENUM('Positif', 'Netral', 'Negatif'),
        allowNull: false,
      },
      emotion: {
        type: Sequelize.ENUM('Sangat Baik', 'Baik', 'Biasa', 'Sedih', 'Cemas', 'Marah'),
        allowNull: false,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // nama tabel target (bukan nama model)
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('emotions');
  },
};
