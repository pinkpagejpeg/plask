const Router = require('express')
const userController = require('../controllers/userController')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const CaptchaMiddleware = require('../middleware/CaptchaMiddleware')
const { check } = require('express-validator')

const router = new Router()

// User registration
router.post(
    '/registration',
    [
        check('email', 'email пользователя не заполнен').notEmpty(),
        check('password', 'длина пароля должна составлять от 6 до 12 символов').isLength({ min: 6, max: 12 }),
    ],
    CaptchaMiddleware,
    userController.registration
)

// Login user
router.post(
    '/login',
    [
        check('email', 'email пользователя не заполнен').notEmpty(),
        check('password', 'длина пароля должна составлять от 6 до 12 символов').isLength({ min: 6, max: 12 })
    ],
    CaptchaMiddleware,
    userController.login
)

// Check user authorization (authorized users)
router.get(
    '/auth', 
    AuthMiddleware, 
    userController.check
)

// Get user info (authorized users)
router.get(
    '/', 
    AuthMiddleware, 
    userController.getInfo
)

// Update user info (authorized users)
router.patch(
    '/info', 
    check('email', 'email пользователя не заполнен').notEmpty(),
    AuthMiddleware, 
    userController.updateInfo
)

// Update user image (authorized users)
router.patch(
    '/image', 
    AuthMiddleware, 
    userController.updateImage
)

// Delete user image (authorized users)
router.delete(
    '/image', 
    AuthMiddleware, 
    userController.deleteImage
)

// Delete user account (authorized users)
router.delete(
    '/', 
    AuthMiddleware, 
    userController.delete
)

module.exports = router