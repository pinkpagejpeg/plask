const { User, Task } = require("../../models/models")
const ApiError = require('../../error/ApiError')
const { validationResult } = require('express-validator')
const taskController = require('../taskController')

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
    Task: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn()
    }
}))

describe('taskController unit tests', () => {
    let req, res, next, mockUser, mockTask, mockTasks

    beforeEach(() => {
        req = {
            user: { id: 1, email: 'user@example.com', role: 'USER' },
            body: {},
            params: { taskId: 1 }
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

        mockTask = {
            id: 1,
            info: 'Task tests',
            status: false,
            userId: 1,
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

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

    test('Create task with validation error, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'задача не введена' }]
        })

        req.body.info = ''
        await taskController.create(req, res, next)

        expect(ApiError.badRequest)
            .toHaveBeenCalledWith('Введены некорректные данные: задача не введена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: задача не введена'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create task by user which does not exist, should return 404', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockResolvedValue(null)

        req.body.info = 'Task tests'
        await taskController.create(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Пользователь не найден')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь не найден'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create task with unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockRejectedValue(new Error('Unexpected error'))

        req.body.info = 'Task tests'
        await taskController.create(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.status).not.toHaveBeenCalled()
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Create task with valid data, should return 201', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        User.findByPk.mockResolvedValue(mockUser)
        Task.create.mockResolvedValue(mockTask)

        req.body.info = 'Task tests'
        await taskController.create(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ task: mockTask })
    })

    test('Update task with validation error, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'задача не введена' }]
        })

        req.body.info = ''
        await taskController.update(req, res, next)

        expect(ApiError.badRequest)
            .toHaveBeenCalledWith('Введены некорректные данные: задача не введена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: задача не введена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update task by user which does not exist, should return 404', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Task.findByPk.mockResolvedValue(null)

        req.body.info = 'Updated task info'
        await taskController.update(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Задача не найдена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Задача не найдена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update task with unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Task.findByPk.mockRejectedValue(new Error('Unexpected error'))

        req.body.info = 'Updated task info'
        await taskController.update(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update task with valid data, should return 200', async () => {
        const updatedTask = {
            ...mockTask,
            update: jest.fn().mockResolvedValue({ ...mockTask, info: 'Updated task info' }),
            toJSON: jest.fn().mockReturnValue({ ...mockTask, info: 'Updated task info' })
        }
        validationResult.mockReturnValue({ isEmpty: () => true })
        Task.findByPk.mockResolvedValue(updatedTask)

        req.body.info = 'Updated task info'
        await taskController.update(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ task: updatedTask })

        mockTask.info = 'Updated task info'
    })

    test('Update task status with validation error, should return 400', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'отсутствует статус задачи' }]
        })

        await taskController.changeStatus(req, res, next)

        expect(ApiError.badRequest)
            .toHaveBeenCalledWith('Введены некорректные данные: отсутствует статус задачи')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Введены некорректные данные: отсутствует статус задачи'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update task status by user which does not exist, should return 404', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Task.findByPk.mockResolvedValue(null)

        req.body.status = true
        await taskController.changeStatus(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Задача не найдена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Задача не найдена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update task status with unexpected error, should return 500', async () => {
        validationResult.mockReturnValue({ isEmpty: () => true })
        Task.findByPk.mockRejectedValue(new Error('Unexpected error'))

        req.body.status = true
        await taskController.changeStatus(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Update task status with valid data, should return 200', async () => {
        const updatedTask = {
            ...mockTask,
            update: jest.fn().mockResolvedValue({ ...mockTask, status: true }),
            toJSON: jest.fn().mockReturnValue({ ...mockTask, status: true })
        }
        validationResult.mockReturnValue({ isEmpty: () => true })
        Task.findByPk.mockResolvedValue(updatedTask)

        req.body.status = true
        await taskController.changeStatus(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ task: updatedTask })

        mockTask.status = true
    })

    test('Get tasks by user which does not exist, should return 404', async () => {
        User.findByPk.mockResolvedValue(null)

        await taskController.getAll(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Пользователь не найден')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Пользователь не найден'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get tasks with unexpected error, should return 500', async () => {
        User.findByPk.mockRejectedValue(new Error('Unexpected error'))

        await taskController.getAll(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Get tasks with valid data, should return 200', async () => {
        User.findByPk.mockResolvedValue(mockUser)
        Task.findAll.mockResolvedValue(mockTasks)

        await taskController.getAll(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ tasks: mockTasks, count: mockTasks.length })
    })

    test('Delete task which does not exist, should return 404', async () => {
        Task.findByPk.mockResolvedValue(null)

        await taskController.delete(req, res, next)

        expect(ApiError.notFound).toHaveBeenCalledWith('Задача не найдена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Задача не найдена'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Delete task with unexpected error, should return 500', async () => {
        Task.findByPk.mockRejectedValue(new Error('Unexpected error'))

        await taskController.delete(req, res, next)

        expect(ApiError.internal).toHaveBeenCalledWith('Unexpected error')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unexpected error'
        }))
        expect(res.json).not.toHaveBeenCalled()
    })

    test('Delete task with valid data, should return 200', async () => {
        const deletedTask = {
            ...mockTask,
            destroy: jest.fn().mockResolvedValue({ mockTask }),
        }
        Task.findByPk.mockResolvedValue(deletedTask)

        await taskController.delete(req, res, next)

        expect(ApiError.internal).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledWith({ deletedTaskId: deletedTask.id })
    })

    afterEach(() => jest.clearAllMocks())
})
