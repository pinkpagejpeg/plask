const { Goal, Goal_item } = require('../models/models')
const ApiError = require('../error/ApiError')
const { validationResult } = require('express-validator')

class GoalController {
    async create(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array().map(error => error.msg) });
            }

            const { userId, info } = req.body
            const goal = await Goal.create({ userId, info })
            return res.json(goal)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { goalId, info } = req.body
            const goal = await Goal.findByPk(goalId)

            if (!goal) {
                return res.status(404).json({ message: 'Цель не найдена' });
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
                return res.status(404).json({ message: 'Цель не найдена' });
            }

            const goalItems = await Goal_item.findAll({ where: { goalId } });

            await goal.destroy()

            for (const goalItem of goalItems) {
                await goalItem.destroy();
            }
            
            return res.json({ deletedGoalId: goal.id });
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const { userId } = req.params
            const goals = await Goal.findAll({ where: { userId }, order: [['createdAt', 'DESC']] })
            return res.json(goals)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const { goalId } = req.params
            const goal = await Goal.findByPk(goalId)
            if (!goal) {
                return next(ApiError.badRequest('Цель не найдена'))
            }
            return res.json(goal)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getProgress(req, res, next) {
        try {
            const { goalId } = req.params
            const goal = await Goal.findByPk(goalId)

            if (!goal) {
                return next(ApiError.badRequest('Цель не найдена'))
            }

            const goal_items = await Goal_item.findAll({ where: { goalId } })

            if (!goal_items || goal_items.length === 0) {
                return res.json({ progress: 0 })
            }

            const completed_items = goal_items.filter(item => item.status === true).length
            const total_items = goal_items.length
            const progress = Math.round((completed_items / total_items) * 100)

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

            const { goalId, info } = req.body
            const goal_item = await Goal_item.create({ goalId, info })
            return res.json(goal_item)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async updateItem(req, res, next) {
        try {
            const { goalItemId, info } = req.body
            const goal_item = await Goal_item.findByPk(goalItemId)

            if (!goal_item) {
                return res.status(404).json({ message: 'Задача не найдена' });
            }

            await goal_item.update({ info })
            return res.json({ goal_item })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async changeItemStatus(req, res, next) {
        try {
            const { goalItemId, status } = req.body
            const goal_item = await Goal_item.findByPk(goalItemId)

            if (!goal_item) {
                return res.status(404).json({ message: 'Задача не найдена' });
            }

            await goal_item.update({ status })
            return res.json({ goal_item })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAllItem(req, res, next) {
        try {
            const { goalId } = req.params
            const goal_items = await Goal_item.findAll({ where: { goalId }, order: [['createdAt', 'DESC']] })
            return res.json(goal_items)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async deleteItem(req, res, next) {
        try {
            const { goalItemId } = req.params
            const goal_item = await Goal_item.findByPk(goalItemId)

            if (!goal_item) {
                return res.status(404).json({ message: 'Задача не найдена' });
            }

            await goal_item.destroy()
            return res.json({ deletedGoalItemId: goal_item.id });
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new GoalController()