const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const taskRouter = require('./taskRouter')
const goalRouter = require('./goalRouter')
const feedbackRouter = require('./feedbackRouter')

router.use('/user', userRouter)
router.use('/task', taskRouter)
router.use('/goal', goalRouter)
router.use('/feedback', feedbackRouter)

module.exports = router