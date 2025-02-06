'use strict'

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    // const goals = await queryInterface.sequelize.query('SELECT id FROM goals')

    await queryInterface.bulkInsert('goal_items', [
      {
        info: 'Complete the project setup',
        status: true,
        goalId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        info: 'Write the initial draft of documentation',
        status: false,
        goalId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('goal_items', null, {})
  }
}
