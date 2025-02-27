const Router = require('express')
const goalItemController = require('../controllers/goalItemController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const { check } = require('express-validator')

const router = new Router()
router.use(AuthMiddleware)

// Add subgoal (authorized users)
router.post(
    '/:goalId/items',
    check('info', 'Подцель не введена').notEmpty(),
    goalItemController.createItem
)

// Update subgoal status (authorized users)
router.patch(
    '/:goalId/items/:goalItemId/status', 
    check('status', 'Отсутствует статус подцели').exists(),
    goalItemController.changeItemStatus
)

// Update subgoal (authorized users)
router.patch(
    '/:goalId/items/:goalItemId',
    check('info', 'Подцель не введена').notEmpty(),
    goalItemController.updateItem
)

// Delete subgoal (authorized users)
router.delete(
    '/:goalId/items/:goalItemId', 
    goalItemController.deleteItem
)

// Get subgoals by goal id (authorized users)
router.get(
    '/:goalId/items', 
    goalItemController.getAllItems
)

module.exports = router