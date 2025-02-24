const Router = require('express')
const feedbackController = require('../controllers/feedbackController')
const router = new Router()
const AuthMiddleware = require('../middleware/AuthMiddleware')
const checkRoleMiddleware = require('../middleware/CheckRoleMiddleware')
const { check } = require('express-validator')

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

// Update feedback status
router.patch(
    '/:feedbackId',
    check('status', 'Отсутствует статус обратной связи').exists(),
    checkRoleMiddleware('ADMIN'),
    feedbackController.changeStatus
)

// Get all the feedback (admins only)    
router.get(
    '/',
    checkRoleMiddleware('ADMIN'),
    feedbackController.getAll
)

// Delete feedback
// router.delete('/:feedbackId')

module.exports = router