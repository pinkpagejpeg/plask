const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const { check } = require('express-validator')

router.post('/registration', [
    check('email', 'Email пользователя не заполнен').notEmpty(),
    check('password', 'Длина пароля должна составлять от 6 до 12 символов').isLength({ min: 6, max: 12 })
], userController.registration)

router.post('/login', [
    check('email', 'Email пользователя не заполнен').notEmpty(),
    check('password', 'Длина пароля должна составлять от 6 до 12 символов').isLength({min: 6, max: 12})
], userController.login)

router.get('/auth', AuthMiddleware, userController.check)

module.exports = router