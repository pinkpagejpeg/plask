const request = require('supertest')
const express = require('express')
const feedbackController = require('../../../controllers/feedbackController')
const errorHandler = require('../../../middleware/ErrorHandlingMiddleware')
const feedbackRouter = require('../../feedbackRouter')
const { mockUserJwtToken, mockFakeUserJwtToken } = require('@mocks/jwtTokenMocks')
const {
    checkRouteWithInvalidInfo, checkRouteWithInvalidToken,
    checkRouteWithNonexistentData, checkRouteWithUnexpectedError
} = require('./checkRouter')

jest.mock('../../../controllers/feedbackController', () => ({
    create: jest.fn(),
}))

jest.mock('../../../middleware/AuthMiddleware', () => {
    const ApiError = require('../../../error/ApiError')
    const jwt = require('jsonwebtoken')
    return jest.fn((req, res, next) => {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            throw ApiError.unauthorized('Пользователь не авторизован')
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decoded
            next()
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return next(ApiError.unauthorized('Неверный или просроченный токен'))
            }

            next(error)
        }
    })
})

jest.mock('express-validator', () => {
    const mockValidationChain = jest.fn((req, res, next) => next())

    const chainMethods = ['notEmpty', 'exists']
    chainMethods.forEach(method => {
        mockValidationChain[method] = jest.fn(() => mockValidationChain)
    })

    return {
        check: jest.fn(() => mockValidationChain),
        validationResult: jest.fn(() => ({
            isEmpty: jest.fn(() => true),
            array: jest.fn(() => [])
        })),
    }
})

describe('feedbackRouter unit tests', () => {
    let app, server, createdMockData

    beforeAll(async () => {
        app = express()
        app.use(express.json())
        app.use('/api/feedback', feedbackRouter)
        app.use(errorHandler)
        server = app.listen()

        createdMockData = {
            id: 30,
            info: 'Great app!',
            status: false,
            userId: 19,
            date: '2025-02-21',
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }
    })

    test('Create feedback with invalid data, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'сообщение не введено',
            feedbackController.create,
            request(app).post,
            '/api/feedback/',
            mockUserJwtToken,
            { info: '' }
        )
    })

    test('Create feedback by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/feedback/',
            feedbackController.create,
            '',
            { info: 'Great app!' }
        )
    })

    test('Create feedback by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/feedback/',
            feedbackController.create,
            'Bearer fakeToken',
            { info: 'Great app!' }
        )
    })

    test('Create feedback by user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).post,
            '/api/feedback/',
            feedbackController.create,
            'Пользователь не найден',
            mockFakeUserJwtToken,
            { info: 'Great app!' }
        )
    })

    test('Create feedback with unexpected error, should return 500', async () => {
        await checkRouteWithUnexpectedError(
            request(app).post,
            '/api/feedback/',
            feedbackController.create,
            mockUserJwtToken,
            { info: 'Great app!' }
        )
    })

    test('Create feedback with valid data, should return 201', async () => {
        feedbackController.create.mockImplementation((req, res) =>
            res.status(201).json({ feedback: createdMockData })
        )

        const response = await request(app)
            .post('/api/feedback/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Great app!' })

        expect(response.status).toBe(201)
        expect(response.body.feedback).toEqual(createdMockData)
        expect(feedbackController.create).toHaveBeenCalledTimes(1)
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => {
        if (server) {
            await new Promise((resolve) => server.close(resolve))
            server.unref()
        }
    })
})