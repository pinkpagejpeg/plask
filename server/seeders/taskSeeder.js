'use strict'

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query('SELECT id FROM users')

    await queryInterface.bulkInsert('tasks', [
      {
        info: 'Set up the project structure',
        status: true,
        user_id: users[0].id,
        completed_at: new Date().toISOString().split('T')[0],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        info: 'Write the first chapter of documentation',
        status: false,
        user_id: users[0].id,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tasks', null, {})
  }
}