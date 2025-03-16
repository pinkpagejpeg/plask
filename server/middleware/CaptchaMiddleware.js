const ApiError = require('../error/ApiError')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next()
    }

    try {
        const hcaptchaToken = req.body.hcaptchaToken

        if (!hcaptchaToken) {
            throw ApiError.badRequest('Капча не пройдена')
        }

        next()
    } catch (error) {
        next(error)
    }
}