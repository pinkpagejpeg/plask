const request = require('supertest')
const express = require('express')
const goalController = require('../../../controllers/goalController')
const errorHandler = require('../../../middleware/ErrorHandlingMiddleware')
const goalRouter = require('../../goalRouter')
const { mockUserJwtToken, mockFakeUserJwtToken } = require('@mocks/jwtTokenMocks')
const { checkRouteWithInvalidInfo, checkRouteWithInvalidToken, checkRouteWithNonexistentData } = require('./checkRouter')

jest.mock('../../../controllers/goalController', () => ({
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    getOne: jest.fn(),
    getProgress: jest.fn(),
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

describe('goalRouter unit tests', () => {
    let app, server, mockGoalId,
        createdMockData, updatedMockData, mockData

    beforeAll(async () => {
        app = express()
        app.use(express.json())
        app.use('/api/goal', goalRouter)
        app.use(errorHandler)
        server = app.listen()

        mockData = {
            data: {
                goals: [
                    {
                        id: 18,
                        info: 'Complete the project',
                        userId: 19,
                        createdAt: "2025-01-26 13:48:44.315+03",
                        updatedAt: "2025-01-26 13:48:44.315+03",
                    },
                    {
                        id: 19,
                        info: 'Write documentation',
                        userId: 19,
                        createdAt: "2025-01-26 13:48:44.315+03",
                        updatedAt: "2025-01-26 13:48:44.315+03",
                    }
                ],
                count: 2
            }
        }

        createdMockData = {
            id: 20,
            info: 'Add tests',
            userId: 19,
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

        updatedMockData = { ...createdMockData, info: 'Add ui' }
    })

    test('Create goal with invalid data, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'цель не введена',
            goalController.create,
            request(app).post,
            '/api/goal/',
            mockUserJwtToken,
            { info: '' }
        )
    })

    test('Create goal by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/goal/',
            goalController.create,
            '',
            { info: 'Add tests' }
        )
    })

    test('Create goal by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/goal/',
            goalController.create,
            'Bearer fakeToken',
            { info: 'Add tests' }
        )
    })

    test('Create goal by user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).post,
            '/api/goal/',
            goalController.create,
            'Пользователь не найден',
            mockFakeUserJwtToken,
            { info: 'Add tests' }
        )
    })

    test('Create goal with valid data, should return 201', async () => {
        goalController.create.mockImplementation((req, res) =>
            res.status(201).json({ goal: createdMockData })
        )

        const response = await request(app)
            .post('/api/goal/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Add tests' })

        expect(response.status).toBe(201)
        expect(response.body.goal).toEqual(createdMockData)
        expect(goalController.create).toHaveBeenCalledTimes(1)

        mockGoalId = response.body.goal.id
    })

    test('Get goal progress by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/goal/${mockGoalId}/progress`,
            goalController.getProgress,
            ''
        )
    })

    test('Get goal progress by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/goal/${mockGoalId}/progress`,
            goalController.getProgress,
            'Bearer fakeToken',
        )
    })

    test('Get goal progress which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).get,
            `/api/goal/0/progress`,
            goalController.getProgress,
            'Цель не найдена',
            mockUserJwtToken,
        )
    })

    test('Get goal progress with valid data, should return 200', async () => {
        goalController.getProgress.mockImplementation((req, res) =>
            res.json(0)
        )

        const response = await request(app)
            .get(`/api/goal/${mockGoalId}/progress`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(0)
        expect(goalController.getProgress).toHaveBeenCalledTimes(1)
    })

    test('Update goal with invalid data, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'цель не введена',
            goalController.update,
            request(app).patch,
            `/api/goal/${mockGoalId}`,
            mockUserJwtToken,
            { info: '' }
        )
    })

    test('Update goal by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/goal/${mockGoalId}`,
            goalController.update,
            '',
            { info: 'Add ui' }
        )
    })

    test('Update goal by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/goal/${mockGoalId}`,
            goalController.update,
            'Bearer fakeToken',
            { info: 'Add ui' }
        )
    })

    test('Update goal which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            `/api/goal/0`,
            goalController.update,
            'Цель не найдена',
            mockUserJwtToken,
            { info: 'Add ui' }
        )
    })

    test('Update goal with valid data, should return 200', async () => {
        goalController.update.mockImplementation((req, res) =>
            res.json({ goal: updatedMockData })
        )

        const response = await request(app)
            .patch(`/api/goal/${mockGoalId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Add ui' })

        expect(response.status).toBe(200)
        expect(response.body.goal).toEqual(updatedMockData)
        expect(goalController.update).toHaveBeenCalledTimes(1)
    })

    test('Get goal by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/goal/${mockGoalId}`,
            goalController.getOne,
            ''
        )
    })

    test('Get goal by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/goal/${mockGoalId}`,
            goalController.getOne,
            'Bearer fakeToken',
        )
    })

    test('Get goal which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).get,
            `/api/goal/0`,
            goalController.getOne,
            'Цель не найдена',
            mockFakeUserJwtToken,
        )
    })

    test('Get goal with valid data, should return 200', async () => {
        goalController.getOne.mockImplementation((req, res) =>
            res.json({goal: updatedMockData})
        )

        const response = await request(app)
            .get(`/api/goal/${mockGoalId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body.goal).toEqual(updatedMockData)
        expect(goalController.getOne).toHaveBeenCalledTimes(1)
    })

    test('Get list of goals by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/goal/user`,
            goalController.getAll,
            ''
        )
    })

    test('Get list of goals by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/goal/user`,
            goalController.getAll,
            'Bearer fakeToken',
        )
    })

    test('Get list of goals by user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).get,
            `/api/goal/user`,
            goalController.getAll,
            'Пользователь не найден',
            mockFakeUserJwtToken,
        )
    })

    test('Get list of goals with valid data, should return 200', async () => {
        goalController.getAll.mockImplementation((req, res) =>
            res.json(mockData)
        )

        const response = await request(app)
            .get(`/api/goal/user`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockData)
        expect(goalController.getAll).toHaveBeenCalledTimes(1)
    })

    test('Delete goal by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/goal/${mockGoalId}`,
            goalController.delete,
            ''
        )
    })

    test('Delete goal by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/goal/${mockGoalId}`,
            goalController.delete,
            'Bearer fakeToken',
        )
    })

    test('Delete goal which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).delete,
            `/api/goal/0`,
            goalController.delete,
            'Цель не найдена',
            mockUserJwtToken,
        )
    })

    test('Delete goal with valid data, should return 200', async () => {
        goalController.delete.mockImplementation((req, res) =>
            res.json({ deletedGoalId: mockGoalId })
        )

        const response = await request(app)
            .delete(`/api/goal/${mockGoalId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body.deletedGoalId).toEqual(mockGoalId)
        expect(goalController.delete).toHaveBeenCalledTimes(1)
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => {
        if (server) {
            await new Promise((resolve) => server.close(resolve))
            server.unref()
        }
    })
})