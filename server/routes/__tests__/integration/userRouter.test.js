const request = require('supertest')
const path = require('path')
const fs = require('mz/fs')
const { jwtDecode } = require('jwt-decode')
const { app, start, stop } = require('../../../index')
const { mockAdminJwtToken, mockFakeUserJwtToken } = require('@mocks/jwtTokenMocks')
const {
    checkRouteWithInvalidInfo,
    checkRouteWithInvalidToken,
    checkRouteWithNonexistentData
} = require('./checkRouter')

describe('userRouter tests', () => {
    let mockUserId, mockUserToken, mockUserPassword, mockUserImg

    const filePath = `${__dirname}/test_image.jpg`

    beforeAll(async () => await start())

    test('User registration with empty email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/registration',
            'Введены некорректные данные: email пользователя не заполнен',
            { email: '', password: '12345678', role: 'USER', hcaptchaToken: '123' }
        )
    })

    test('User registration with invalid password, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/registration',
            'Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов',
            { email: 'user1@example.com', password: '12345', role: 'USER', hcaptchaToken: '123' }
        )
    })

    test('User registration with invalid password and email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/registration',
            'Введены некорректные данные: email пользователя не заполнен и длина пароля должна составлять от 6 до 12 символов',
            { email: '', password: '12345', role: 'USER', hcaptchaToken: '123' }
        )
    })

    test('User registration with empty captcha, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/registration',
            'Капча не пройдена',
            { email: 'user1@example.com', password: '12345678', role: 'USER', hcaptchaToken: '' }
        )
    })

    test('User registration with valid data, should return 201', async () => {
        const response = await request(app)
            .post('/api/user/registration')
            .send({
                email: 'user1@example.com',
                password: '12345678',
                role: 'USER',
                hcaptchaToken: '123'
            })

        const decoded = jwtDecode(response.body.token)

        expect(response.status).toBe(201)
        expect(decoded.email).toBe('user1@example.com')
        expect(typeof decoded.email).toBe('string')
        expect(decoded.role).toBe('USER')
        expect(typeof decoded.role).toBe('string')
        expect(decoded).toHaveProperty('id')
        expect(typeof decoded.id).toBe('number')
        expect(decoded).toHaveProperty('iat')
        expect(typeof decoded.iat).toBe('number')
        expect(decoded).toHaveProperty('exp')
        expect(typeof decoded.exp).toBe('number')

        mockUserId = decoded.id
        mockUserToken = response.body.token
    })

    test('User registration with another candidate, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/registration',
            'Пользователь с таким именем уже существует',
            { email: 'user1@example.com', password: '12345678', role: 'USER', hcaptchaToken: '123' }
        )
    })

    test('User login with empty email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/login',
            'Введены некорректные данные: email пользователя не заполнен',
            { email: '', password: '12345678', hcaptchaToken: '123' }
        )
    })

    test('User login with invalid password, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/login',
            'Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов',
            { email: 'user1@example.com', password: '12345', hcaptchaToken: '123' }
        )
    })

    test('User login with invalid password and email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/login',
            'Введены некорректные данные: email пользователя не заполнен и длина пароля должна составлять от 6 до 12 символов',
            { email: '', password: '12345', hcaptchaToken: '123' }
        )
    })

    test('User login with empty captcha, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/login',
            'Капча не пройдена',
            { email: 'user1@example.com', password: '12345678', hcaptchaToken: '' }
        )
    })

    test('User login with wrong password, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/login',
            'Введен неверный пароль',
            { email: 'user1@example.com', password: '1234567', hcaptchaToken: '123' }
        )
    })

    test('User login with wrong email, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).post,
            '/api/user/login',
            'Пользователь не найден',
            mockUserToken,
            { email: 'user1@exmple.com', password: '12345678', hcaptchaToken: '123' }
        )
    })

    test('User login with valid data, should return 200', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({ email: 'user1@example.com', password: '12345678', hcaptchaToken: '123' })

        const decoded = jwtDecode(response.body.token)

        expect(response.status).toBe(200)
        expect(decoded.email).toBe('user1@example.com')
        expect(typeof decoded.email).toBe('string')
        expect(decoded.role).toBe('USER')
        expect(typeof decoded.role).toBe('string')
        expect(decoded).toHaveProperty('id')
        expect(typeof decoded.id).toBe('number')
        expect(decoded).toHaveProperty('iat')
        expect(typeof decoded.iat).toBe('number')
        expect(decoded).toHaveProperty('exp')
        expect(typeof decoded.exp).toBe('number')
        expect(decoded).toEqual(jwtDecode(mockUserToken))
    })

    test('Check user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/user/auth',
            ''
        )
    })

    test('Check user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/user/auth',
            'Bearer fakeToken'
        )
    })

    test('Check user with valid data, should return 200', async () => {
        const response = await request(app)
            .get('/api/user/auth')
            .set('Authorization', `Bearer ${mockUserToken}`)
            .send({
                info: 'Great app!',
                userId: 1
            })

        expect(response.status).toBe(200)
        expect(jwtDecode(response.body.token)).toEqual(jwtDecode(mockUserToken))
    })

    test('Get info by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/user/`,
            ''
        )
    })

    test('Get info by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/user/`,
            'Bearer fakeToken'
        )
    })

    test('Get info by user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).get,
            '/api/user/',
            'Пользователь не найден',
            mockFakeUserJwtToken
        )
    })

    test('Get info by user with valid data, should return 200', async () => {
        const response = await request(app)
            .get(`/api/user/`)
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(response.status).toBe(200)

        expect(response.body.user).toEqual(expect.objectContaining({
            id: mockUserId,
            email: 'user1@example.com',
            role: 'USER'
        }))

        expect(typeof response.body.user.id).toBe('number')
        expect(typeof response.body.user.email).toBe('string')
        expect(typeof response.body.user.role).toBe('string')

        expect(response.body.user).toHaveProperty('password')
        expect(typeof response.body.user.password).toBe('string')

        expect(response.body.user).toHaveProperty('img')
        expect(typeof response.body.user.img).toBe('string')

        expect(response.body.user).toHaveProperty('createdAt')
        expect(typeof response.body.user.createdAt).toBe('string')

        expect(response.body.user).toHaveProperty('updatedAt')
        expect(typeof response.body.user.updatedAt).toBe('string')

        mockUserPassword = response.body.user.password
    })

    test('Update info with empty email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).patch,
            '/api/user/info',
            'Введены некорректные данные: email пользователя не заполнен',
            { email: '', password: '' },
            mockUserToken
        )
    })

    test('Update info with invalid password, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).patch,
            '/api/user/info',
            'Введены некорректные данные: длина пароля должна составлять от 6 до 12 символов',
            { email: 'user1@example.com', password: '12345' },
            mockUserToken
        )
    })

    test('Update info by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            '/api/user/info',
            '',
            { email: 'user11@example.com', password: '' }
        )
    })

    test('Update info by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            '/api/user/info',
            'Bearer fakeToken',
            { email: 'user11@example.com', password: '' }
        )
    })

    test('Update info by user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            '/api/user/info',
            'Пользователь не найден',
            mockFakeUserJwtToken,
            { email: 'user11@example.com', password: '' }
        )
    })

    test('Update email with valid data, should return 200', async () => {
        const response = await request(app)
            .patch('/api/user/info')
            .set('Authorization', `Bearer ${mockUserToken}`)
            .send({ email: 'user11@example.com', password: '' })

        const decoded = jwtDecode(response.body.token)

        expect(response.status).toBe(200)

        expect(decoded.id).toEqual(mockUserId)
        expect(typeof decoded.id).toBe('number')

        expect(decoded.email).toEqual('user11@example.com')
        expect(typeof decoded.email).toBe('string')

        expect(decoded.role).toEqual('USER')
        expect(typeof decoded.role).toBe('string')
    })

    test('User email with another candidate, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).patch,
            '/api/user/info',
            'Пользователь с таким именем уже существует',
            { email: 'user11@example.com', password: '' },
            mockUserToken
        )
    })

    test('Update password with valid data, should return 200', async () => {
        const response = await request(app)
            .patch('/api/user/info')
            .set('Authorization', `Bearer ${mockUserToken}`)
            .send({ email: 'user11@example.com', password: '123456789' })

        const decoded = jwtDecode(response.body.token)

        expect(response.status).toBe(200)

        expect(decoded.id).toEqual(mockUserId)
        expect(typeof decoded.id).toBe('number')
        expect(decoded.email).toEqual('user11@example.com')
        expect(typeof decoded.email).toBe('string')
        expect(decoded.role).toEqual('USER')
        expect(typeof decoded.role).toBe('string')

        const userInfo = await request(app)
            .get(`/api/user/`)
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(userInfo.status).toBe(200)
        expect(userInfo.body.user).toEqual(expect.objectContaining({
            id: mockUserId,
            email: 'user11@example.com',
            role: 'USER'
        }))
        expect(typeof userInfo.body.user.id).toBe('number')
        expect(typeof userInfo.body.user.email).toBe('string')
        expect(typeof userInfo.body.user.role).toBe('string')

        expect(userInfo.body.password).not.toBe(mockUserPassword)
    })

    test('Update image by user which is not authorized, should return 401', async () => {
        try {
            await fs.access(filePath)

            const response = await request(app)
                .patch(`/api/user/image`)
                .set('Authorization', '')
                .attach('file', filePath)

            expect(response.status).toBe(401)
            expect(response.body.message).toBe('Пользователь не авторизован')
        } catch (err) {
            throw new Error(`Ошибка при проверке файла: ${err.message}`)
        }
    })

    test('Update image by user with fake token, should return 401', async () => {
        try {
            await fs.access(filePath)

            const response = await request(app)
                .patch(`/api/user/image`)
                .set('Authorization', 'Bearer fakeToken')
                .attach('file', filePath)

            expect(response.status).toBe(401)
            expect(response.body.message).toBe('Пользователь не авторизован')
        } catch (err) {
            throw new Error(`Ошибка при проверке файла: ${err.message}`)
        }
    })


    test('Update image by user which does not exist, should return 404', async () => {
        try {
            await fs.access(filePath)

            const response = await request(app)
                .patch(`/api/user/image`)
                .set('Authorization', `Bearer ${mockFakeUserJwtToken}`)
                .attach('file', filePath)

            expect(response.status).toBe(404)
            expect(response.body.message).toBe('Пользователь не найден')
        } catch (err) {
            throw new Error(`Ошибка при проверке файла: ${err.message}`)
        }
    })

    test('Update image with valid data, should return 200', async () => {
        try {
            await fs.access(filePath)

            const response = await request(app)
                .patch(`/api/user/image`)
                .set('Authorization', `Bearer ${mockUserToken}`)
                .attach('file', filePath)

            expect(response.status).toBe(200)
            expect(response.body.user).toEqual(expect.objectContaining({
                id: mockUserId,
                email: 'user11@example.com',
                role: 'USER',
                img: expect.stringMatching(/\.jpg$/)
            }))
            expect(response.body.user.img).not.toBe('user_default_image.jpg')

            expect(typeof response.body.user.id).toBe('number')
            expect(typeof response.body.user.email).toBe('string')
            expect(typeof response.body.user.role).toBe('string')
            expect(typeof response.body.user.img).toBe('string')

            expect(response.body.user).toHaveProperty('password')
            expect(typeof response.body.user.password).toBe('string')

            expect(response.body.user).toHaveProperty('createdAt')
            expect(typeof response.body.user.createdAt).toBe('string')

            expect(response.body.user).toHaveProperty('updatedAt')
            expect(typeof response.body.user.updatedAt).toBe('string')

            mockUserImg = response.body.user.img
        } catch (err) {
            throw new Error(`Ошибка при проверке файла: ${err.message}`)
        }
    })

    test('Delete image by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/user/image`,
            '',
        )
    })

    test('Delete image by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/user/image`,
            'Bearer fakeToken',
        )
    })

    test('Delete image by user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).delete,
            `/api/user/image`,
            'Пользователь не найден',
            mockFakeUserJwtToken,
        )
    })

    test('Delete image with valid data, should return 200', async () => {
        const response = await request(app)
            .delete(`/api/user/image`)
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(response.status).toBe(200)
        expect(response.body.user).toEqual(expect.objectContaining({
            id: mockUserId,
            email: 'user11@example.com',
            role: 'USER',
            img: 'user_default_image.jpg'
        }))

        expect(typeof response.body.user.id).toBe('number')
        expect(typeof response.body.user.email).toBe('string')
        expect(typeof response.body.user.role).toBe('string')
        expect(typeof response.body.user.img).toBe('string')

        expect(response.body.user).toHaveProperty('password')
        expect(typeof response.body.user.password).toBe('string')

        expect(response.body.user).toHaveProperty('createdAt')
        expect(typeof response.body.user.createdAt).toBe('string')

        expect(response.body.user).toHaveProperty('updatedAt')
        expect(typeof response.body.user.updatedAt).toBe('string')

        const imagePath = path.resolve(__dirname, '..', 'static', mockUserImg)
        await expect(fs.access(imagePath)).rejects.toThrow()
    })

    test('Delete user by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/user/`,
            ''
        )
    })

    test('Delete user by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/user/`,
            'Bearer fakeToken'
        )
    })

    test('Delete user by user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).delete,
            `/api/user/`,
            'Пользователь не найден',
            mockFakeUserJwtToken
        )
    })

    test('Delete user with valid data, should return 200', async () => {
        const response = await request(app)
            .delete(`/api/user/`)
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(response.status).toBe(200)
        expect(response.body.deletedUserId).toBe(mockUserId)

        const feedbacks = await request(app)
            .get('/api/admin/feedbacks')
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)

        const userFeedbacks = feedbacks.body.feedbacks.filter((item) => item.userId === mockUserId)
        expect(userFeedbacks.length).toBe(0)

        const tasks = await request(app)
            .get('/api/task/user')
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(tasks.status).toBe(404)
        expect(tasks.body.message).toBe('Пользователь не найден')

        const goals = await request(app)
            .get('/api/goal/user')
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(goals.status).toBe(404)
        expect(goals.body.message).toBe('Пользователь не найден')
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => await stop())
})