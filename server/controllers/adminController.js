const { Feedback, Task, Goal, Goal_item, User } = require('../models/models')
const bcrypt = require('bcryptjs')
const ApiError = require('../error/ApiError')
const formatErrorMessages = require('../error/formatErrorMessages')
const { validationResult } = require('express-validator')

class AdminController {
    // Users
    async create(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(
                    `Введены некорректные данные: ${formatErrorMessages(errors.array().map(error => error.msg))}`
                ))
            }

            const { email, password, role } = req.body

            const candidate = await User.findOne({ where: { email } })
            if (candidate) {
                return next(ApiError.badRequest("Пользователь с таким именем уже существует"))
            }

            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({ email, role, password: hashPassword })
            return res.status(201).json({ user })
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

            const { userId } = req.params
            const { email, password, role } = req.body

            const user = await User.findByPk(userId)

            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }

            if (password) {
                if (password.length < 6 || password.length > 12) {
                    return next(ApiError.badRequest('Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов'))
                }

                const hashPassword = await bcrypt.hash(password, 5)
                await user.update({ password: hashPassword })
            } else {
                if (role === user.role) {
                    const candidate = await User.findOne({ where: { email } })
                    if (candidate) {
                        return next(ApiError.badRequest("Пользователь с таким именем уже существует"))
                    }
                    await user.update({ email })
                } else {
                    await user.update({ role })
                }
            }

            return res.json({ user })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { userId } = req.params
            const user = await User.findByPk(userId)

            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'))
            }

            const feedbacks = await Feedback.findAll({ where: { userId } })
            const tasks = await Task.findAll({ where: { userId } })
            const goals = await Goal.findAll({ where: { userId } })

            for (const feedback of feedbacks) {
                await feedback.destroy()
            }

            for (const task of tasks) {
                await task.destroy()
            }

            for (const goal of goals) {
                const goalItems = await Goal_item.findAll({ where: { goalId: goal.id } })
                for (const goalItem of goalItems) {
                    await goalItem.destroy()
                }
                await goal.destroy()
            }

            await user.destroy()
            return res.json({ deletedUserId: user.id })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await User.findAll({
                order: [['createdAt', 'DESC']]
            })
            return res.json({ users, count: users.length })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    // Feedbacks
    async changeStatus(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(
                    `Введены некорректные данные: ${formatErrorMessages(errors.array().map(error => error.msg))}`
                ))
            }

            const { feedbackId } = req.params
            const { status } = req.body

            const feedback = await Feedback.findByPk(feedbackId)

            if (!feedback) {
                return next(ApiError.notFound('Обращение не найдено'))
            }

            await feedback.update({ status })
            return res.json({ feedback })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }

    async getAllFeedbacks(req, res, next) {
        try {
            const feedbacks = await Feedback.findAll({
                include: [{ model: User, attributes: ['email'] }],
                order: [['createdAt', 'DESC']]
            })
            return res.json({ feedbacks, count: feedbacks.length })
        } catch (error) {
            return next(ApiError.internal(error.message))
        }
    }
}

module.exports = new AdminController()