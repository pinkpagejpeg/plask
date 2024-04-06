const Router = require('express')
const router = new Router()
const goalController = require('../controllers/goalController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const { check } = require('express-validator')

// Goal Item

router.post('/item', check('info', 'Задача не введена').notEmpty(),
    AuthMiddleware, goalController.createItem)
router.put('/item', AuthMiddleware, goalController.updateItem)
router.put('/item/status', AuthMiddleware, goalController.changeItemStatus)
router.delete('/item/:goalItemId', AuthMiddleware, goalController.deleteItem) 
router.get('/item/:goalId', AuthMiddleware, goalController.getAllItem)  

// Goal

router.get('/progress/:goalId', AuthMiddleware, goalController.getProgress)
router.post('/', check('info', 'Цель не введена').notEmpty(),
    AuthMiddleware, goalController.create)
router.put('/', AuthMiddleware, goalController.update)
router.delete('/:goalId', AuthMiddleware, goalController.delete)
router.get('/user/:userId', AuthMiddleware, goalController.getAll)
router.get('/:goalId', AuthMiddleware, goalController.getOne) 

module.exports = router