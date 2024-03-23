const Router = require('express')
const router = new Router()
const taskController = require('../controllers/taskController')

router.post('/', taskController.create)
router.put('/', taskController.update)
router.delete('/:id', taskController.delete)
router.get('/:userId', taskController.getAll)

module.exports = router