const { User, Goal, Goal_item } = require("../../models/models")
const ApiError = require('../../error/ApiError')
const { validationResult } = require('express-validator')
const goalController = require('../goalController')

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
    User: { findByPk: jest.fn() },
    Goal: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn()
    },
    Goal_item: { findAll: jest.fn() }
}))

describe('goalController unit tests', () => {
    let req, res, next, mockUser, mockGoal, mockGoals, mockSubgoals

    beforeEach(() => {
        req = {
            user: { id: 1, email: 'user@example.com', role: 'USER' },
            body: {},
            params: { goalId: 1 }
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

        mockGoal = {
            id: 1,
            info: 'Complete the game',
            userId: 1,
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

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
    })

    test('Create goal with validation error, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'цель не введена' }]
        })

        req.body.info = ''
        await goalController.create(req, res, next)

        expect(ApiError.badRequest)
            .toHaveBeenCalledWith('Введены некорректные данные: цель не введена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: цель не введена'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create goal by user which does not exist, should return 404', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockResolvedValue(null)

        req.body.info = 'Complete the game'
        await goalController.create(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Пользователь не найден')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь не найден'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create goal with unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockRejectedValue(new Error('Unexpected error'))

        req.body.info = 'Complete the game'
        await goalController.create(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create goal with valid data, should return 201', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockResolvedValue(mockUser)
        Goal.create.mockResolvedValue(mockGoal)

        req.body.info = 'Complete the game'
        await goalController.create(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ goal: mockGoal })
    })

    test('Update goal with validation error, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'цель не введена' }]
        })

        req.body.info = ''
        await goalController.update(req, res, next)

        expect(ApiError.badRequest)
            .toHaveBeenCalledWith('Введены некорректные данные: цель не введена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: цель не введена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update goal by user which does not exist, should return 404', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Goal.findByPk.mockResolvedValue(null)

        req.body.info = 'Complete the project'
        await goalController.update(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Цель не найдена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Цель не найдена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update goal with unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Goal.findByPk.mockRejectedValue(new Error('Unexpected error'))

        req.body.info = 'Complete the project'
        await goalController.update(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update goal with valid data, should return 200', async () => {
        const updatedGoal = {
            ...mockGoal,
            update: jest.fn().mockResolvedValue({ ...mockGoal, info: 'Complete the project' }),
            toJSON: jest.fn().mockReturnValue({ ...mockGoal, info: 'Complete the project' })
        }
        validationResult.mockReturnValue({ isEmpty: () => true })
        Goal.findByPk.mockResolvedValue(updatedGoal)

        req.body.info = 'Complete the project'
        await goalController.update(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ goal: updatedGoal })

        mockGoal.info = 'Complete the project'
    })

    test('Get goal info which does not exist, should return 404', async () => {
        Goal.findByPk.mockResolvedValue(null)

        await goalController.getOne(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Цель не найдена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Цель не найдена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get goal info with unexpected error, should return 500', async () => {
        Goal.findByPk.mockRejectedValue(new Error('Unexpected error'))

        await goalController.getOne(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get goal info with valid data, should return 200', async () => {
        Goal.findByPk.mockResolvedValue(mockGoal)

        await goalController.getOne(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ goal: mockGoal })
    })

    test('Get goal progress which does not exist, should return 404', async () => {
        Goal.findByPk.mockResolvedValue(null)

        await goalController.getProgress(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Цель не найдена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Цель не найдена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get goal progress with unexpected error, should return 500', async () => {
        Goal.findByPk.mockRejectedValue(new Error('Unexpected error'))

        await goalController.getProgress(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get goal progress with valid data, should return 200', async () => {
        Goal.findByPk.mockResolvedValue(mockGoal)
        Goal_item.findAll.mockResolvedValue([])

        await goalController.getProgress(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ progress: 0 })

        Goal.findByPk.mockResolvedValue(mockGoal)
        Goal_item.findAll.mockResolvedValue(mockSubgoals)

        await goalController.getProgress(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ progress: 50 })
    })

    test('Get goals by user which does not exist, should return 404', async () => {
        User.findByPk.mockResolvedValue(null)

        await goalController.getAll(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Пользователь не найден')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь не найден'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get goals with unexpected error, should return 500', async () => {
        User.findByPk.mockRejectedValue(new Error('Unexpected error'))

        await goalController.getAll(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get goals with valid data, should return 200', async () => {
        User.findByPk.mockResolvedValue(mockUser)
        Goal.findAll.mockResolvedValue(mockGoals)

        await goalController.getAll(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ goals: mockGoals, count: mockGoals.length })
    })

    test('Delete goal which does not exist, should return 404', async () => {
        Goal.findByPk.mockResolvedValue(null)
        Goal_item.findAll.mockResolvedValue(mockSubgoals)

        await goalController.delete(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Цель не найдена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Цель не найдена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Delete goal with unexpected error, should return 500', async () => {
        Goal.findByPk.mockRejectedValue(new Error('Unexpected error'))
        Goal_item.findAll.mockResolvedValue(mockSubgoals)

        await goalController.delete(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Delete goal with valid data, should return 200', async () => {
        const deletedGoal = {
            ...mockGoal,
            destroy: jest.fn().mockResolvedValue({ mockGoal }),
        }
        const deletedSuboals = mockSubgoals.map(item => ({
            ...item,
            destroy: jest.fn().mockResolvedValue(item)
        }))
        Goal.findByPk.mockResolvedValue(deletedGoal)
        Goal_item.findAll.mockResolvedValue(deletedSuboals)

        await goalController.delete(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ deletedGoalId: deletedGoal.id })
    })

    afterEach(() => jest.clearAllMocks())
})