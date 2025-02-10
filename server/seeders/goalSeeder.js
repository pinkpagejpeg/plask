'use strict'

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query('SELECT id FROM users')

    await queryInterface.bulkInsert('goals', [
      {
        info: 'Complete the project',
        userId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        info: 'Write documentation',
        userId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('goals', null, {})
  }
}
