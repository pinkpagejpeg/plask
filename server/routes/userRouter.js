const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const checkRoleMiddleware = require('../middleware/CheckRoleMiddleware')
const CaptchaMiddleware = require('../middleware/CaptchaMiddleware')
const { check } = require('express-validator')

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

// Панель администратора

router.post('/', [
    check('email', 'Email пользователя не заполнен').notEmpty(),
    check('password', 'Длина пароля должна составлять от 6 до 12 символов').isLength({ min: 6, max: 12 })
], checkRoleMiddleware('ADMIN'), userController.create)
router.put('/', checkRoleMiddleware('ADMIN'), userController.update)
router.delete('/:userId', AuthMiddleware, userController.delete)
router.get('/', checkRoleMiddleware('ADMIN'), userController.getAll)

module.exports = router