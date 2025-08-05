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
    await queryInterface.addColumn('psikolog_profiles', 'no_wa', {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [10, 20],
      },
    });
    await queryInterface.addColumn('user_profiles', 'no_wa', {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [10, 20],
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
    await queryInterface.removeColumn('psikolog_profiles', 'no_wa');
    await queryInterface.removeColumn('user_profiles', 'no_wa');
  },
};
