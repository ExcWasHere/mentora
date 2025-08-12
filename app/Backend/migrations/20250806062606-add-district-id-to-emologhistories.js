'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('emolog_histories', 'district_id', {
      type: Sequelize.INTEGER,
      allowNull: true, 
      references: {
        model: 'districts',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('emolog_histories', 'district_id');
  }
};
