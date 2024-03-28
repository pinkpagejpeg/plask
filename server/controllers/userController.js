const ApiError = require('../error/ApiError')
const { User } = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest({ message: "Ошибка при регистрации" }))
            }

            const { email, password, role } = req.body

            const candidate = await User.findOne({ where: { email } })
            if (candidate) {
                return next(ApiError.internal('Пользователь с таким именем уже существует'))
            }

            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({ email, role, password: hashPassword })
            const token = generateJwt(user.id, user.email, user.role)
            return res.json({ token })
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest({ message: "Ошибка при авторизации", errors }))
            }

            const { email, password } = req.body
            const user = await User.findOne({ where: { email } })
            if (!user) {
                return next(ApiError.internal('Пользователь не найден'))
            }

            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.internal('Введен неверный пароль'))
            }

            const token = generateJwt(user.id, user.email, user.role)
            return res.json({ token })
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({ token })
    }

    // Панель администратора

    async create(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array().map(error => error.msg) });
            }

            const { email, password, role } = req.body

            const candidate = await User.findOne({ where: { email } })
            if (candidate) {
                return next(ApiError.internal('Пользователь с таким именем уже существует'))
            }

            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({ email, role, password: hashPassword })
            const token = generateJwt(user.id, user.email, user.role)
            return res.json({ token })
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { userId, email, password, role } = req.body
            const user = await User.findByPk(userId)

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'))
            }

            if (password) {
                const hashPassword = await bcrypt.hash(password, 5)
                await user.update({ email, role, password: hashPassword })
            } else {
                await user.update({ email, role })
            }

            return res.json({ user })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { userId } = req.params
            const user = await User.findByPk(userId)

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'))
            }

            await user.destroy()
            return res.json({ deletedUserId: user.id });
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        try {
            const users = await User.findAll({
                order: [['createdAt', 'DESC']]
            });
            return res.json(users)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new UserController()