const { Task } = require('../models/models')
const ApiError = require('../error/ApiError')

class TaskController {
    async create(req, res) {
        try {
            const { userId, info } = req.body
            console.log(userId, info)
            const task = await Task.create({ userId, info })
            return res.json(task)
        } catch (error) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res) {

    }

    async delete(req, res, next) {
        try{
            const { taskId } = req.params
            const task = await Task.findByPk(taskId)

            if (!task) {
                return next(ApiError.badRequest('Задача не найдена'))
            }

            await task.destroy()

            return res.json({ deletedTaskId: task.id });
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const { userId } = req.params
            const tasks = await Task.findAll({ where: { userId } })
            return res.json(tasks)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new TaskController()