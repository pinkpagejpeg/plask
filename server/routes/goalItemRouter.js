const Router = require('express')
const goalController = require('../controllers/goalController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const { check } = require('express-validator')

const router = new Router()
router.use(AuthMiddleware)

// Add subgoal (authorized users)
router.post(
    '/:goalId/items',
    check('info', 'Подцель не введена').notEmpty(),
    goalController.createItem
)

// Update subgoal status (authorized users)
router.patch(
    '/:goalId/items/:goalItemId/status', 
    check('status', 'Отсутствует статус подцели').exists(),
    goalController.changeItemStatus
)

// Update subgoal (authorized users)
router.patch(
    '/:goalId/items/:goalItemId',
    check('info', 'Подцель не введена').notEmpty(),
    goalController.updateItem
)

// Delete subgoal (authorized users)
router.delete(
    '/:goalId/items/:goalItemId', 
    goalController.deleteItem
)

// Get subgoals by goal id (authorized users)
router.get(
    '/:goalId/items', 
    goalController.getAllItems
)

module.exports = router