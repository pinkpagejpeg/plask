const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError')

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            throw ApiError.unauthorized('Пользователь не авторизован')
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded

        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(ApiError.unauthorized('Неверный или просроченный токен'))
        }

        next(error)
    }
}