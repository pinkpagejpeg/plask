'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('tasks', 'completed_at', {
            type: Sequelize.DATEONLY,
            allowNull: true
        })

        await queryInterface.renameColumn('tasks', 'userId', 'user_id')
        await queryInterface.renameColumn('tasks', 'createdAt', 'created_at')
        await queryInterface.renameColumn('tasks', 'updatedAt', 'updated_at')
    },

    async down(queryInterface, Sequelize) {
        // Откат
        await queryInterface.removeColumn('tasks', 'completed_at')
        await queryInterface.renameColumn('tasks', 'user_id', 'userId')
        await queryInterface.renameColumn('tasks', 'created_at', 'createdAt')
        await queryInterface.renameColumn('tasks', 'updated_at', 'updatedAt')
    }
}