const { Goal, Goal_item, User } = require('../models/models')
const ApiError = require('../error/ApiError')
const formatErrorMessages = require('../error/formatErrorMessages')
const { validationResult } = require('express-validator')

class GoalController {
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

            const goal = await Goal.create({ userId: id, info })
            return res.status(201).json({ goal })
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

            const { goalId } = req.params
            const { info } = req.body

            const goal = await Goal.findByPk(goalId)
            if (!goal) {
                return next(ApiError.notFound('Цель не найдена'))
            }

            await goal.update({ info })
            return res.json({ goal })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { goalId } = req.params
            const goal = await Goal.findByPk(goalId)

            if (!goal) {
                return next(ApiError.notFound('Цель не найдена'))
            }

            const goalItems = await Goal_item.findAll({ where: { goalId } })

            for (const goalItem of goalItems) {
                await goalItem.destroy()
            }

            await goal.destroy()

            return res.json({ deletedGoalId: goal.id })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const { id } = req.user
            const user = await User.findByPk(id)

            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }

            const goals = await Goal.findAll({ where: { userId: id }, order: [['createdAt', 'DESC']] })
            return res.json({ goals, count: goals.length })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const { goalId } = req.params
            const goal = await Goal.findByPk(goalId)

            if (!goal) {
                return next(ApiError.notFound('Цель не найдена'))
            }

            return res.json({ goal })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async getProgress(req, res, next) {
        try {
            const { goalId } = req.params
            const goal = await Goal.findByPk(goalId)

            if (!goal) {
                return next(ApiError.notFound('Цель не найдена'))
            }

            const goalItems = await Goal_item.findAll({ where: { goalId } })

            if (!goalItems || goalItems.length === 0) {
                return res.json({ progress: 0 })
            }

            const completedItems = goalItems.filter(item => item.status === true).length
            const totalItems = goalItems.length
            const progress = Math.round((completedItems / totalItems) * 100)

            return res.json({ progress })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }
}

module.exports = new GoalController()