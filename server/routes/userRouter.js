const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const checkRoleMiddleware = require('../middleware/CheckRoleMiddleware')
const CaptchaMiddleware = require('../middleware/CaptchaMiddleware')
const { check } = require('express-validator')

// Панель администратора

router.post('/admin', [
    check('email', 'Email пользователя не заполнен').notEmpty(),
    check('password', 'Длина пароля должна составлять от 6 до 12 символов').isLength({ min: 6, max: 12 })
], checkRoleMiddleware('ADMIN'), userController.create)
router.put('/admin', checkRoleMiddleware('ADMIN'), userController.update)
router.get('/admin', checkRoleMiddleware('ADMIN'), userController.getAll)
router.delete('/admin/:userId', checkRoleMiddleware('ADMIN'), userController.delete)

router.post('/registration', [
    check('email', 'Email пользователя не заполнен').notEmpty(),
    check('password', 'Длина пароля должна составлять от 6 до 12 символов').isLength({ min: 6, max: 12 })
], CaptchaMiddleware, userController.registration)
router.post('/login', [
    check('email', 'Email пользователя не заполнен').notEmpty(),
    check('password', 'Длина пароля должна составлять от 6 до 12 символов').isLength({ min: 6, max: 12 })
], CaptchaMiddleware, userController.login)
router.get('/auth', AuthMiddleware, userController.check)

router.get('/:userId', AuthMiddleware, userController.getOne)
router.put('/info', AuthMiddleware, userController.updateUserInfo)
router.put('/:userId/image', AuthMiddleware, userController.updateUserImage)
router.put('/image', AuthMiddleware, userController.deleteUserImage)
router.delete('/:userId', AuthMiddleware, userController.delete)

module.exports = router