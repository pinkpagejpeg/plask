const Router = require('express')
const feedbackController = require('../controllers/feedbackController')
const router = new Router()
const AuthMiddleware = require('../middleware/AuthMiddleware')
const { check } = require('express-validator')

router.post('/', check('info', 'Сообщение не введено').notEmpty(),
    AuthMiddleware, feedbackController.create)
router.get('/', AuthMiddleware, feedbackController.getAll)
router.put('/', AuthMiddleware, feedbackController.changeStatus)
// router.delete('/:id')

module.exports = router