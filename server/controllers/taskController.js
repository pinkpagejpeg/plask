const {Task} = require('../models/models')
const ApiError = require('../error/ApiError')

class TaskController {
    async create(req, res) {
        const {info} = req.body
        const task = await Task.create({info})
        return res.json(task)
    }

    async update(req, res) {

    }

    async delete(req, res) {

    }

    async getAll(req, res) {
        // const tasks = await Task.findAll()
        // return res.json(tasks)
    }
}

module.exports = new TaskController()