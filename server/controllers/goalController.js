const { Goal } = require('../models/models')
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
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { goalId, info } = req.body
            const goal = await Goal.findByPk(goalId)

            if (!goal) {
                return next(ApiError.badRequest('Задача не найдена'))
            }

            await goal.update({ info })
            return res.json({ goal })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changeStatus(req, res, next) {
        // try {
        //     const { taskId, status } = req.body
        //     const task = await Task.findByPk(taskId)

        //     if (!task) {
        //         return next(ApiError.badRequest('Задача не найдена'))
        //     }

        //     await task.update({ status })
        //     return res.json({ task })
        // } catch (e) {
        //     next(ApiError.badRequest(e.message))
        // }
    }

    async delete(req, res, next) {
        try {
            const { goalId } = req.params
            const goal = await Goal.findByPk(goalId)

            if (!goal) {
                return next(ApiError.badRequest('Цель не найдена'))
            }

            await goal.destroy()
            return res.json({ deletedGoalId: goal.id });
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const { userId } = req.params
            const goals = await Goal.findAll({ where: { userId }, order: [['createdAt', 'DESC']] })
            return res.json(goals)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new GoalController()