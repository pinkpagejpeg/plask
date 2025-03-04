const request = require('supertest')
const express = require('express')
const taskController = require('../../../controllers/taskController')
const ApiError = require('../../../error/ApiError')
const formatErrorMessages = require('../../../error/formatErrorMessages')
const AuthMiddleware = require('../../../middleware/AuthMiddleware')
const errorHandler = require('../../../middleware/ErrorHandlingMiddleware')
const { mockUserJwtToken } = require('../integration/checkRouter')
const { validationResult } = require('express-validator')
const taskRouter = require('../../taskRouter')

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
    let app, server, mockData, createdMockData, updatedMockData, updatedStatusMockData

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

    test('Create task with valid data, should return 201', async () => {
        taskController.create.mockImplementation((req, res, next) =>
            res.status(201).json({ task: createdMockData })
        )

        const response = await request(app)
            .post('/api/task/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Write documentation' })

        expect(response.status).toBe(201)
        expect(response.body.task).toEqual(createdMockData)
        expect(taskController.create).toHaveBeenCalledTimes(1)
    })

    test('Create task with invalid data, should return 400', async () => {
        validationResult.mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => false),
            array: jest.fn(() => [{ msg: 'задача не введена' }])
        }))

        taskController.create.mockImplementation((req, res, next) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(
                    `Введены некорректные данные: ${formatErrorMessages(errors.array().map(error => error.msg))}`
                ))
            }
            res.status(201).json({ task: createdMockData })
        })

        const response = await request(app)
            .post('/api/task/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: '' })

        expect(response.status).toBe(400)
        expect(response.body.message).toContain('Введены некорректные данные: задача не введена')
        expect(taskController.create).toHaveBeenCalledTimes(1)
    })

    test('Create task by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .post('/api/task/')
            .set('Authorization', ``)
            .send({ info: 'Write documentation' })

        expect(response.status).toBe(401)
        expect(response.body.message).toContain('Пользователь не авторизован')
        expect(taskController.create).not.toHaveBeenCalled()
    })

    test('Create task by user with fake token, should return 401', async () => {
        AuthMiddleware.mockImplementationOnce((req, res, next) =>
            next(ApiError.unauthorized('Пользователь не авторизован'))
        )

        const response = await request(app)
            .post('/api/task/')
            .set('Authorization', `Bearer fakeToken`)
            .send({ info: 'Write documentation' })

        expect(response.status).toBe(401)
        expect(response.body.message).toContain('Пользователь не авторизован')
        expect(taskController.create).not.toHaveBeenCalled()
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => {
        if (server) {
            await new Promise((resolve) => server.close(resolve))
            server.unref()
        }
    })
})