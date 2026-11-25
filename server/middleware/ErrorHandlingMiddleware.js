const ApiError = require('../error/ApiError')

module.exports = function (err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }

    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message })
    }

    console.error('Unhandled error:', err && err.stack ? err.stack : err)

    return res.status(500).json({ message: 'Непредвиденная ошибка' })
}