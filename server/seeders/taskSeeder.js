'use strict'

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query('SELECT id FROM users')

    await queryInterface.bulkInsert('tasks', [
      {
        info: 'Set up the project structure',
        status: true,
        userId: users[0].id,
        completedAt: new Date().toISOString().split('T')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        info: 'Write the first chapter of documentation',
        status: false,
        userId: users[0].id,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tasks', null, {})
  }
}