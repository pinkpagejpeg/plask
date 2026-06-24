const { Op, Sequelize } = require('sequelize')
const { sequelize, Task, User } = require('../models/models')
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
            const completedAt = new Date()

            const task = await Task.findByPk(taskId)
            if (!task) {
                return next(ApiError.notFound('Задача не найдена'))
            }

            const updateData = { status }

            if (status === true) {
                const today = new Date()
                updateData.completedAt = today.toISOString().split('T')[0]
            } else {
                updateData.completedAt = null
            }

            await task.update(updateData)
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
            const { search, filter, sort, order } = req.query || {}

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

            if (filter) {
                whereParams.status = filter === 'completed'
            }

            const tasks = await Task.findAll({
                where: whereParams,
                order: [(sort && order) ? [sort, order] : ['createdAt', 'DESC']]
            })

            return res.json({ tasks, count: tasks.length })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async getWeekStatistics(req, res, next) {
        try {
            const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
            const { id } = req.user
            const { from, to } = req.query

            if (!from || !to) {
                return next(ApiError.badRequest('Не указаны from и to'))
            }

            const user = await User.findByPk(id)

            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }

            const weeklyData = await sequelize.query(`
            SELECT 
                dates.day::date as date,
                COALESCE(COUNT(t.id), 0) as count
            FROM generate_series(:fromDate::date, :toDate::date, '1 day') AS dates(day)
            LEFT JOIN tasks t ON 
                t.completed_at = dates.day
                AND t.status = true 
                AND t.user_id = :userId
            GROUP BY dates.day 
            ORDER BY dates.day ASC
            `, {
                replacements: {
                    fromDate: from,
                    toDate: to,
                    userId: id
                },
                type: sequelize.QueryTypes.SELECT
            })

            const formattedData = weeklyData.map((item, index) => ({
                date: item.date,
                day: weekDays[index % 7],
                count: Number(item.count)
            }))

            const tasksDone = formattedData.reduce((acc, el) => acc + el.count, 0)
            const maxCount = Math.max(...formattedData.map(el => el.count))
            const daysBest = maxCount !== 0 ? formattedData.filter(el => el.count === maxCount).length : 0
            const daysActive = formattedData.filter(el => el.count > 0).length

            return res.json({
                weeklyData: formattedData,
                tasksDone,
                daysBest,
                daysActive
            })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }
}

module.exports = new TaskController()