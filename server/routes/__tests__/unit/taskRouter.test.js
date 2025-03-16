const request = require('supertest')
const express = require('express')
const taskController = require('../../../controllers/taskController')
const errorHandler = require('../../../middleware/ErrorHandlingMiddleware')
const taskRouter = require('../../taskRouter')
const { mockUserJwtToken, mockFakeUserJwtToken } = require('@mocks/jwtTokenMocks')
const { checkRouteWithInvalidInfo, checkRouteWithInvalidToken, checkRouteWithNonexistentData } = require('./checkRouter')

jest.mock('../../../controllers/taskController', () => ({
    create: jest.fn(),
    update: jest.fn(),
    changeStatus: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
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

describe('taskRouter unit tests', () => {
    let app, server, mockTaskId,
        createdMockData, updatedMockData, updatedStatusMockData, mockData

    beforeAll(async () => {
        app = express()
        app.use(express.json())
        app.use('/api/task', taskRouter)
        app.use(errorHandler)
        server = app.listen()

        mockData = {
            tasks: [
                {
                    id: 28,
                    info: "Set up the project structure",
                    status: true,
                    userId: 19,
                    createdAt: "2025-01-26 13:48:44.315+03",
                    updatedAt: "2025-01-26 13:48:44.315+03",
                },
                {
                    id: 29,
                    info: 'Write the first chapter of documentation',
                    status: false,
                    userId: 19,
                    createdAt: "2025-01-26 13:48:44.315+03",
                    updatedAt: "2025-01-26 13:48:44.315+03",
                }
            ],
            count: 2
        }

        createdMockData = {
            id: 30,
            info: 'Write documentation',
            status: false,
            userId: 19,
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

        updatedMockData = { ...createdMockData, info: 'Add ui' }
        updatedStatusMockData = { ...updatedMockData, status: true }
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
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/task/',
            taskController.create,
            '',
            { info: 'Write documentation' }
        )
    })

    test('Create task by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/task/',
            taskController.create,
            'Bearer fakeToken',
            { info: 'Write documentation' }
        )
    })

    test('Create task by user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).post,
            '/api/task/',
            taskController.create,
            'Пользователь не найден',
            mockFakeUserJwtToken,
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
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/task/${mockTaskId}`,
            taskController.update,
            '',
            { info: 'Add ui' }
        )
    })

    test('Update task by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/task/${mockTaskId}`,
            taskController.update,
            'Bearer fakeToken',
            { info: 'Add ui' }
        )
    })

    test('Update task which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            `/api/task/0`,
            taskController.update,
            'Задача не найдена',
            mockUserJwtToken,
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

    test('Update task status with invalid data, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'отсутствует статус задачи',
            taskController.changeStatus,
            request(app).patch,
            `/api/task/${mockTaskId}/status`,
            mockUserJwtToken,
            {}
        )
    })

    test('Update task status by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/task/${mockTaskId}/status`,
            taskController.changeStatus,
            '',
            { status: true }
        )
    })

    test('Update task status by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/task/${mockTaskId}/status`,
            taskController.changeStatus,
            'Bearer fakeToken',
            { status: true }
        )
    })

    test('Update task status which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            `/api/task/0/status`,
            taskController.changeStatus,
            'Задача не найдена',
            mockUserJwtToken,
            { status: true }
        )
    })

    test('Update task status with valid data, should return 200', async () => {
        taskController.changeStatus.mockImplementation((req, res) =>
            res.json({ task: updatedStatusMockData })
        )

        const response = await request(app)
            .patch(`/api/task/${mockTaskId}/status`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ status: true })

        expect(response.status).toBe(200)
        expect(response.body.task).toEqual(updatedStatusMockData)
        expect(taskController.changeStatus).toHaveBeenCalledTimes(1)
    })

    test('Get tasks by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/task/user`,
            taskController.getAll,
            ''
        )
    })

    test('Get tasks by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/task/user`,
            taskController.getAll,
            'Bearer fakeToken',
        )
    })

    test('Get tasks by user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).get,
            `/api/task/user`,
            taskController.getAll,
            'Пользователь не найден',
            mockFakeUserJwtToken,
        )
    })

    test('Get tasks with valid data, should return 200', async () => {
        taskController.getAll.mockImplementation((req, res) =>
            res.json(mockData)
        )

        const response = await request(app)
            .get(`/api/task/user`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockData)
        expect(taskController.getAll).toHaveBeenCalledTimes(1)
    })

    test('Delete task by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/task/${mockTaskId}`,
            taskController.delete,
            ''
        )
    })

    test('Delete task by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/task/${mockTaskId}`,
            taskController.delete,
            'Bearer fakeToken'
        )
    })

    test('Delete task which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).delete,
            `/api/task/0`,
            taskController.delete,
            'Задача не найдена',
            mockUserJwtToken,
        )
    })

    test('Delete task with valid data, should return 200', async () => {
        taskController.delete.mockImplementation((req, res) =>
            res.json({ deletedTaskId: mockTaskId })
        )

        const response = await request(app)
            .delete(`/api/task/${mockTaskId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body.deletedTaskId).toEqual(mockTaskId)
        expect(taskController.delete).toHaveBeenCalledTimes(1)
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => {
        if (server) {
            await new Promise((resolve) => server.close(resolve))
            server.unref()
        }
    })
})