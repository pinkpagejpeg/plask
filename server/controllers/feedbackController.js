const { Feedback, User } = require('../models/models')
const ApiError = require('../error/ApiError')
const { validationResult } = require('express-validator')

class FeedbackController {
    async create(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array().map(error => error.msg) });
            }

            const { userId, info } = req.body

            const feedback = await Feedback.create({ userId, info })
            return res.status(201).json({ feedback })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async changeStatus(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array().map(error => error.msg) });
            }
            
            const { feedbackId } = req.params
            const { status } = req.body

            const feedback = await Feedback.findByPk(feedbackId)

            if (!feedback) {
                return next(ApiError.notFound('Обращение не найдено'))
            }

            await feedback.update({ status })
            return res.json({ feedback })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const feedbacks = await Feedback.findAll({
                include: [{ model: User, attributes: ['email'] }],
                order: [['createdAt', 'DESC']]
            })
            return res.json({ feedbacks, count: feedbacks.length })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new FeedbackController()