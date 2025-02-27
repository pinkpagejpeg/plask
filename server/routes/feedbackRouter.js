const Router = require('express')
const feedbackController = require('../controllers/feedbackController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const { check } = require('express-validator')

const router = new Router()

// Send feedback (authorized users)
router.post(
    '/',
    check('info', 'Сообщение не введено').notEmpty(),
    AuthMiddleware,
    feedbackController.create
)

module.exports = router