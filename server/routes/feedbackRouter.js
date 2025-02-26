const Router = require('express')
const feedbackController = require('../controllers/feedbackController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const { check } = require('express-validator')

const router = new Router()

// Send feedback (authorized users)
router.post(
    '/',
    [
        check('info', 'Сообщение не введено').notEmpty(),
        check('userId', 'Отсутствует идентификатор пользователя').exists()
    ],
    AuthMiddleware,
    feedbackController.create
)

module.exports = router