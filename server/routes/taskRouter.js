const Router = require('express')
const taskController = require('../controllers/taskController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const { check } = require('express-validator')

const router = new Router()
router.use(AuthMiddleware)

// Add task (authorized users)
router.post(
    '/',
    check('info', 'задача не введена').notEmpty(),
    taskController.create
)

// Update task status (authorized users)
router.patch(
    '/:taskId/status',
    check('status', 'отсутствует статус задачи').exists(),
    taskController.changeStatus
)

// Update task (authorized users)
router.patch(
    '/:taskId',
    check('info', 'задача не введена').notEmpty(),
    taskController.update
)

// Delete task (authorized users)
router.delete(
    '/:taskId',
    taskController.delete
)

// Get tasks by searchQuery (authorized users)
router.get(
    '/search',
    taskController.getSearch
)

// Get tasks by user (authorized users)
router.get(
    '/user',
    taskController.getAll
)

module.exports = router