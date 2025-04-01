const { Feedback, Task, Goal, Goal_item, User } = require("../../models/models")
const ApiError = require('../../error/ApiError')
const { validationResult } = require('express-validator')
const adminController = require('../adminController')

jest.mock('../../error/ApiError', () => ({
    badRequest: jest.fn((msg) => new Error(msg)),
    notFound: jest.fn((msg) => new Error(msg)),
    internal: jest.fn((msg) => new Error(msg)),
}))

jest.mock('express-validator', () => ({
    validationResult: jest.fn()
}))

jest.mock('../../error/formatErrorMessages', () => jest.fn((errorMessages) => {
    if (errorMessages.length === 1) return errorMessages
    if (errorMessages.length === 2) return errorMessages.join(' и ')
    return errorMessages.slice(0, -2).map(item => item + ', ') +
        errorMessages.slice(-2).join(' и ')
}))

jest.mock('../../models/models', () => ({
    User: {
        create: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
    },
    Feedback: {
        findByPk: jest.fn(),
        findAll: jest.fn(),
    },
    Task: {
        findAll: jest.fn(),
    },
    Goal: {
        findAll: jest.fn(),
    },
    Goal_item: {
        findAll: jest.fn(),
    }
}))

jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword123'),
}));


describe('adminController unit tests', () => {
    let req, res, next, mockUser, mockUsers, mockFeedback, mockFeedbacks,
    mockGoals, mockSubgoals, mockTasks

    beforeEach(() => {
        req = {
            user: { id: 2, email: 'admin@example.com', role: 'ADMIN' },
            body: {},
            params: {}
        }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        next = jest.fn()

        mockUser = {
            id: 1,
            email: 'user@example.com',
            password: 'hashedPassword123',
            role: 'USER',
            img: 'user_default_image.jpg',
            createdAt: "2025-03-17 13:48:44.315+03",
            updatedAt: "2025-03-17 13:48:44.315+03",
        }

        mockUsers = [
            {
                id: 1,
                email: 'userUpdated@example.com',
                password: 'hashedUpdatedPassword123',
                role: 'ADMIN',
                img: 'user_default_image.jpg',
                createdAt: "2025-03-17 13:48:44.315+03",
                updatedAt: "2025-03-17 13:48:44.315+03",
            },
            {
                id: 2,
                email: 'admin@example.com',
                password: 'hashedPassword123',
                role: 'ADMIN',
                img: 'user_default_image.jpg',
                createdAt: "2025-03-17 13:48:44.315+03",
                updatedAt: "2025-03-17 13:48:44.315+03",
            }
        ]

        mockFeedback = {
            id: 1,
            info: "Great project, looking forward to the next version!",
            date: "2025-02-26",
            status: false,
            userId: 1,
            createdAt: "2025-01-26 13:48:44.241+03",
            updatedAt: "2025-01-26 13:48:44.241+03",
        }

        mockFeedbacks = [
            {
                id: 1,
                info: "Great project, looking forward to the next version!",
                date: "2025-02-26",
                status: true,
                userId: 1,
                createdAt: "2025-02-26 13:48:44.241+03",
                updatedAt: "2025-02-26 13:48:44.241+03",
            },
            {
                id: 2,
                info: "The documentation is a bit lacking, could use more detail.",
                date: "2025-03-26",
                status: false,
                userId: 1,
                createdAt: "2025-03-26 13:48:44.241+03",
                updatedAt: "2025-03-26 13:48:44.241+03",
            }
        ]

        mockGoals = [
            {
                id: 1,
                info: 'Complete the project',
                userId: 1,
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            },
            {
                id: 2,
                info: 'Write documentation',
                userId: 1,
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            }
        ]

        mockSubgoals = [
            {
                id: 1,
                info: 'Add unit test for goals',
                status: true,
                goalId: 1,
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            },
            {
                id: 2,
                info: 'Add integration test for goals',
                status: false,
                goalId: 1,
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            }
        ]

        mockTasks = [
            {
                id: 1,
                info: 'Updated task info',
                status: true,
                userId: 1,
                createdAt: "2025-01-26 13:48:44.315+03",
                updatedAt: "2025-01-26 13:48:44.315+03",
            },
            {
                id: 2,
                info: 'Task tests again',
                status: false,
                userId: 1,
                createdAt: "2025-01-27 13:48:44.315+03",
                updatedAt: "2025-01-27 13:48:44.315+03",
            }
        ]
    })

    // Users
    test('Create user with invalid email, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'email пользователя не заполнен' }]
        })

        req.body.email = ''
        req.body.role = 'USER'
        req.body.password = '12345678'
        await adminController.create(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: email пользователя не заполнен'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: email пользователя не заполнен'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create user with invalid role, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'роль пользователя не заполнена' }]
        })

        req.body.email = 'user@example.com'
        req.body.role = ''
        req.body.password = '12345678'
        await adminController.create(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: роль пользователя не заполнена'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: роль пользователя не заполнена'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create user with invalid password, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'длина пароля должна составлять от 6 до 12 символов' }]
        })

        req.body.email = 'user@example.com'
        req.body.role = 'USER'
        req.body.password = '1234'
        await adminController.create(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create user with invalid email, role and password, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [
                { msg: 'email пользователя не заполнен' },
                { msg: 'роль пользователя не заполнена' },
                { msg: 'длина пароля должна составлять от 6 до 12 символов' }
            ]
        })

        req.body.email = ''
        req.body.role = ''
        req.body.password = '1234'
        await adminController.create(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: email пользователя не заполнен, роль пользователя не заполнена и длина пароля должна составлять от 6 до 12 символов'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: email пользователя не заполнен, роль пользователя не заполнена и длина пароля должна составлять от 6 до 12 символов'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create user with unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findOne.mockRejectedValue(new Error('Unexpected error'))

        req.body.email = 'user@example.com'
        req.body.role = 'USER'
        req.body.password = '12345678'
        await adminController.create(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create user with valid data, should return 201', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findOne.mockResolvedValue(null)
        User.create.mockResolvedValue(mockUser)

        req.body.email = 'user@example.com'
        req.body.role = 'USER'
        req.body.password = '12345678'
        await adminController.create(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ user: mockUser })
    })

    test('Create user with another candidate, should return 400', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findOne.mockResolvedValue(mockUser)

        req.body.email = 'user@example.com'
        req.body.role = 'USER'
        req.body.password = '12345678'
        await adminController.create(req, res, next)

        expect(ApiError.badRequest)
            .toHaveBeenCalledWith('Пользователь с таким именем уже существует')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь с таким именем уже существует'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update user with invalid email, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'email пользователя не заполнен' }]
        })

        req.params.userId = mockUser.id
        req.body.email = ''
        req.body.role = 'USER'
        req.body.password = '123456789'
        await adminController.update(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: email пользователя не заполнен'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: email пользователя не заполнен'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update user with invalid role, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'роль пользователя не заполнена' }]
        })

        req.params.userId = mockUser.id
        req.body.email = 'user@example.com'
        req.body.role = ''
        req.body.password = '123456789'
        await adminController.update(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: роль пользователя не заполнена'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: роль пользователя не заполнена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update user with invalid password, should return 400', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockResolvedValue(mockUser)

        req.params.userId = mockUser.id
        req.body.email = 'user@example.com'
        req.body.role = 'USER'
        req.body.password = '1234'
        await adminController.update(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update user with invalid email and role, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [
                { msg: 'email пользователя не заполнен' },
                { msg: 'роль пользователя не заполнена' },
            ]
        })

        req.params.userId = mockUser.id
        req.body.email = ''
        req.body.role = ''
        req.body.password = '123456789'
        await adminController.update(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: email пользователя не заполнен и роль пользователя не заполнена'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: email пользователя не заполнен и роль пользователя не заполнена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update user with unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockRejectedValue(new Error('Unexpected error'))

        req.params.userId = mockUser.id
        req.body.email = 'user@example.com'
        req.body.role = 'USER'
        req.body.password = '123456789'
        await adminController.update(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update user which does not exist, should return 404', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockResolvedValue(null)

        req.params.userId = mockUser.id
        req.body.email = 'user@example.com'
        req.body.role = 'USER'
        req.body.password = '123456789'
        await adminController.update(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Пользователь не найден')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь не найден'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update user email with valid data, should return 200', async () => {
        const updatedUser = {
            ...mockUser,
            update: jest.fn().mockResolvedValue({ ...mockUser, email: 'user1@example.com' }),
            toJSON: jest.fn().mockReturnValue({ ...mockUser, email: 'user1@example.com' })
        }
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockResolvedValue(updatedUser)
        User.findOne.mockResolvedValue(null)

        req.params.userId = mockUser.id
        req.body.email = 'user1@example.com'
        req.body.role = 'USER'
        req.body.password = ''
        await adminController.update(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ user: updatedUser })

        mockUser.email = 'user1@example.com'
    })

    test('Update user role with valid data, should return 200', async () => {
        const updatedUser = {
            ...mockUser,
            update: jest.fn().mockResolvedValue({ ...mockUser, role: 'ADMIN' }),
            toJSON: jest.fn().mockReturnValue({ ...mockUser, role: 'ADMIN' })
        }
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockResolvedValue(updatedUser)
        User.findOne.mockResolvedValue(null)

        req.params.userId = mockUser.id
        req.body.email = 'user1@example.com'
        req.body.role = 'ADMIN'
        req.body.password = ''
        await adminController.update(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ user: updatedUser })

        mockUser.role = 'ADMIN'
    })

    test('Update user password with valid data, should return 200', async () => {
        const updatedUser = {
            ...mockUser,
            update: jest.fn().mockResolvedValue({ ...mockUser, password: 'hashedPassword123' }),
            toJSON: jest.fn().mockReturnValue({ ...mockUser, password: 'hashedPassword123' })
        }
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockResolvedValue(updatedUser)
        User.findOne.mockResolvedValue(null)

        req.params.userId = mockUser.id
        req.body.email = 'user1@example.com'
        req.body.role = 'ADMIN'
        req.body.password = '123456789'
        await adminController.update(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ user: updatedUser })
    })

    test('Update user with another candidate, should return 400', async () => {
        const updatedUser = {
            ...mockUser,
            update: jest.fn().mockResolvedValue({ ...mockUser, email: 'user11@example.com' }),
            toJSON: jest.fn().mockReturnValue({ ...mockUser, email: 'user11@example.com' })
        }
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockResolvedValue(updatedUser)
        User.findOne.mockResolvedValue(mockUser)

        req.params.userId = mockUser.id
        req.body.email = 'user11@example.com'
        req.body.role = 'USER'
        req.body.password = ''
        await adminController.update(req, res, next)

        expect(ApiError.badRequest)
            .toHaveBeenCalledWith('Пользователь с таким именем уже существует')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь с таким именем уже существует'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get users with unexpected error, should return 500', async () => {
        User.findAll.mockRejectedValue(new Error('Unexpected error'))

        await adminController.getAllUsers(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get users with valid data, should return 200', async () => {
        User.findAll.mockResolvedValue(mockUsers)

        await adminController.getAllUsers(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ users: mockUsers, count: mockUsers.length })
    })

    test('Delete user which does not exist, should return 404', async () => {
        User.findByPk.mockResolvedValue(null)

        req.params.userId = 1
        await adminController.delete(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Пользователь не найден')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь не найден'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Delete user with unexpected error, should return 500', async () => {
        User.findByPk.mockRejectedValue(new Error('Unexpected error'))

        req.params.userId = 1
        await adminController.delete(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Delete user with valid data, should return 200', async () => {
        const deletedUser = {
            ...mockUser,
            destroy: jest.fn().mockResolvedValue({ mockUser }),
        }
        const deletedGoals = mockGoals.map(item => ({
            ...item,
            destroy: jest.fn().mockResolvedValue(item)
        }))
        const deletedSubgoals = mockSubgoals.map(item => ({
            ...item,
            destroy: jest.fn().mockResolvedValue(item)
        }))
        const deletedTasks = mockTasks.map(item => ({
            ...item,
            destroy: jest.fn().mockResolvedValue(item)
        }))
        const deletedFeedbacks = mockFeedbacks.map(item => ({
            ...item,
            destroy: jest.fn().mockResolvedValue(item)
        }))
        User.findByPk.mockResolvedValue(deletedUser)
        Feedback.findAll.mockResolvedValue(deletedFeedbacks)
        Task.findAll.mockResolvedValue(deletedTasks)
        Goal.findAll.mockResolvedValue(deletedGoals)
        Goal_item.findAll.mockResolvedValue(deletedSubgoals)

        req.params.userId = 1
        await adminController.delete(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ deletedUserId: deletedUser.id })
    })

    // Feedbacks
    test('Update feedback status with validation error, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'отсутствует статус обратной связи' }]
        })

        await adminController.changeStatus(req, res, next)

        expect(ApiError.badRequest)
            .toHaveBeenCalledWith('Введены некорректные данные: отсутствует статус обратной связи')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: отсутствует статус обратной связи'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update feedback status by user which does not exist, should return 404', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Feedback.findByPk.mockResolvedValue(null)

        req.params.feedbackId = 1
        req.body.status = true
        await adminController.changeStatus(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Обращение не найдено')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Обращение не найдено'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update feedback status with unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Feedback.findByPk.mockRejectedValue(new Error('Unexpected error'))

        req.params.feedbackId = 1
        req.body.status = true
        await adminController.changeStatus(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update feedback status with valid data, should return 200', async () => {
        const updatedFeedback = {
            ...mockFeedback,
            update: jest.fn().mockResolvedValue({ ...mockFeedback, status: true }),
            toJSON: jest.fn().mockReturnValue({ ...mockFeedback, status: true })
        }
        validationResult.mockReturnValue({ isEmpty: () => true })
        Feedback.findByPk.mockResolvedValue(updatedFeedback)

        req.params.feedbackId = 1
        req.body.status = true
        await adminController.changeStatus(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ feedback: updatedFeedback })
    })

    test('Get feedbacks with unexpected error, should return 500', async () => {
        Feedback.findAll.mockRejectedValue(new Error('Unexpected error'))

        await adminController.getAllFeedbacks(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get feedbacks with valid data, should return 200', async () => {
        Feedback.findAll.mockResolvedValue(mockFeedbacks)

        await adminController.getAllFeedbacks(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({
            feedbacks: mockFeedbacks,
            count: mockFeedbacks.length
        })
    })

    afterEach(() => jest.clearAllMocks())
})