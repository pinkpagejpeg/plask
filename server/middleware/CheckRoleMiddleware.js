const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError')

module.exports = function(role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if(!token){
                res.status(401).json({message: 'Пользователь не авторизован'})
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decoded
            if(decoded.role !== role){
                return next(ApiError.forbidden('Пользователь не обладает правами администратора'))
            }

            next()
        } catch {
            res.status(401).json({message: 'Пользователь не авторизован'})
        }
    };
}