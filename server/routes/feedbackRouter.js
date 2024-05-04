const Router = require('express')
const feedbackController = require('../controllers/feedbackController')
const router = new Router()
const AuthMiddleware = require('../middleware/AuthMiddleware')
const checkRoleMiddleware = require('../middleware/CheckRoleMiddleware')
const { check } = require('express-validator')

router.post('/', check('info', 'Сообщение не введено').notEmpty(),
    AuthMiddleware, feedbackController.create)
router.get('/', checkRoleMiddleware('ADMIN'), feedbackController.getAll)
router.put('/', checkRoleMiddleware('ADMIN'), feedbackController.changeStatus)
// router.delete('/:id')

module.exports = router