const { Op } = require('sequelize');
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
        } catch (error) {
            return next(ApiError.internal(error.message))
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
        } catch (error) {
            return next(ApiError.internal(error.message))
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
        } catch (error) {
            return next(ApiError.internal(error.message))
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
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const { id } = req.user
            const { search } = req.query;
            const user = await User.findByPk(id)

            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }

            const whereParams = { userId: id }

            if (search) {
                whereParams.info = {
                    [Op.iLike]: `%${search}%`
                }
            }

            const tasks = await Task.findAll({
                where: whereParams,
                order: [['createdAt', 'DESC']]
            })

            return res.json({ tasks, count: tasks.length })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }
}

module.exports = new TaskController()