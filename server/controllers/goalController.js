const { Goal, Goal_item } = require('../models/models')
const ApiError = require('../error/ApiError')
const { validationResult } = require('express-validator')

class GoalController {
    // Goal
    async create(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array().map(error => error.msg) });
            }

            const { userId, info } = req.body

            const goal = await Goal.create({ userId, info })
            return res.status(201).json({ goal })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array().map(error => error.msg) });
            }

            const { goalId } = req.params
            const { info } = req.body

            const goal = await Goal.findByPk(goalId)

            if (!goal) {
                return next(ApiError.notFound('Цель не найдена'))
            }

            await goal.update({ info })
            return res.json({ goal })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
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
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const { userId } = req.params
            const goals = await Goal.findAll({ where: { userId }, order: [['createdAt', 'DESC']] })
            return res.json({ goals, count: goals.length })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
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
        } catch (e) {
            return next(ApiError.badRequest(e.message))
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
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    // Goal Item
    async createItem(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array().map(error => error.msg) });
            }

            const { goalId } = req.params
            const { info } = req.body

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
                return res.status(400).json({ message: errors.array().map(error => error.msg) });
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
                return res.status(400).json({ message: errors.array().map(error => error.msg) });
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