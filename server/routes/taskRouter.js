const Router = require('express')
const taskController = require('../controllers/taskController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const { check } = require('express-validator')

const router = new Router()
router.use(AuthMiddleware)

// Add task (authorized users)
router.post(
    '/',
    [
        check('info', 'Задача не введена').notEmpty(),
        check('userId', 'Отсутствует идентификатор пользователя').exists()
    ],
    taskController.create
)

// Update task status (authorized users)
router.patch(
    '/:taskId/status',
    check('status', 'Отсутствует статус задачи').exists(),
    taskController.changeStatus
)

// Update task (authorized users)
router.patch(
    '/:taskId',
    check('info', 'Задача не введена').notEmpty(),
    taskController.update
)

// Delete task (authorized users)
router.delete(
    '/:taskId',
    taskController.delete
)

// Get tasks by user (authorized users)
router.get(
    '/user/:userId',
    taskController.getAll
)

module.exports = router