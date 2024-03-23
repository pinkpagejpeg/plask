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

    async delete(req, res) {

    }

    async getAll(req, res, next) {
        const { userId } = req.params

        try {
            const tasks = await Task.findAll({ where: { userId } });
            return res.json(tasks);
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new TaskController()