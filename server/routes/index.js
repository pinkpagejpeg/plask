const Router = require('express')
const userRouter = require('./userRouter')
const taskRouter = require('./taskRouter')
const goalItemRouter = require('./goalItemRouter')
const goalRouter = require('./goalRouter')
const feedbackRouter = require('./feedbackRouter')
const adminRouter = require('./adminRouter')

const router = new Router()

router.use('/user', userRouter)
router.use('/task', taskRouter)
router.use('/goal', goalItemRouter)
router.use('/goal', goalRouter)
router.use('/feedback', feedbackRouter)
router.use('/admin', adminRouter)

module.exports = router