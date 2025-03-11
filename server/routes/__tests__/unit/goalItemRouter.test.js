const request = require('supertest')
const express = require('express')
const goalItemController = require('../../../controllers/goalItemController')
const errorHandler = require('../../../middleware/ErrorHandlingMiddleware')
const goalItemRouter = require('../../goalItemRouter')
const { mockUserJwtToken } = require('@mocks/jwtTokenMocks')
const { checkRouteWithInvalidInfo, checkRouteWithInvalidToken, checkRouteWithNonexistentData } = require('./checkRouter')

jest.mock('../../../controllers/goalItemController', () => ({
    createItem: jest.fn(),
    updateItem: jest.fn(),
    changeItemStatus: jest.fn(),
    deleteItem: jest.fn(),
    getAllItems: jest.fn(),
}))

jest.mock('../../../middleware/AuthMiddleware', () => {
    const ApiError = require('../../../error/ApiError')
    const jwt = require('jsonwebtoken')
    return jest.fn((req, res, next) => {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return next(ApiError.unauthorized('Пользователь не авторизован'))
        }
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decoded
            next()
        }
        catch {
            return next(ApiError.unauthorized('Пользователь не авторизован'))
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

describe('goalItemRouter unit tests', () => {
    let app, server, mockGoalItemId,
        createdMockData, updatedMockData, updatedStatusMockData, mockData

    beforeAll(async () => {
        app = express()
        app.use(express.json())
        app.use('/api/goal', goalItemRouter)
        app.use(errorHandler)
        server = app.listen()

        mockData = {
            data: {
                goalItems: [
                    {
                        id: 14,
                        info: 'Complete the project setup',
                        status: true,
                        goalId: 18,
                        createdAt: "2025-01-26 13:48:44.315+03",
                        updatedAt: "2025-01-26 13:48:44.315+03",
                    },
                    {
                        id: 15,
                        info: 'Write the initial draft of documentation',
                        status: false,
                        goalId: 19,
                        createdAt: "2025-01-26 13:48:44.315+03",
                        updatedAt: "2025-01-26 13:48:44.315+03",
                    }
                ],
                count: 2
            }
        }

        createdMockData = {
            id: 16,
            info: 'Add unit test',
            status: false,
            goalId: 19,
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

        updatedMockData = { ...createdMockData, info: 'Add unit and screenshot tests' }
        updatedStatusMockData = { ...updatedMockData, status: true }
    })

    test('Create subgoal with invalid data, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'подцель не введена',
            goalItemController.createItem,
            request(app).post,
            '/api/goal/1/items',
            mockUserJwtToken,
            { info: '' }
        )
    })

    test('Create subgoal by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/goal/1/items',
            goalItemController.createItem,
            '',
            { info: 'Add unit test' }
        )
    })

    test('Create subgoal by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/goal/1/items',
            goalItemController.createItem,
            'Bearer fakeToken',
            { info: 'Add unit test' }
        )
    })

    test('Create subgoal for goal which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).post,
            '/api/goal/0/items',
            goalItemController.createItem,
            'Цель не найдена',
            mockUserJwtToken,
            { info: 'Add unit test' }
        )
    })

    test('Create subgoal with valid data, should return 201', async () => {
        goalItemController.createItem.mockImplementation((req, res) =>
            res.status(201).json({ goalItem: createdMockData })
        )

        const response = await request(app)
            .post('/api/goal/1/items')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Add unit test' })

        expect(response.status).toBe(201)
        expect(response.body.goalItem).toEqual(createdMockData)
        expect(goalItemController.createItem).toHaveBeenCalledTimes(1)

        mockGoalItemId = response.body.goalItem.id
    })

    test('Update subgoal with invalid data, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'подцель не введена',
            goalItemController.updateItem,
            request(app).patch,
            `/api/goal/1/items/${mockGoalItemId}`,
            mockUserJwtToken,
            { info: '' }
        )
    })

    test('Update subgoal by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/goal/1/items/${mockGoalItemId}`,
            goalItemController.updateItem,
            '',
            { info: 'Add unit and screenshot tests' }
        )
    })

    test('Update subgoal by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/goal/1/items/${mockGoalItemId}`,
            goalItemController.updateItem,
            'Bearer fakeToken',
            { info: 'Add unit and screenshot tests' }
        )
    })

    test('Update subgoal which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            `/api/goal/0/items/${mockGoalItemId}`,
            goalItemController.updateItem,
            'Задача не найдена',
            mockUserJwtToken,
            { info: 'Add unit and screenshot tests' }
        )
    })

    test('Update subgoal with valid data, should return 200', async () => {
        goalItemController.updateItem.mockImplementation((req, res) =>
            res.json({ goalItem: updatedMockData })
        )

        const response = await request(app)
            .patch(`/api/goal/1/items/${mockGoalItemId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Add unit and screenshot tests' })

        expect(response.status).toBe(200)
        expect(response.body.goalItem).toEqual(updatedMockData)
        expect(goalItemController.updateItem).toHaveBeenCalledTimes(1)
    })

    test('Update subgoal status with invalid data, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'отсутствует статус подцели',
            goalItemController.changeItemStatus,
            request(app).patch,
            `/api/goal/1/items/${mockGoalItemId}/status`,
            mockUserJwtToken,
            {}
        )
    })

    test('Update subgoal status by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/goal/1/items/${mockGoalItemId}/status`,
            goalItemController.changeItemStatus,
            '',
            { status: true }
        )
    })

    test('Update subgoal status by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/goal/1/items/${mockGoalItemId}/status`,
            goalItemController.changeItemStatus,
            'Bearer fakeToken',
            { status: true }
        )
    })

    test('Update subgoal status which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            `/api/goal/0/items/${mockGoalItemId}/status`,
            goalItemController.changeItemStatus,
            'Подцель не найдена',
            mockUserJwtToken,
            { status: true }
        )
    })

    test('Update subgoal status with valid data, should return 200', async () => {
        goalItemController.changeItemStatus.mockImplementation((req, res) =>
            res.json({ goalItem: updatedStatusMockData })
        )

        const response = await request(app)
            .patch(`/api/goal/1/items/${mockGoalItemId}/status`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ status: true })

        expect(response.status).toBe(200)
        expect(response.body.goalItem).toEqual(updatedStatusMockData)
        expect(goalItemController.changeItemStatus).toHaveBeenCalledTimes(1)
    })

    test('Get list of subgoals by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/goal/1/items`,
            goalItemController.getAllItems,
            ''
        )
    })

    test('Get list of subgoals by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/goal/1/items`,
            goalItemController.getAllItems,
            'Bearer fakeToken',
        )
    })

    test('Get list of subgoals for goal which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).get,
            `/api/goal/0/items`,
            goalItemController.getAllItems,
            'Цель не найдена',
            mockUserJwtToken,
        )
    })

    test('Get list of subgoals with valid data, should return 200', async () => {
        goalItemController.getAllItems.mockImplementation((req, res) =>
            res.json(mockData)
        )

        const response = await request(app)
            .get(`/api/goal/1/items`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockData)
        expect(goalItemController.getAllItems).toHaveBeenCalledTimes(1)
    })

    test('Delete subgoal by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/goal/1/items/${mockGoalItemId}`,
            goalItemController.deleteItem,
            ''
        )
    })

    test('Delete subgoal by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/goal/1/items/${mockGoalItemId}`,
            goalItemController.deleteItem,
            'Bearer fakeToken',
        )
    })

    test('Delete subgoal which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).delete,
            `/api/goal/0/items/${mockGoalItemId}`,
            goalItemController.deleteItem,
            'Подцель не найдена',
            mockUserJwtToken,
        )
    })

    test('Delete subgoal with valid data, should return 200', async () => {
        goalItemController.deleteItem.mockImplementation((req, res) =>
            res.json({ deletedGoalItemId: mockGoalItemId })
        )

        const response = await request(app)
            .delete(`/api/goal/1/items/${mockGoalItemId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body.deletedGoalItemId).toEqual(mockGoalItemId)
        expect(goalItemController.deleteItem).toHaveBeenCalledTimes(1)
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => {
        if (server) {
            await new Promise((resolve) => server.close(resolve))
            server.unref()
        }
    })
})