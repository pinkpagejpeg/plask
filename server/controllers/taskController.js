const { Task } = require('../models/models')
const ApiError = require('../error/ApiError')
const {validationResult} = require('express-validator')

class TaskController {
    async create(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array().map(error => error.msg) });
            }

            const { userId, info } = req.body
            const task = await Task.create({ userId, info })
            return res.json(task)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { taskId, info } = req.body
            const task = await Task.findByPk(taskId)

            if (!task) {
                return next(ApiError.badRequest('Задача не найдена'))
            }

            await task.update({ info })
            return res.json({ task })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changeStatus(req, res, next) {
        try {
            const { taskId, status } = req.body
            const task = await Task.findByPk(taskId)

            if (!task) {
                return next(ApiError.badRequest('Задача не найдена'))
            }

            await task.update({ status })
            return res.json({ task })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
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
            const tasks = await Task.findAll({ where: { userId }, order: [['createdAt', 'DESC']] })
            return res.json(tasks)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new TaskController()