const Router = require('express')
const adminController = require('../controllers/adminController')
const checkRoleMiddleware = require('../middleware/CheckRoleMiddleware')
const { check } = require('express-validator')

const router = new Router()
router.use(checkRoleMiddleware('ADMIN'))

// Users
// Create user (admins only)
router.post(
    '/users',
    [
        check('email', 'email пользователя не заполнен').notEmpty(),
        check('role', 'роль пользователя не заполнена').notEmpty(),
        check('password', 'длина пароля должна составлять от 6 до 12 символов').isLength({ min: 6, max: 12 })
    ],
    adminController.create
)

// Update user (admins only)
router.patch(
    '/users/:userId', 
    [
        check('email', 'email пользователя не заполнен').notEmpty(),
        check('role', 'роль пользователя не заполнена').notEmpty(),
    ],
    adminController.update
)

// Get all users (admins only)
router.get(
    '/users', 
    adminController.getAllUsers
)

// Delete user (admins only)
router.delete(
    '/users/:userId', 
    adminController.delete
)

// Feedbacks
// Get all the feedback (admins only)    
router.get(
    '/feedbacks',
    adminController.getAllFeedbacks
)

// Update feedback status (admins only)
router.patch(
    '/feedbacks/:feedbackId',
    check('status', 'отсутствует статус обратной связи').exists(),
    adminController.changeStatus
)

// Delete feedback (admins only)
// router.delete('/:feedbackId')

module.exports = router