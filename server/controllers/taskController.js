const { Task, User } = require('../models/models')
const ApiError = require('../error/ApiError')
const formatErrorMessages = require('../error/formatErrorMessages')
const { validationResult } = require('express-validator')

class TaskController {
    async create(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(
                    `Введены некорректные данные: ${formatErrorMessages(errors.array().map(error => error.msg))}`
                ))
            }

            const { id } = req.user
            const { info } = req.body

            const user = await User.findByPk(id)
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }

            const task = await Task.create({ userId: id, info })
            return res.status(201).json({ task })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(
                    `Введены некорректные данные: ${formatErrorMessages(errors.array().map(error => error.msg))}`
                ))
            }

            const { taskId } = req.params
            const { info } = req.body

            const task = await Task.findByPk(taskId)
            if (!task) {
                return next(ApiError.notFound('Задача не найдена'))
            }

            await task.update({ info })
            return res.json({ task })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async changeStatus(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(
                    `Введены некорректные данные: ${formatErrorMessages(errors.array().map(error => error.msg))}`
                ))
            }

            const { taskId } = req.params
            const { status } = req.body

            const task = await Task.findByPk(taskId)
            if (!task) {
                return next(ApiError.notFound('Задача не найдена'))
            }

            await task.update({ status })
            return res.json({ task })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { taskId } = req.params
            const task = await Task.findByPk(taskId)

            if (!task) {
                return next(ApiError.notFound('Задача не найдена'))
            }

            await task.destroy()
            return res.json({ deletedTaskId: task.id })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const { id } = req.user
            const user = await User.findByPk(id)

            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }

            const tasks = await Task.findAll({ where: { userId: id }, order: [['createdAt', 'DESC']] })
            return res.json({ tasks, count: tasks.length })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new TaskController()