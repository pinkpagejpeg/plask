const { Goal_item, Goal } = require('../models/models')
const ApiError = require('../error/ApiError')
const formatErrorMessages = require('../error/formatErrorMessages')
const { validationResult } = require('express-validator')

class GoalController {
    async createItem(req, res, next) {
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

            const goalItem = await Goal_item.create({ goalId, info })
            return res.status(201).json({ goalItem })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async updateItem(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(
                    `Введены некорректные данные: ${formatErrorMessages(errors.array().map(error => error.msg))}`
                ))
            }

            const { goalItemId } = req.params
            const { info } = req.body

            const goalItem = await Goal_item.findByPk(goalItemId)
            if (!goalItem) {
                return next(ApiError.notFound('Подцель не найдена'))
            }

            await goalItem.update({ info })
            return res.json({ goalItem })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async changeItemStatus(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(
                    `Введены некорректные данные: ${formatErrorMessages(errors.array().map(error => error.msg))}`
                ))
            }

            const { goalItemId } = req.params
            const { status } = req.body

            const goalItem = await Goal_item.findByPk(goalItemId)
            if (!goalItem) {
                return next(ApiError.notFound('Подцель не найдена'))
            }

            await goalItem.update({ status })
            return res.json({ goalItem })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAllItems(req, res, next) {
        try {
            const { goalId } = req.params
            const goal = await Goal.findByPk(goalId)

            if (!goal) {
                return next(ApiError.notFound('Цель не найдена'))
            }

            const goalItems = await Goal_item.findAll({ where: { goalId }, order: [['createdAt', 'DESC']] })
            return res.json({ goalItems, count: goalItems.length })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async deleteItem(req, res, next) {
        try {
            const { goalItemId } = req.params
            const goalItem = await Goal_item.findByPk(goalItemId)

            if (!goalItem) {
                return next(ApiError.notFound('Подцель не найдена'))
            }

            await goalItem.destroy()
            return res.json({ deletedGoalItemId: goalItem.id });
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new GoalController()