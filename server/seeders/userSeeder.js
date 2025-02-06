'use strict'

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        email: 'user@example.com',
        password: 'hashedPassword123',
        role: 'USER',
        img: 'user_default_image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'admin@example.com',
        password: 'hashedAdminPassword123',
        role: 'ADMIN',
        img: 'user_default_image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {})
  }
}
