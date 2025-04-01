const request = require('supertest')
const express = require('express')
const adminController = require('../../../controllers/adminController')
const errorHandler = require('../../../middleware/ErrorHandlingMiddleware')
const adminRouter = require('../../adminRouter')
const ApiError = require('../../../error/ApiError')
const { mockAdminJwtToken } = require('@mocks/jwtTokenMocks')
const {
    checkRouteWithInvalidInfo, checkRouteWithInvalidToken,
    checkRouteWithoutAdminRights, checkRouteWithNonexistentData,
    checkRouteWithAnotherCandidate
} = require('./checkRouter')

jest.mock('../../../controllers/adminController', () => ({
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getAllUsers: jest.fn(),
    changeStatus: jest.fn(),
    getAllFeedbacks: jest.fn(),
}))

jest.mock('../../../middleware/CheckRoleMiddleware', () => {
    const ApiError = require('../../../error/ApiError')
    const jwt = require('jsonwebtoken')

    return jest.fn((role) => {
        return jest.fn((req, res, next) => {
            const token = req.headers.authorization?.split(' ')[1]
            if (!token) {
                throw ApiError.unauthorized('Пользователь не авторизован')
            }

            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY)
                req.user = decoded
                if (decoded.role !== role) {
                    return next(ApiError.forbidden('Пользователь не обладает правами администратора'))
                }

                next()
            } catch (error) {
                if (error instanceof jwt.JsonWebTokenError) {
                    return next(ApiError.unauthorized('Неверный или просроченный токен'))
                }
        
                next(error)
            }
        })
    })
})

jest.mock('express-validator', () => {
    const mockValidationChain = jest.fn((req, res, next) => next())

    const chainMethods = ['notEmpty', 'exists', 'isLength']
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

describe('adminRouter unit tests', () => {
    let app, server, mockUserId, mockUserPassword, createdMockData, updatedEmailMockData,
        updatedPasswordMockData, updatedRoleMockData, mockUsersData, mockFeedbacksData, updatedStatusMockData

    beforeAll(async () => {
        app = express()
        app.use(express.json())
        app.use('/api/admin', adminRouter)
        app.use(errorHandler)
        server = app.listen()

        mockUsersData = {
            data: {
                users: [
                    {
                        id: 22,
                        email: 'user@example.com',
                        password: 'hashedPassword123',
                        role: 'USER',
                        img: 'user_default_image.jpg',
                        createdAt: "2025-01-26 13:48:44.315+03",
                        updatedAt: "2025-01-26 13:48:44.315+03",
                    },
                    {
                        id: 23,
                        email: 'admin1@example.com',
                        password: 'hashedAdminPassword123',
                        role: 'ADMIN',
                        img: 'user_default_image.jpg',
                        createdAt: "2025-01-26 13:48:44.315+03",
                        updatedAt: "2025-01-26 13:48:44.315+03",
                    }
                ],
                count: 2
            }
        }

        createdMockData = {
            id: 23,
            email: 'admin1@example.com',
            password: 'hashedAdminPassword123',
            role: 'ADMIN',
            img: 'user_default_image.jpg',
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

        updatedRoleMockData = {
            id: 23,
            email: 'admin1@example.com',
            password: 'hashedAdminPassword123',
            role: 'USER',
            img: 'user_default_image.jpg',
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }
        updatedPasswordMockData = { ...updatedRoleMockData, password: '123456789' }
        updatedEmailMockData = { ...updatedPasswordMockData, email: 'admin11@example.com' }

        mockFeedbacksData = {
            data: {
                feedbacks: [
                    {
                        id: 2,
                        info: "Great project, looking forward to the next version!",
                        date: "2025-01-26",
                        status: true,
                        userId: 18,
                        createdAt: "2025-01-26 13:48:44.241+03",
                        updatedAt: "2025-01-26 13:48:44.241+03",
                    },
                    {
                        id: 3,
                        info: "The documentation is a bit lacking, could use more detail.",
                        date: "2025-01-26",
                        status: false,
                        userId: 18,
                        createdAt: "2025-01-26 13:48:44.241+03",
                        updatedAt: "2025-01-26 13:48:44.241+03",
                    }
                ],
                count: 2
            }
        }

        updatedStatusMockData = { ...mockFeedbacksData.data.feedbacks[1], status: true }
    })

    test('Create user with empty email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'email пользователя не заполнен',
            adminController.create,
            request(app).post,
            '/api/admin/users',
            mockAdminJwtToken,
            { email: '', password: '12345678', role: 'ADMIN' },
        )
    })

    test('Create user with empty role, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'роль пользователя не заполнена',
            adminController.create,
            request(app).post,
            '/api/admin/users',
            mockAdminJwtToken,
            { email: 'admin1@example.com', password: '12345678', role: '' },
        )
    })

    test('Create user with invalid password, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'длина пароля должна составлять от 6 до 12 символов',
            adminController.create,
            request(app).post,
            '/api/admin/users',
            mockAdminJwtToken,
            { email: 'admin1@example.com', password: '12345', role: 'ADMIN' },
        )
    })

    test('Create user with invalid password, role and email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'email пользователя не заполнен, роль пользователя не заполнена и длина пароля должна составлять от 6 до 12 символов',
            adminController.create,
            request(app).post,
            '/api/admin/users',
            mockAdminJwtToken,
            { email: '', password: '12345', role: '' },
        )
    })

    test('Create user by admin which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/admin/users',
            adminController.create,
            '',
            { email: 'admin1@example.com', password: '12345678', role: 'ADMIN' }
        )
    })

    test('Create user by admin with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/admin/users',
            adminController.create,
            'Bearer fakeToken',
            { email: 'admin1@example.com', password: '12345678', role: 'ADMIN' }
        )
    })

    test('Create user by admin which is not admin, should return 403', async () => {
        await checkRouteWithoutAdminRights(
            request(app).post,
            '/api/admin/users',
            adminController.create,
            { email: 'admin1@example.com', password: '12345678', role: 'ADMIN' }
        )
    })

    test('Create user with valid data, should return 201', async () => {
        adminController.create.mockImplementation((req, res) =>
            res.status(201).json({ user: createdMockData })
        )

        const response = await request(app)
            .post('/api/admin/users')
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ email: 'admin1@example.com', password: '12345678', role: 'ADMIN' })

        expect(response.status).toBe(201)
        expect(response.body.user).toEqual(createdMockData)
        expect(adminController.create).toHaveBeenCalledTimes(1)

        expect(response.body.user.email).toBe('admin1@example.com')
        expect(response.body.user.role).toBe('ADMIN')
        expect(response.body.user).toHaveProperty('id')
        expect(response.body.user).toHaveProperty('img')
        expect(response.body.user).toHaveProperty('password')

        mockUserId = response.body.user.id
    })

    test('Create user with another candidate, should return 400', async () => {
        await checkRouteWithAnotherCandidate(
            'Пользователь с таким именем уже существует',
            adminController.create,
            request(app).post,
            '/api/admin/users',
            mockAdminJwtToken,
            { email: 'admin1@example.com', password: '12345678', role: 'ADMIN' },
        )
    })

    test('Get users by admin which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/admin/users',
            adminController.getAllUsers,
            ''
        )
    })

    test('Get users by admin with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/admin/users',
            adminController.getAllUsers,
            'Bearer fakeToken'
        )
    })

    test('Get users by admin which is not admin, should return 403', async () => {
        await checkRouteWithoutAdminRights(
            request(app).get,
            '/api/admin/users',
            adminController.getAllUsers,
        )
    })

    test('Get users with valid data, should return 200', async () => {
        adminController.getAllUsers.mockImplementation((req, res) =>
            res.json(mockUsersData)
        )

        const response = await request(app)
            .get('/api/admin/users')
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockUsersData)
        expect(adminController.getAllUsers).toHaveBeenCalledTimes(1)
    })

    test('Update user with empty email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'email пользователя не заполнен',
            adminController.update,
            request(app).patch,
            `/api/admin/users/${mockUserId}`,
            mockAdminJwtToken,
            { email: '', password: '', role: 'ADMIN' },
        )
    })

    test('Update user with empty role, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'роль пользователя не заполнена',
            adminController.update,
            request(app).patch,
            `/api/admin/users/${mockUserId}`,
            mockAdminJwtToken,
            { email: 'admin1@example.com', password: '', role: '' },
        )
    })

    test('Update user with empty email and role, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'email пользователя не заполнен и роль пользователя не заполнена',
            adminController.update,
            request(app).patch,
            `/api/admin/users/${mockUserId}`,
            mockAdminJwtToken,
            { email: '', password: '', role: '' }
        )
    })

    test('Update user with invalid password, should return 400', async () => {
        adminController.update.mockImplementationOnce((req, res, next) => {
            const { password } = req.body
            if (password.length < 6 || password.length > 12) {
                return next(ApiError.badRequest('Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов'))
            }
            res.status(200).json('Запрос успешно выполнен')
        })

        const response = await request(app)
            .patch(`/api/admin/users/${mockUserId}`)
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ email: 'admin1@example.com', password: '12345', role: 'USER' })

        expect(response.status).toBe(400)
        expect(response.body.message).toContain('Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов')
        expect(adminController.update).toHaveBeenCalledTimes(1)
    })

    test('Update user by admin which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/admin/users/${mockUserId}`,
            adminController.update,
            '',
            { email: 'admin1@example.com', password: '123456789', role: 'ADMIN' }
        )
    })

    test('Update user by admin with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/admin/users/${mockUserId}`,
            adminController.update,
            'Bearer fakeToken',
            { email: 'admin1@example.com', password: '123456789', role: 'ADMIN' }
        )
    })

    test('Update user by admin which is not admin, should return 403', async () => {
        await checkRouteWithoutAdminRights(
            request(app).patch,
            `/api/admin/users/${mockUserId}`,
            adminController.update,
            { email: 'admin1@example.com', password: '123456789', role: 'ADMIN' }
        )
    })

    test('Update user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            `/api/admin/users/0`,
            adminController.update,
            'Пользователь не найден',
            mockAdminJwtToken,
            { email: 'admin1@example.com', password: '123456789', role: 'ADMIN' }
        )
    })

    test('Update user role with valid data, should return 200', async () => {
        adminController.update.mockImplementation((req, res) =>
            res.json({ user: updatedRoleMockData })
        )

        const response = await request(app)
            .patch(`/api/admin/users/${mockUserId}`)
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ email: 'admin1@example.com', password: '', role: 'USER' })

        expect(response.status).toBe(200)
        expect(response.body.user).toEqual(updatedRoleMockData)
        expect(adminController.update).toHaveBeenCalledTimes(1)

        mockUserPassword = response.body.user.password
    })

    test('Update user password with valid data, should return 200', async () => {
        adminController.update.mockImplementation((req, res) =>
            res.json({ user: updatedPasswordMockData })
        )

        const response = await request(app)
            .patch(`/api/admin/users/${mockUserId}`)
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ email: 'admin1@example.com', password: '123456789', role: 'USER' })

        expect(response.status).toBe(200)
        expect(response.body.user).toEqual(updatedPasswordMockData)
        expect(response.body.user.password).not.toBe(mockUserPassword)
        expect(adminController.update).toHaveBeenCalledTimes(1)
    })

    test('Update user email with valid data, should return 200', async () => {
        adminController.update.mockImplementation((req, res) =>
            res.json({ user: updatedEmailMockData })
        )

        const response = await request(app)
            .patch(`/api/admin/users/${mockUserId}`)
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ email: 'admin11@example.com', password: '', role: 'USER' })

        expect(response.status).toBe(200)
        expect(response.body.user).toEqual(updatedEmailMockData)
        expect(adminController.update).toHaveBeenCalledTimes(1)
    })

    test('Update user with another candidate, should return 400', async () => {
        await checkRouteWithAnotherCandidate(
            'Пользователь с таким именем уже существует',
            adminController.update,
            request(app).patch,
            `/api/admin/users/${mockUserId}`,
            mockAdminJwtToken,
            { email: 'admin@example.com', password: '', role: 'USER' },
        )
    })

    test('Delete user by admin which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/admin/users/${mockUserId}`,
            adminController.delete,
            ''
        )
    })

    test('Delete user by admin with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/admin/users/${mockUserId}`,
            adminController.delete,
            'Bearer fakeToken'
        )
    })

    test('Delete user by admin which is not admin, should return 403', async () => {
        await checkRouteWithoutAdminRights(
            request(app).delete,
            `/api/admin/users/${mockUserId}`,
            adminController.delete,
        )
    })

    test('Delete user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).delete,
            `/api/admin/users/0`,
            adminController.delete,
            'Пользователь не найден',
            mockAdminJwtToken,
        )
    })

    test('Delete user by admin with valid data, should return 200', async () => {
        adminController.delete.mockImplementation((req, res) =>
            res.json({ deletedUserId: mockUserId })
        )

        const response = await request(app)
            .delete(`/api/admin/users/${mockUserId}`)
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body.deletedUserId).toEqual(mockUserId)
        expect(adminController.delete).toHaveBeenCalledTimes(1)
    })

    test('Get feedbacks by admin which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/admin/feedbacks',
            adminController.getAllFeedbacks,
            ''
        )
    })

    test('Get feedbacks by admin with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/admin/feedbacks',
            adminController.getAllFeedbacks,
            'Bearer fakeToken'
        )
    })

    test('Get feedbacks by admin which is not admin, should return 403', async () => {
        await checkRouteWithoutAdminRights(
            request(app).get,
            '/api/admin/feedbacks',
            adminController.getAllFeedbacks,
        )
    })

    test('Get feedbacks with valid data, should return 200', async () => {
        adminController.getAllFeedbacks.mockImplementation((req, res) =>
            res.json(mockFeedbacksData)
        )

        const response = await request(app)
            .get('/api/admin/feedbacks')
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockFeedbacksData)
        expect(adminController.getAllFeedbacks).toHaveBeenCalledTimes(1)
    })

    test('Update feedback status with invalid data, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'отсутствует статус обратной связи',
            adminController.changeStatus,
            request(app).patch,
            `/api/admin/feedbacks/1`,
            mockAdminJwtToken,
            {}
        )
    })

    test('Update feedback status by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/admin/feedbacks/1`,
            adminController.changeStatus,
            '',
            { status: true }
        )
    })

    test('Update feedback status by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/admin/feedbacks/1`,
            adminController.changeStatus,
            'Bearer fakeToken',
            { status: true }
        )
    })

    test('Update feedback by admin which is not admin, should return 403', async () => {
        await checkRouteWithoutAdminRights(
            request(app).patch,
            `/api/admin/feedbacks/1`,
            adminController.changeStatus,
            { status: true }
        )
    })

    test('Update feedback status which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            `/api/admin/feedbacks/0`,
            adminController.changeStatus,
            'Обращение не найдено',
            mockAdminJwtToken,
            { status: true }
        )
    })

    test('Update feedback status with valid data, should return 200', async () => {
        adminController.changeStatus.mockImplementation((req, res) =>
            res.json({ feedback: updatedStatusMockData })
        )

        const response = await request(app)
            .patch(`/api/admin/feedbacks/1`)
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ status: true })

        expect(response.status).toBe(200)
        expect(response.body.feedback).toEqual(updatedStatusMockData)
        expect(adminController.changeStatus).toHaveBeenCalledTimes(1)
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => {
        if (server) {
            await new Promise((resolve) => server.close(resolve))
            server.unref()
        }
    })
})