const request = require('supertest')
const express = require('express')
const taskController = require('../../../controllers/taskController')
const errorHandler = require('../../../middleware/ErrorHandlingMiddleware')
const { mockUserJwtToken } = require('../integration/checkRouter')
const taskRouter = require('../../taskRouter')
const { checkRouteWithInvalidInfo, checkRouteWithoutToken, checkRouteWithInvalidToken } = require('./checkRouter')

jest.mock('../../../controllers/taskController', () => ({
    create: jest.fn(),
    update: jest.fn(),
    changeStatus: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
}))

jest.mock('../../../middleware/AuthMiddleware', () => {
    const ApiError = require('../../../error/ApiError')
    return jest.fn((req, res, next) => {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return next(ApiError.unauthorized('Пользователь не авторизован'))
        }
        req.user = { id: 19, email: 'user@example.com', role: 'USER' }
        next()
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

describe('taskRouter unit tests', () => {
    let app, server, mockTaskId, createdMockData, updatedMockData
    // updatedStatusMockData, mockData

    beforeAll(async () => {
        app = express()
        app.use(express.json())
        app.use('/api/task', taskRouter)
        app.use(errorHandler)
        server = app.listen()

        // mockData = {
        //     tasks: [
        //         {
        //             id: 28,
        //             info: "Set up the project structure",
        //             status: true,
        //             userId: 19,
        //             createdAt: "2025-01-26 13:48:44.315+03",
        //             updatedAt: "2025-01-26 13:48:44.315+03",
        //         },
        //         {
        //             id: 29,
        //             info: 'Write the first chapter of documentation',
        //             status: false,
        //             userId: 19,
        //             createdAt: "2025-01-26 13:48:44.315+03",
        //             updatedAt: "2025-01-26 13:48:44.315+03",
        //         }
        //     ],
        //     count: 2
        // }

        createdMockData = {
            id: 30,
            info: 'Write documentation',
            status: false,
            userId: 19,
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

        updatedMockData = { ...createdMockData, info: 'Add ui' }

        // updatedStatusMockData = { ...updatedMockData, status: true }
    })

    test('Create task with invalid data, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'задача не введена',
            taskController.create,
            request(app).post,
            '/api/task/',
            mockUserJwtToken,
            { info: '' }
        )
    })

    test('Create task by user which is not authorized, should return 401', async () => {
        await checkRouteWithoutToken(
            request(app).post,
            '/api/task/',
            taskController.create,
            { info: 'Write documentation' }
        )
    })

    test('Create task by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/task/',
            taskController.create,
            { info: 'Write documentation' }
        )
    })

    test('Create task with valid data, should return 201', async () => {
        taskController.create.mockImplementation((req, res) =>
            res.status(201).json({ task: createdMockData })
        )

        const response = await request(app)
            .post('/api/task/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Write documentation' })

        expect(response.status).toBe(201)
        expect(response.body.task).toEqual(createdMockData)
        expect(taskController.create).toHaveBeenCalledTimes(1)

        mockTaskId = response.body.task.id
    })

    test('Update task with invalid data, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'задача не введена',
            taskController.update,
            request(app).patch,
            `/api/task/${mockTaskId}`,
            mockUserJwtToken,
            { info: '' }
        )
    })

    test('Update task by user which is not authorized, should return 401', async () => {
        await checkRouteWithoutToken(
            request(app).patch,
            `/api/task/${mockTaskId}`,
            taskController.update,
            { info: 'Add ui' }
        )
    })

    test('Update task by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/task/${mockTaskId}`,
            taskController.update,
            { info: 'Add ui' }
        )
    })

    test('Update task with valid data, should return 200', async () => {
        taskController.update.mockImplementation((req, res) =>
            res.json({ task: updatedMockData })
        )

        const response = await request(app)
            .patch(`/api/task/${mockTaskId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Add ui' })

        expect(response.status).toBe(200)
        expect(response.body.task).toEqual(updatedMockData)
        expect(taskController.update).toHaveBeenCalledTimes(1)
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => {
        if (server) {
            await new Promise((resolve) => server.close(resolve))
            server.unref()
        }
    })
})