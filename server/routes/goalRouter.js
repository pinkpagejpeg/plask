const Router = require('express')
const router = new Router()
const goalController = require('../controllers/goalController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const { check } = require('express-validator')

router.post('/', check('info', 'Цель не введена').notEmpty(),
    AuthMiddleware, goalController.create)
router.put('/', AuthMiddleware, goalController.update)
// router.put('/status', AuthMiddleware, goalController.changeStatus)
router.delete('/:goalId', AuthMiddleware, goalController.delete)
router.get('/:userId', AuthMiddleware, goalController.getAll)

module.exports = router