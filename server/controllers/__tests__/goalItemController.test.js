const { Goal, Goal_item } = require("../../models/models")
const ApiError = require('../../error/ApiError')
const { validationResult } = require('express-validator')
const goalItemController = require('../goalItemController')

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
    Goal: { findByPk: jest.fn() },
    Goal_item: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn()
    }
}))

describe('goalItemController unit tests', () => {
    let req, res, next, mockGoal, mockGoalItem, mockGoalItems

    beforeEach(() => {
        req = {
            user: { id: 1, email: 'user@example.com', role: 'USER' },
            body: {},
            params: { goalId: 1 }
        }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        next = jest.fn()

        mockGoal = {
            id: 1,
            info: 'Add tests',
            userId: 1,
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

        mockGoalItem = {
            id: 1,
            info: 'Add unit test for subgoals',
            status: false,
            goalId: 1,
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

        mockGoalItems = [
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

    test('Create subgoal with validation error, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'подцель не введена' }]
        })

        req.body.info = ''
        await goalItemController.createItem(req, res, next)

        expect(ApiError.badRequest)
            .toHaveBeenCalledWith('Введены некорректные данные: подцель не введена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: подцель не введена'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create subgoal by user which does not exist, should return 404', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Goal.findByPk.mockResolvedValue(null)

        req.body.info = 'Add unit test for subgoals'
        await goalItemController.createItem(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Цель не найдена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Цель не найдена'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create subgoal with unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Goal.findByPk.mockRejectedValue(new Error('Unexpected error'))

        req.body.info = 'Add unit test for subgoals'
        await goalItemController.createItem(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create subgoal with valid data, should return 201', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Goal.findByPk.mockResolvedValue(mockGoal)
        Goal_item.create.mockResolvedValue(mockGoalItem)

        req.body.info = 'Add unit test for subgoals'
        await goalItemController.createItem(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ goalItem: mockGoalItem })
    })

    test('Update subgoal with validation error, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'подцель не введена' }]
        })

        req.body.info = ''
        req.params.goalItemId = 1
        await goalItemController.updateItem(req, res, next)

        expect(ApiError.badRequest)
            .toHaveBeenCalledWith('Введены некорректные данные: подцель не введена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: подцель не введена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update subgoal by user which does not exist, should return 404', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Goal_item.findByPk.mockResolvedValue(null)

        req.body.info = 'Add unit test for goals'
        req.params.goalItemId = 1
        await goalItemController.updateItem(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Подцель не найдена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Подцель не найдена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update subgoal with unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Goal_item.findByPk.mockRejectedValue(new Error('Unexpected error'))

        req.body.info = 'Add unit test for goals'
        req.params.goalItemId = 1
        await goalItemController.updateItem(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update subgoal with valid data, should return 200', async () => {
        const updatedGoalItem = {
            ...mockGoalItem,
            update: jest.fn().mockResolvedValue({
                ...mockGoalItem,
                info: 'Add unit test for goals'
            }),
            toJSON: jest.fn().mockReturnValue({
                ...mockGoalItem,
                info: 'Add unit test for goals'
            })
        }
        validationResult.mockReturnValue({ isEmpty: () => true })
        Goal_item.findByPk.mockResolvedValue(updatedGoalItem)

        req.body.info = 'Add unit test for goals'
        req.params.goalItemId = 1
        await goalItemController.updateItem(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ goalItem: updatedGoalItem })

        mockGoalItem.info = 'Add unit test for goals'
    })

    test('Update subgoal status with validation error, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'отсутствует статус подцели' }]
        })

        await goalItemController.changeItemStatus(req, res, next)

        expect(ApiError.badRequest)
            .toHaveBeenCalledWith('Введены некорректные данные: отсутствует статус подцели')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: отсутствует статус подцели'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update subgoal status by user which does not exist, should return 404', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Goal_item.findByPk.mockResolvedValue(null)

        req.body.status = true
        req.params.goalItemId = 1
        await goalItemController.changeItemStatus(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Подцель не найдена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Подцель не найдена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update subgoal status with unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Goal_item.findByPk.mockRejectedValue(new Error('Unexpected error'))

        req.body.status = true
        req.params.goalItemId = 1
        await goalItemController.changeItemStatus(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update subgoal status with valid data, should return 200', async () => {
        const updatedGoalItem = {
            ...mockGoalItem,
            update: jest.fn().mockResolvedValue({ ...mockGoalItem, status: true }),
            toJSON: jest.fn().mockReturnValue({ ...mockGoalItem, status: true })
        }
        validationResult.mockReturnValue({ isEmpty: () => true })
        Goal_item.findByPk.mockResolvedValue(updatedGoalItem)

        req.body.status = true
        req.params.goalItemId = 1
        await goalItemController.changeItemStatus(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ goalItem: updatedGoalItem })

        mockGoalItem.status = true
    })

    test('Get subgoals by user which does not exist, should return 404', async () => {
        Goal.findByPk.mockResolvedValue(null)

        await goalItemController.getAllItems(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Цель не найдена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Цель не найдена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get subgoals with unexpected error, should return 500', async () => {
        Goal.findByPk.mockRejectedValue(new Error('Unexpected error'))

        await goalItemController.getAllItems(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get subgoals with valid data, should return 200', async () => {
        Goal.findByPk.mockResolvedValue(mockGoal)
        Goal_item.findAll.mockResolvedValue(mockGoalItems)

        await goalItemController.getAllItems(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({
            goalItems: mockGoalItems,
            count: mockGoalItems.length
        })
    })

    test('Delete subgoal which does not exist, should return 404', async () => {
        Goal_item.findByPk.mockResolvedValue(null)

        await goalItemController.deleteItem(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Подцель не найдена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Подцель не найдена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Delete subgoal with unexpected error, should return 500', async () => {
        Goal_item.findByPk.mockRejectedValue(new Error('Unexpected error'))

        await goalItemController.deleteItem(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Delete subgoal with valid data, should return 200', async () => {
        const deletedGoalItem = {
            ...mockGoalItem,
            destroy: jest.fn().mockResolvedValue({ mockGoalItem }),
        }
        Goal_item.findByPk.mockResolvedValue(deletedGoalItem)

        await goalItemController.deleteItem(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ deletedGoalItemId: deletedGoalItem.id })
    })

    afterEach(() => jest.clearAllMocks())
})
