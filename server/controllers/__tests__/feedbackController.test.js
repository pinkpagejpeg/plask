const { User, Feedback } = require("../../models/models")
const ApiError = require('../../error/ApiError')
const { validationResult } = require('express-validator')
const feedbackController = require('../feedbackController')

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
    return errorMessages.slice(0, -2).map(item => item + ', ') + errorMessages.slice(-2).join(' и ')
}))

jest.mock('../../models/models', () => ({
    User: { findByPk: jest.fn() },
    Feedback: { create: jest.fn() }
}))

describe('feedbackController unit tests', () => {
    let req, res, next, mockUser, mockFeedback

    beforeEach(() => {
        req = {
            user: { id: 1, email: 'user@example.com', role: 'USER' },
            body: { info: 'Test feedback' }
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
        mockFeedback = {
            id: 1,
            info: 'Test feedback',
            status: false,
            userId: 1,
            date: '2025-03-17',
            createdAt: "2025-03-17 13:48:44.315+03",
            updatedAt: "2025-03-17 13:48:44.315+03",
        }
    })

    test('Validation result has an error, should return 400', async () => {
        validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'сообщение не введено' }] })

        await feedbackController.create(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith('Введены некорректные данные: сообщение не введено')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: сообщение не введено'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create feedback by user which does not exist, should return 404', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockResolvedValue(null)

        await feedbackController.create(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Пользователь не найден')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь не найден'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockRejectedValue(new Error('Unexpected error'))

        await feedbackController.create(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create feedback with valid data, should return 201', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockResolvedValue(mockUser)
        Feedback.create.mockResolvedValue(mockFeedback)

        await feedbackController.create(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ feedback: mockFeedback })
    })

    afterEach(() => jest.clearAllMocks())
})
