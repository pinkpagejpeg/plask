const ApiError = require('../error/ApiError')
const { User, Feedback, Task, Goal, Goal_item } = require('../models/models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

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
                const errorMessages = errors.array().map(error => error.msg);
                return next(ApiError.badRequest({ message: `Введены некорректные данные: ${errorMessages}` }));
            }

            const { email, password, role } = req.body

            const candidate = await User.findOne({ where: { email } })
            if (candidate) {
                return next(ApiError.internal({ message: "Пользователь с таким именем уже существует" }))
            }

            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({ email, role, password: hashPassword })
            const token = generateJwt(user.id, user.email, user.role)
            return res.json({ token })
        }
        catch (e) {
            return next(ApiError.badRequest(e.message))
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
                return next(ApiError.internal({ message: 'Пользователь не найден' }))
            }

            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.internal({ message: 'Введен неверный пароль' }))
            }

            const token = generateJwt(user.id, user.email, user.role)
            return res.json({ token })
        }
        catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({ token })
    }

    async updateUserInfo(req, res, next) {
        try {
            const { userId, email, password } = req.body
            const user = await User.findByPk(userId)

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'))
            }

            if (password) {
                if (password.length < 6 || password.length > 12) {
                    return next(ApiError.badRequest('Длина пароля должна составлять от 6 до 12 символов'));
                }

                const hashPassword = await bcrypt.hash(password, 5)
                await user.update({ password: hashPassword })
            } else {
                if (!email) {
                    return next(ApiError.badRequest('Email пользователя не заполнен'))
                }

                const candidate = await User.findOne({ where: { email } })
                if (candidate) {
                    return next(ApiError.internal("Пользователь с таким именем уже существует"))
                }
                await user.update({ email })
            }

            const token = generateJwt(user.id, user.email, user.role)
            return res.json({ token })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async updateUserImage(req, res, next) {
        try {
            const { userId } = req.params
            const user = await User.findByPk(userId)

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'))
            }

            const file = req.files.file

            const imageName = uuidv4() + '.jpg'
            file.mv(path.resolve(__dirname, '..', 'static') + '\\' + imageName);

            await user.update({ img: imageName })
            return res.json({ user })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async deleteUserImage(req, res, next) {
        try {
            const { userId } = req.body

            const user = await User.findByPk(userId)

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'))
            }

            await user.update({ img: 'user_default_image.jpg' })
            return res.json({ user })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const { userId } = req.params
            const user = await User.findByPk(userId)
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'))
            }
            return res.json(user)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    // Панель администратора

    async create(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(error => error.msg);
                return next(ApiError.badRequest({ message: `Введены некорректные данные: ${errorMessages}` }));
            }

            const { email, password, role } = req.body

            const candidate = await User.findOne({ where: { email } })
            if (candidate) {
                return next(ApiError.internal({ message: "Пользователь с таким именем уже существует" }))
            }

            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({ email, role, password: hashPassword })
            const token = generateJwt(user.id, user.email, user.role)
            return res.json({ token })
        }
        catch (e) {
            return next(ApiError.badRequest(e.message))
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
                if (password.length < 6 || password.length > 12) {
                    return next(ApiError.badRequest('Длина пароля должна составлять от 6 до 12 символов'));
                }

                const hashPassword = await bcrypt.hash(password, 5)
                await user.update({ password: hashPassword })
            } else {
                if (!email) {
                    return next(ApiError.badRequest('Email пользователя не заполнен'))
                }

                if (role === user.role) {
                    const candidate = await User.findOne({ where: { email } })
                    if (candidate) {
                        return next(ApiError.internal("Пользователь с таким именем уже существует"))
                    }
                    await user.update({ email })
                } else {
                    await user.update({ role })
                }
            }

            return res.json({ user })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { userId } = req.params
            const user = await User.findByPk(userId)

            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'))
            }

            const feedbacks = await Feedback.findAll({ where: { userId } })
            const tasks = await Task.findAll({ where: { userId } })
            const goals = await Goal.findAll({ where: { userId } })

            await user.destroy()

            for (const feedback of feedbacks) {
                await feedback.destroy();
            }
    
            for (const task of tasks) {
                await task.destroy();
            }
    
            for (const goal of goals) {
                const goalItems = await Goal_item.findAll({ where: { goalId: goal.id } });
                for (const goalItem of goalItems) {
                    await goalItem.destroy();
                }
                await goal.destroy();
            }
            
            return res.json({ deletedUserId: user.id });
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await User.findAll({
                order: [['createdAt', 'DESC']]
            });
            return res.json(users)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new UserController()