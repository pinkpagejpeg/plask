const Router = require('express')
const router = new Router()
const taskController = require('../controllers/taskController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const { check } = require('express-validator')

router.post('/', check('info', 'Задача не введена').notEmpty(),
    AuthMiddleware, taskController.create)
router.put('/', AuthMiddleware, taskController.update)
router.put('/status', AuthMiddleware, taskController.changeStatus)
router.delete('/:taskId', AuthMiddleware, taskController.delete)
router.get('/:userId', AuthMiddleware, taskController.getAll)

module.exports = router