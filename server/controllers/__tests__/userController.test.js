const { User, Feedback, Task, Goal, Goal_item } = require("../../models/models")
const ApiError = require('../../error/ApiError')
const { validationResult } = require('express-validator')
const userController = require('../userController')
const generateJwt = require('../../utils/generateJwt')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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
    compareSync: jest.fn()
}));

jest.mock('uuid', () => ({
    v4: jest.fn().mockResolvedValue('new_uuidv4_name.jpg'),
}));

jest.mock('path', () => ({
    resolve: jest.fn(() => '../../static/new_uuidv4_name.jpg')
}))

jest.mock('../../utils/generateJwt', () => jest.fn())

describe('userController unit tests', () => {
    let req, res, next, mockUser, mockJwtToken, mockFeedbacks,
        mockGoals, mockSubgoals, mockTasks

    beforeEach(() => {
        req = {
            user: { id: 1, email: 'user@example.com', role: 'USER' },
            body: {},
            params: {},
            files: {}
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

        mockJwtToken = jwt.sign(
            {
                id: mockUser.id,
                email: mockUser.email,
                role: mockUser.role
            },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        )

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

    test('User registration with invalid email, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'email пользователя не заполнен' }]
        })

        req.body.email = ''
        req.body.role = 'USER'
        req.body.password = '12345678'
        await userController.registration(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: email пользователя не заполнен'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: email пользователя не заполнен'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('User registration with invalid password, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'длина пароля должна составлять от 6 до 12 символов' }]
        })

        req.body.email = 'user@example.com'
        req.body.role = 'USER'
        req.body.password = '1234'
        await userController.registration(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('User registration with invalid email and password, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [
                { msg: 'email пользователя не заполнен' },
                { msg: 'длина пароля должна составлять от 6 до 12 символов' }
            ]
        })

        req.body.email = ''
        req.body.role = 'USER'
        req.body.password = '1234'
        await userController.registration(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: email пользователя не заполнен и длина пароля должна составлять от 6 до 12 символов'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: email пользователя не заполнен и длина пароля должна составлять от 6 до 12 символов'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('User registration with unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findOne.mockRejectedValue(new Error('Unexpected error'))

        req.body.email = 'user@example.com'
        req.body.role = 'USER'
        req.body.password = '12345678'
        await userController.registration(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('User registration with valid data, should return 201', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        generateJwt.mockImplementation(() => mockJwtToken)
        User.findOne.mockResolvedValue(null)
        User.create.mockResolvedValue(mockUser)

        req.body.email = 'user@example.com'
        req.body.role = 'USER'
        req.body.password = '12345678'
        await userController.registration(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ token: mockJwtToken })
    })

    test('User registration with another candidate, should return 400', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findOne.mockResolvedValue(mockUser)

        req.body.email = 'user@example.com'
        req.body.role = 'USER'
        req.body.password = '12345678'
        await userController.registration(req, res, next)

        expect(ApiError.badRequest)
            .toHaveBeenCalledWith('Пользователь с таким именем уже существует')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь с таким именем уже существует'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('User login with invalid email, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'email пользователя не заполнен' }]
        })

        req.body.email = ''
        req.body.password = '12345678'
        await userController.login(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: email пользователя не заполнен'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: email пользователя не заполнен'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('User login with invalid password, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'длина пароля должна составлять от 6 до 12 символов' }]
        })

        req.body.email = 'user@example.com'
        req.body.password = '1234'
        await userController.login(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('User login with invalid email and password, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [
                { msg: 'email пользователя не заполнен' },
                { msg: 'длина пароля должна составлять от 6 до 12 символов' }
            ]
        })

        req.body.email = ''
        req.body.password = '1234'
        await userController.login(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: email пользователя не заполнен и длина пароля должна составлять от 6 до 12 символов'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: email пользователя не заполнен и длина пароля должна составлять от 6 до 12 символов'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('User login with unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findOne.mockRejectedValue(new Error('Unexpected error'))

        req.body.email = 'user@example.com'
        req.body.password = '12345678'
        await userController.login(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('User login with wrong email, should return 404', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findOne.mockResolvedValue(null)

        req.body.email = 'wrongUser@example.com'
        req.body.password = '12345678'
        await userController.login(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Пользователь не найден')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь не найден'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('User login with wrong password, should return 400', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        bcrypt.compareSync.mockImplementation(() => false)
        User.findOne.mockResolvedValue(mockUser)

        req.body.email = 'user@example.com'
        req.body.password = '123456'
        await userController.login(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введен неверный пароль'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введен неверный пароль'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('User login with valid data, should return 201', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        bcrypt.compareSync.mockImplementation(() => true)
        generateJwt.mockImplementation(() => mockJwtToken)
        User.findOne.mockResolvedValue(mockUser)

        req.body.email = 'user@example.com'
        req.body.password = '12345678'
        await userController.login(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ token: mockJwtToken })
    })

    test('Check user with unexpected error, should return 500', async () => {
        generateJwt.mockImplementation(() => { throw new Error('Unexpected error') })

        await userController.check(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Check user with valid data, should return 201', async () => {
        generateJwt.mockImplementation(() => mockJwtToken)

        await userController.check(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ token: mockJwtToken })
    })

    test('Get user info by user which does not exist, should return 404', async () => {
        User.findByPk.mockResolvedValue(null)

        await userController.getInfo(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Пользователь не найден')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь не найден'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get user info with unexpected error, should return 500', async () => {
        User.findByPk.mockRejectedValue(new Error('Unexpected error'))

        await userController.getInfo(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get user info with valid data, should return 200', async () => {
        User.findByPk.mockResolvedValue(mockUser)

        await userController.getInfo(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ user: mockUser })
    })

    test('Update user with invalid email, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'email пользователя не заполнен' }]
        })

        req.body.email = ''
        req.body.password = '123456789'
        await userController.updateInfo(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: email пользователя не заполнен'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: email пользователя не заполнен'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update user with invalid password, should return 400', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockResolvedValue(mockUser)

        req.body.email = 'user@example.com'
        req.body.password = '1234'
        await userController.updateInfo(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith(
            'Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов'
        )
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update user with unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockRejectedValue(new Error('Unexpected error'))

        req.body.email = 'user@example.com'
        req.body.password = '123456789'
        await userController.updateInfo(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update user which does not exist, should return 404', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockResolvedValue(null)

        req.body.email = 'user@example.com'
        req.body.password = '123456789'
        await userController.updateInfo(req, res, next)

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

        req.body.email = 'user1@example.com'
        req.body.password = ''
        await userController.updateInfo(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ token: mockJwtToken })
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

        req.body.email = 'user1@example.com'
        req.body.password = '123456789'
        await userController.updateInfo(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ token: mockJwtToken })
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

        req.body.email = 'user11@example.com'
        req.body.password = ''
        await userController.updateInfo(req, res, next)

        expect(ApiError.badRequest)
            .toHaveBeenCalledWith('Пользователь с таким именем уже существует')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь с таким именем уже существует'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update user image with unexpected error, should return 500', async () => {
        User.findByPk.mockRejectedValue(new Error('Unexpected error'))

        req.files.file = { mv: jest.fn().mockResolvedValue(undefined) }
        await userController.updateImage(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update user image which does not exist, should return 404', async () => {
        User.findByPk.mockResolvedValue(null)

        req.files.file = { mv: jest.fn().mockResolvedValue(undefined) }
        await userController.updateImage(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Пользователь не найден')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь не найден'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update user image email with valid data, should return 200', async () => {
        const updatedUser = {
            ...mockUser,
            update: jest.fn().mockResolvedValue({ ...mockUser, img: 'new_uuidv4_name.jpg' }),
            toJSON: jest.fn().mockReturnValue({ ...mockUser, img: 'new_uuidv4_name.jpg' })
        }
        User.findByPk.mockResolvedValue(updatedUser)

        req.files.file = { mv: jest.fn().mockResolvedValue(undefined) }
        await userController.updateImage(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ user: updatedUser })
    })

    test('Delete user image with unexpected error, should return 500', async () => {
        User.findByPk.mockRejectedValue(new Error('Unexpected error'))

        await userController.deleteImage(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Delete user image which does not exist, should return 404', async () => {
        User.findByPk.mockResolvedValue(null)

        await userController.deleteImage(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Пользователь не найден')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь не найден'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Delete user image email with valid data, should return 200', async () => {
        const updatedUser = {
            ...mockUser,
            update: jest.fn().mockResolvedValue({ ...mockUser, img: 'user_default_image.jpg' }),
            toJSON: jest.fn().mockReturnValue({ ...mockUser, img: 'user_default_image.jpg' })
        }
        User.findByPk.mockResolvedValue(updatedUser)

        await userController.deleteImage(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ user: updatedUser })
    })

    test('Delete user which does not exist, should return 404', async () => {
        User.findByPk.mockResolvedValue(null)

        await userController.delete(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Пользователь не найден')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь не найден'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Delete user with unexpected error, should return 500', async () => {
        User.findByPk.mockRejectedValue(new Error('Unexpected error'))

        await userController.delete(req, res, next)

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

        await userController.delete(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ deletedUserId: deletedUser.id })
    })

    afterEach(() => jest.clearAllMocks())
})