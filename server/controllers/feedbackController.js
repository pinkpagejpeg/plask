const { Feedback } = require('../models/models')
const ApiError = require('../error/ApiError')
const { validationResult } = require('express-validator')

class FeedbackController {
    async create(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array().map(error => error.msg) });
            }

            const { id } = req.user
            const { info } = req.body

            const feedback = await Feedback.create({ userId: id, info })
            return res.status(201).json({ feedback })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new FeedbackController()