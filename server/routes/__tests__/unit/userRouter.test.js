const request = require('supertest')
const express = require('express')
const userController = require('../../../controllers/userController')
const errorHandler = require('../../../middleware/ErrorHandlingMiddleware')
const userRouter = require('../../userRouter')
const ApiError = require('../../../error/ApiError')
const { v4: uuidv4 } = require('uuid')
const { mockFakeUserJwtToken } = require('@mocks/jwtTokenMocks')
const { jwtDecode } = require('jwt-decode')
const jwt = require('jsonwebtoken')
const {
    checkRouteWithInvalidInfo, checkRouteWithInvalidToken,
    checkRouteWithNonexistentData, checkRouteWithAnotherCandidate,
    checkRouteWithEmptyCaptcha
} = require('./checkRouter')

jest.mock('../../../controllers/userController', () => ({
    registration: jest.fn(),
    login: jest.fn(),
    check: jest.fn(),
    updateInfo: jest.fn(),
    updateImage: jest.fn(),
    deleteImage: jest.fn(),
    delete: jest.fn(),
    getInfo: jest.fn(),
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

jest.mock('../../../middleware/CaptchaMiddleware', () => {
    const ApiError = require('../../../error/ApiError')
    return jest.fn((req, res, next) => {
        if (!req.body.hcaptchaToken) {
            return next(ApiError.badRequest('Капча не пройдена'))
        }
        next()
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

describe('userRouter unit tests', () => {
    let app, server, mockUserId, mockUserImg,
        mockUserToken, mockUserData, updatedEmailMockData

    beforeAll(async () => {
        app = express()
        app.use(express.json())
        app.use('/api/user', userRouter)
        app.use(errorHandler)
        server = app.listen()

        mockUserData = {
            id: 22,
            email: 'user1@example.com',
            password: 'hashedPassword123',
            role: 'USER',
            img: 'user_default_image.jpg',
            createdAt: "2025-01-26 13:48:44.315+03",
            updatedAt: "2025-01-26 13:48:44.315+03",
        }

        mockUserToken = jwt.sign({
            id: 22,
            email: 'user1@example.com',
            role: 'USER'
        }, process.env.SECRET_KEY)

        updatedEmailMockData = jwt.sign({
            id: 22,
            email: 'user11@example.com',
            role: 'USER'
        }, process.env.SECRET_KEY)
    })

    test('User registration with empty email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'email пользователя не заполнен',
            userController.registration,
            request(app).post,
            '/api/user/registration',
            '',
            { email: '', password: '12345678', role: 'USER', hcaptchaToken: '123' }
        )
    })

    test('User registration with invalid password, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'длина пароля должна составлять от 6 до 12 символов',
            userController.registration,
            request(app).post,
            '/api/user/registration',
            '',
            { email: 'user1@example.com', password: '12345', role: 'USER', hcaptchaToken: '123' }
        )
    })

    test('User registration with invalid password and email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'email пользователя не заполнен и длина пароля должна составлять от 6 до 12 символов',
            userController.registration,
            request(app).post,
            '/api/user/registration',
            '',
            { email: '', password: '12345', role: 'USER', hcaptchaToken: '123' }
        )
    })

    test('User registration with empty captcha, should return 400', async () => {
        await checkRouteWithEmptyCaptcha(
            userController.registration,
            request(app).post,
            '/api/user/registration',
            '',
            { email: 'user1@example.com', password: '12345678', role: 'USER', hcaptchaToken: '' }
        )
    })

    test('User registration with valid data, should return 201', async () => {
        userController.registration.mockImplementation((req, res) =>
            res.status(201).json({ token: mockUserToken })
        )

        const response = await request(app)
            .post('/api/user/registration')
            .send({
                email: 'user1@example.com',
                password: '12345678',
                role: 'USER',
                hcaptchaToken: '123'
            })

        expect(response.status).toBe(201)
        expect(response.body.token).toEqual(mockUserToken)
        expect(userController.registration).toHaveBeenCalledTimes(1)

        const decoded = jwtDecode(response.body.token)
        expect(decoded.email).toBe('user1@example.com')
        expect(decoded.role).toBe('USER')
        expect(decoded).toHaveProperty('id')

        mockUserId = decoded.id
    })

    test('User registration with another candidate, should return 400', async () => {
        await checkRouteWithAnotherCandidate(
            'Пользователь с таким именем уже существует',
            userController.registration,
            request(app).post,
            '/api/user/registration',
            '',
            { email: 'user1@example.com', password: '12345678', role: 'USER', hcaptchaToken: '123' },
        )
    })

    test('User login with empty email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'email пользователя не заполнен',
            userController.login,
            request(app).post,
            '/api/user/login',
            '',
            { email: '', password: '12345678', hcaptchaToken: '123' }
        )
    })

    test('User login with invalid password, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'длина пароля должна составлять от 6 до 12 символов',
            userController.login,
            request(app).post,
            '/api/user/login',
            '',
            { email: 'user1@example.com', password: '12345', hcaptchaToken: '123' }
        )
    })

    test('User login with invalid password and email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'email пользователя не заполнен и длина пароля должна составлять от 6 до 12 символов',
            userController.login,
            request(app).post,
            '/api/user/login',
            '',
            { email: '', password: '12345', hcaptchaToken: '123' }
        )
    })

    test('User login with empty captcha, should return 400', async () => {
        await checkRouteWithEmptyCaptcha(
            userController.login,
            request(app).post,
            '/api/user/login',
            '',
            { email: 'user1@example.com', password: '12345678', hcaptchaToken: '' }
        )
    })

    test('User login with wrong password, should return 400', async () => {
        userController.login.mockImplementationOnce((req, res, next) => {
            return next(ApiError.badRequest('Введен неверный пароль'))
        })

        const response = await request(app)
            .post('/api/user/login')
            .send({ email: 'user1@example.com', password: '1234567', hcaptchaToken: '123' })

        expect(response.status).toBe(400)
        expect(response.body.message).toContain('Введен неверный пароль')
        expect(userController.login).toHaveBeenCalledTimes(1)
    })

    test('User login with wrong email, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).post,
            '/api/user/login',
            userController.login,
            'Пользователь не найден',
            '',
            { email: 'user1@exmple.com', password: '12345678', hcaptchaToken: '123' }
        )
    })

    test('User login with valid data, should return 200', async () => {
        userController.login.mockImplementation((req, res) =>
            res.status(200).json({ token: mockUserToken })
        )

        const response = await request(app)
            .post('/api/user/login')
            .send({ email: 'user1@example.com', password: '12345678', hcaptchaToken: '123' })

        expect(response.status).toBe(200)
        expect(response.body.token).toEqual(mockUserToken)
        expect(userController.login).toHaveBeenCalledTimes(1)

        const decoded = jwtDecode(response.body.token)
        expect(decoded.email).toBe('user1@example.com')
        expect(decoded.role).toBe('USER')
        expect(decoded).toHaveProperty('id')
    })

    test('Check user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/user/auth',
            userController.check,
            ''
        )
    })

    test('Check user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/user/auth',
            userController.check,
            'Bearer fakeToken'
        )
    })

    test('Check user with valid data, should return 200', async () => {
        userController.check.mockImplementation((req, res) =>
            res.status(200).json({
                token: jwt.sign({
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role
                }, process.env.SECRET_KEY)
            })
        )

        const response = await request(app)
            .get('/api/user/auth')
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(response.status).toBe(200)
        expect(userController.check).toHaveBeenCalledTimes(1)

        const decoded = jwtDecode(response.body.token)
        expect(decoded.id).toBe(mockUserId)
        expect(decoded.email).toBe(mockUserData.email)
        expect(decoded.role).toBe(mockUserData.role)
    })

    test('Get info by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/user/`,
            userController.getInfo,
            ''
        )
    })

    test('Get info by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/user/`,
            userController.getInfo,
            'Bearer fakeToken'
        )
    })

    test('Get info by user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).get,
            `/api/user/`,
            userController.getInfo,
            'Пользователь не найден',
            mockFakeUserJwtToken
        )
    })

    test('Get info with valid data, should return 200', async () => {
        userController.getInfo.mockImplementation((req, res) =>
            res.json({ user: mockUserData })
        )

        const response = await request(app)
            .get(`/api/user/`)
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(response.status).toBe(200)
        expect(response.body.user).toEqual(mockUserData)
        expect(userController.getInfo).toHaveBeenCalledTimes(1)
    })

    test('Update user with empty email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            'email пользователя не заполнен',
            userController.updateInfo,
            request(app).patch,
            '/api/user/info',
            mockUserToken,
            { email: '', password: '' },
        )
    })

    test('Update user with invalid password, should return 400', async () => {
        userController.updateInfo.mockImplementationOnce((req, res, next) => {
            const { password } = req.body
            if (password.length < 6 || password.length > 12) {
                return next(ApiError.badRequest('Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов'))
            }
            res.status(200).json('Запрос успешно выполнен')
        })

        const response = await request(app)
            .patch('/api/user/info')
            .set('Authorization', `Bearer ${mockUserToken}`)
            .send({ email: 'user1@example.com', password: '12345' })

        expect(response.status).toBe(400)
        expect(response.body.message).toContain('Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов')
        expect(userController.updateInfo).toHaveBeenCalledTimes(1)
    })

    test('Update info by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            '/api/user/info',
            userController.updateInfo,
            '',
            { email: 'user11@example.com', password: '' }
        )
    })

    test('Update info by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            '/api/user/info',
            userController.updateInfo,
            'Bearer fakeToken',
            { email: 'user11@example.com', password: '' }
        )
    })

    test('Update user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            '/api/user/info',
            userController.updateInfo,
            'Пользователь не найден',
            mockFakeUserJwtToken,
            { email: 'user11@example.com', password: '' }
        )
    })

    test('Update user email with valid data, should return 200', async () => {
        updatedEmailMockData = jwt.sign({
            id: 22,
            email: 'user11@example.com',
            role: 'USER'
        }, process.env.SECRET_KEY)

        userController.updateInfo.mockImplementation((req, res) =>
            res.json({ token: updatedEmailMockData })
        )

        const response = await request(app)
            .patch('/api/user/info')
            .set('Authorization', `Bearer ${mockUserToken}`)
            .send({ email: 'user11@example.com', password: '' })

        expect(response.status).toBe(200)
        expect(userController.updateInfo).toHaveBeenCalledTimes(1)

        const decoded = jwtDecode(response.body.token)
        expect(decoded.id).toBe(mockUserId)
        expect(decoded.email).toBe('user11@example.com')
        expect(decoded.role).toBe('USER')

        mockUserToken = updatedEmailMockData
        mockUserData = { ...mockUserData, email: 'user11@example.com' }
    })

    test('Update user with another candidate, should return 400', async () => {
        await checkRouteWithAnotherCandidate(
            'Пользователь с таким именем уже существует',
            userController.updateInfo,
            request(app).patch,
            '/api/user/info',
            mockUserToken,
            { email: 'user11@example.com', password: '' }
        )
    })

    test('Update user password with valid data, should return 200', async () => {
        userController.updateInfo.mockImplementation((req, res) =>
            res.json({
                token: jwt.sign({
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role
                }, process.env.SECRET_KEY)
            })
        )

        const response = await request(app)
            .patch('/api/user/info')
            .set('Authorization', `Bearer ${mockUserToken}`)
            .send({ email: 'user11@example.com', password: '123456789' })

        expect(response.status).toBe(200)
        expect(userController.updateInfo).toHaveBeenCalledTimes(1)

        const decoded = jwtDecode(response.body.token)
        expect(decoded.id).toBe(mockUserId)
        expect(decoded.email).toBe(mockUserData.email)
        expect(decoded.role).toBe(mockUserData.role)

        mockUserData = { ...mockUserData, password: '123456789' }
    })

    test('Update image by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/user/image`,
            userController.updateImage,
            '',
        )
    })

    test('Update image by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/user/image`,
            userController.updateImage,
            'Bearer fakeToken'
        )
    })

    test('Update image by user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            `/api/user/image`,
            userController.updateImage,
            'Пользователь не найден',
            mockFakeUserJwtToken
        )
    })

    test('Update image with valid data, should return 200', async () => {
        userController.updateImage.mockImplementation((req, res) => {
            const newImage = uuidv4() + '.jpg'
            res.json({
                user: { ...mockUserData, img: newImage }
            })
        })

        const response = await request(app)
            .patch('/api/user/image')
            .set('Authorization', `Bearer ${mockUserToken}`)
            .attach('file', Buffer.from('fake_data'), 'fake_image.jpg')

        expect(response.status).toBe(200)
        expect(response.body.user).toEqual(expect.objectContaining({
            id: mockUserId,
            email: mockUserData.email,
            role: mockUserData.role,
            img: expect.stringMatching(/\.jpg$/),
        }))
        expect(response.body.user.img).not.toBe('user_default_image.jpg')

        mockUserImg = response.body.user.img
    })

    test('Delete image by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/user/image`,
            userController.deleteImage,
            '',
        )
    })

    test('Delete image by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/user/image`,
            userController.deleteImage,
            'Bearer fakeToken',
        )
    })

    test('Delete image by user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).delete,
            `/api/user/image`,
            userController.deleteImage,
            'Пользователь не найден',
            mockFakeUserJwtToken,
        )
    })

    test('Delete image with valid data, should return 200', async () => {
        userController.deleteImage.mockImplementation((req, res) =>
            res.json({
                user: { ...mockUserData }
            })
        )

        const response = await request(app)
            .delete(`/api/user/image`)
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(response.status).toBe(200)
        expect(response.body.user).toEqual(expect.objectContaining({
            id: mockUserId,
            email: mockUserData.email,
            role: mockUserData.role,
            img: 'user_default_image.jpg'
        }))
        expect(userController.deleteImage).toHaveBeenCalledTimes(1)
        expect(response.body.user.img).not.toBe(mockUserImg)
    })

    test('Delete user by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/user/`,
            userController.delete,
            ''
        )
    })

    test('Delete user by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/user/`,
            userController.delete,
            'Bearer fakeToken'
        )
    })

    test('Delete user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).delete,
            `/api/user/`,
            userController.delete,
            'Пользователь не найден',
            mockFakeUserJwtToken,
        )
    })

    test('Delete user with valid data, should return 200', async () => {
        userController.delete.mockImplementation((req, res) =>
            res.json({ deletedUserId: mockUserId })
        )

        const response = await request(app)
            .delete(`/api/user/`)
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(response.status).toBe(200)
        expect(response.body.deletedUserId).toEqual(mockUserId)
        expect(userController.delete).toHaveBeenCalledTimes(1)
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => {
        if (server) {
            await new Promise((resolve) => server.close(resolve))
            server.unref()
        }
    })
})