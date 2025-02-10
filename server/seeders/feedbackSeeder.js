'use strict'

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query('SELECT id FROM users')

    await queryInterface.bulkInsert('feedbacks', [
      {
        info: 'Great project, looking forward to the next version!',
        date: new Date(),
        status: true,
        userId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        info: 'The documentation is a bit lacking, could use more detail.',
        date: new Date(),
        status: false,
        userId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('feedbacks', null, {})
  }
}
