const Router = require('express')
const goalController = require('../controllers/goalController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const { check } = require('express-validator')

const router = new Router()
router.use(AuthMiddleware)

// Get goal progress (authorized users)
router.get(
    '/:goalId/progress',
    goalController.getProgress
)

// Add goal (authorized users)
router.post(
    '/',
    check('info', 'цель не введена').notEmpty(),
    goalController.create
)

// Update goal (authorized users)
router.patch(
    '/:goalId',
    check('info', 'цель не введена').notEmpty(),
    goalController.update
)

// Delete goal (authorized users)
router.delete(
    '/:goalId',
    goalController.delete
)

// Get goals by user (authorized users)
router.get(
    '/user',
    goalController.getAll
)

// Get goal info (authorized users)
router.get(
    '/:goalId',
    goalController.getOne
)

module.exports = router