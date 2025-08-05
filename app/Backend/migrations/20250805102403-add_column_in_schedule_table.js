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
    await queryInterface.addColumn('psikolog_schedules', 'jenis_konsultasi', {
      type: Sequelize.ENUM('Online', 'Offline'),
      allowNull: false,
    });
    await queryInterface.addColumn('psikolog_schedules', 'harga', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('psikolog_schedules', 'jenis_konsultasi');
    await queryInterface.removeColumn('psikolog_schedules', 'harga');
  },
};
