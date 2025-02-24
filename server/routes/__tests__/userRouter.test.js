const request = require('supertest')
const fs = require('mz/fs')
const { jwtDecode } = require('jwt-decode')
const { app, start, stop } = require('../../index')
const { mockAdminJwtToken, checkRouteWithInvalidInfo, checkRouteWithInvalidToken } = require('./checkRouter')

describe('userRouter tests', () => {
    let mockUserId, mockUserToken, mockUserPassword
    const filePath = `${__dirname}/test_image.jpg`

    beforeAll(async () => await start())

    test('User registration with empty email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/registration',
            'Введены некорректные данные: Email пользователя не заполнен',
            { email: '', password: '12345678', role: 'USER', hcaptchaToken: '123' }
        )
    })

    test('User registration with empty password, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/registration',
            'Введены некорректные данные: Длина пароля должна составлять от 6 до 12 символов',
            { email: 'user1@example.com', password: '12345', role: 'USER', hcaptchaToken: '123' }
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

    test('User registration with valid data, should return 200', async () => {
        const response = await request(app)
            .post('/api/user/registration')
            .send({ email: 'user1@example.com', password: '12345678', role: 'USER', hcaptchaToken: '123' })

        const decoded = jwtDecode(response.body.token)

        expect(response.status).toBe(200)
        expect(decoded.email).toBe('user1@example.com')
        expect(decoded.role).toBe('USER')
        expect(decoded).toHaveProperty('id')
        expect(decoded).toHaveProperty('iat')
        expect(decoded).toHaveProperty('exp')

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
            'Введены некорректные данные: Email пользователя не заполнен',
            { email: '', password: '12345678', hcaptchaToken: '123' }
        )
    })

    test('User login with empty password, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/login',
            'Введены некорректные данные: Длина пароля должна составлять от 6 до 12 символов',
            { email: 'user1@example.com', password: '12345', hcaptchaToken: '123' }
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

    test('User login with wrong email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/login',
            'Пользователь не найден',
            { email: 'user11@example.com', password: '1234567', hcaptchaToken: '123' }
        )
    })

    test('User login with valid data, should return 200', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({ email: 'user1@example.com', password: '12345678', hcaptchaToken: '123' })

        const decoded = jwtDecode(response.body.token)

        expect(response.status).toBe(200)
        expect(decoded.email).toBe('user1@example.com')
        expect(decoded.role).toBe('USER')
        expect(decoded).toHaveProperty('id')
        expect(decoded).toHaveProperty('iat')
        expect(decoded).toHaveProperty('exp')
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
            `/api/user/${mockUserId}`,
            ''
        )
    })

    test('Get info by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/user/${mockUserId}`,
            'Bearer fakeToken'
        )
    })

    test('Get info by user which does not exist, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).get,
            '/api/user/0',
            'Пользователь не найден',
            {},
            mockUserToken
        )
    })

    test('Get info by user with valid data, should return 200', async () => {
        const response = await request(app)
            .get(`/api/user/${mockUserId}`)
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(response.status).toBe(200)

        expect(response.body).toEqual(expect.objectContaining({
            id: mockUserId,
            email: 'user1@example.com',
            role: 'USER'
        }))

        expect(response.body).toHaveProperty('password')
        expect(response.body).toHaveProperty('img')
        expect(response.body).toHaveProperty('createdAt')
        expect(response.body).toHaveProperty('updatedAt')

        mockUserPassword = response.body.password
    })

    test('Update info by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).put,
            '/api/user/info',
            '',
            { email: 'user11@example.com', password: '', userId: mockUserId }
        )
    })

    test('Update info by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).put,
            '/api/user/info',
            'Bearer fakeToken',
            { email: 'user11@example.com', password: '', userId: mockUserId }
        )
    })

    test('Update info by user which does not exist, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).put,
            '/api/user/info',
            'Пользователь не найден',
            { email: 'user11@example.com', password: '', userId: 0 },
            mockUserToken
        )
    })

    test('Update email with valid data, should return 200', async () => {
        const response = await request(app)
            .put('/api/user/info')
            .set('Authorization', `Bearer ${mockUserToken}`)
            .send({
                email: 'user11@example.com',
                password: '',
                userId: mockUserId
            })

        const decoded = jwtDecode(response.body.token)

        expect(response.status).toBe(200)

        expect(decoded.id).toEqual(mockUserId)
        expect(decoded.email).toEqual('user11@example.com')
        expect(decoded.role).toEqual('USER')
    })

    test('Update password with valid data, should return 200', async () => {
        const response = await request(app)
            .put('/api/user/info')
            .set('Authorization', `Bearer ${mockUserToken}`)
            .send({
                email: 'user11@example.com',
                password: '123456789',
                userId: mockUserId
            })

        const decoded = jwtDecode(response.body.token)

        expect(response.status).toBe(200)

        expect(decoded.id).toEqual(mockUserId)
        expect(decoded.email).toEqual('user11@example.com')
        expect(decoded.role).toEqual('USER')

        const userInfo = await request(app)
            .get(`/api/user/${mockUserId}`)
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(userInfo.status).toBe(200)
        expect(userInfo.body).toEqual(expect.objectContaining({
            id: mockUserId,
            email: 'user11@example.com',
            role: 'USER'
        }))

        expect(userInfo.body.password).not.toBe(mockUserPassword)
    })

    test('Update image by user which is not authorized, should return 401', async () => {
        try {
            await fs.access(filePath)

            const response = await request(app)
                .put(`/api/user/${mockUserId}/image`)
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
                .put(`/api/user/${mockUserId}/image`)
                .set('Authorization', 'Bearer fakeToken')
                .attach('file', filePath)

            expect(response.status).toBe(401)
            expect(response.body.message).toBe('Пользователь не авторизован')
        } catch (err) {
            throw new Error(`Ошибка при проверке файла: ${err.message}`)
        }
    })


    test('Update image by user which does not exist, should return 400', async () => {
        try {
            await fs.access(filePath)

            const response = await request(app)
                .put(`/api/user/0/image`)
                .set('Authorization', `Bearer ${mockUserToken}`)
                .attach('file', filePath)

            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Пользователь не найден')
        } catch (err) {
            throw new Error(`Ошибка при проверке файла: ${err.message}`)
        }
    })

    test('Update image with valid data, should return 200', async () => {
        try {
            await fs.access(filePath)

            const response = await request(app)
                .put(`/api/user/${mockUserId}/image`)
                .set('Authorization', `Bearer ${mockUserToken}`)
                .attach('file', filePath)

            expect(response.status).toBe(200)
            expect(response.body.user).toEqual(expect.objectContaining({
                id: mockUserId,
                email: 'user11@example.com',
                role: 'USER',
                img: expect.stringMatching(/\.jpg$/)
            }))

            expect(response.body.user).toHaveProperty('password')
            expect(response.body.user).toHaveProperty('createdAt')
            expect(response.body.user).toHaveProperty('updatedAt')
        } catch (err) {
            throw new Error(`Ошибка при проверке файла: ${err.message}`)
        }
    })

    test('Delete image by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).put,
            `/api/user/image`,
            '',
            { userId: mockUserId }
        )
    })

    test('Delete image by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).put,
            `/api/user/image`,
            'Bearer fakeToken',
            { userId: mockUserId }
        )
    })

    test('Delete account by user which does not exist, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).put,
            `/api/user/image`,
            'Пользователь не найден',
            { userId: 0 },
            mockUserToken
        )
    })

    test('Delete image with valid data, should return 200', async () => {
        const response = await request(app)
            .put(`/api/user/image`)
            .set('Authorization', `Bearer ${mockUserToken}`)
            .send({ userId: mockUserId })

        expect(response.status).toBe(200)
        expect(response.body.user).toEqual(expect.objectContaining({
            id: mockUserId,
            email: 'user11@example.com',
            role: 'USER',
            img: 'user_default_image.jpg'
        }))

        expect(response.body.user).toHaveProperty('password')
        expect(response.body.user).toHaveProperty('createdAt')
        expect(response.body.user).toHaveProperty('updatedAt')
    })

    test('Delete user by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/user/${mockUserId}`,
            ''
        )
    })

    test('Delete user by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/user/${mockUserId}`,
            'Bearer fakeToken'
        )
    })

    test('Delete user by user which does not exist, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).delete,
            `/api/user/0`,
            'Пользователь не найден',
            {},
            mockUserToken
        )
    })

    test('Delete user with valid data, should return 200', async () => {
        const response = await request(app)
            .delete(`/api/user/${mockUserId}`)
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(response.status).toBe(200)
        expect(response.body.deletedUserId).toBe(mockUserId)
    })

    test('Create user with empty email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/admin',
            'Введены некорректные данные: Email пользователя не заполнен',
            { email: '', password: '12345678', role: 'ADMIN' },
            mockAdminJwtToken
        )
    })

    test('Create user with empty password, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/admin',
            'Введены некорректные данные: Длина пароля должна составлять от 6 до 12 символов',
            { email: 'admin1@example.com', password: '12345', role: 'ADMIN' },
            mockAdminJwtToken
        )
    })

    test('Create user by admin which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/user/admin',
            '',
            { email: 'admin1@example.com', password: '12345678', role: 'ADMIN' }
        )
    })

    test('Create user by admin with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/user/admin',
            'Bearer fakeToken',
            { email: 'admin1@example.com', password: '12345678', role: 'ADMIN' }
        )
    })

    test('Create user by admin which is not admin, should return 403', async () => {
        const response = await request(app)
            .post('/api/user/admin')
            .set('Authorization', `Bearer ${mockUserToken}`)
            .send({ email: 'admin1@example.com', password: '12345678', role: 'ADMIN' })

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('Пользователь не обладает правами администратора')
    })

    test('Create user with valid data, should return 200', async () => {
        const response = await request(app)
            .post('/api/user/admin')
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ email: 'admin1@example.com', password: '12345678', role: 'ADMIN' })

        const decoded = jwtDecode(response.body.token)

        expect(response.status).toBe(200)
        expect(decoded.email).toBe('admin1@example.com')
        expect(decoded.role).toBe('ADMIN')
        expect(decoded).toHaveProperty('id')
        expect(decoded).toHaveProperty('iat')
        expect(decoded).toHaveProperty('exp')

        mockUserId = decoded.id
    })

    test('Create user with another candidate, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/user/admin',
            'Пользователь с таким именем уже существует',
            { email: 'admin1@example.com', password: '12345678', role: 'ADMIN' },
            mockAdminJwtToken
        )
    })

    test('Get users by admin which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/user/admin`,
            ''
        )
    })

    test('Get users by admin with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/user/admin`,
            'Bearer fakeToken'
        )
    })

    test('Get users by admin which is not admin, should return 403', async () => {
        const response = await request(app)
            .get(`/api/user/admin`)
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('Пользователь не обладает правами администратора')
    })

    test('Get users by admin with valid data, should return 200', async () => {
        const response = await request(app)
            .get(`/api/user/admin`)
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)

        expect(response.status).toBe(200)

        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThan(0)
        response.body.forEach((user) => {
            expect(user).toHaveProperty('id')
            expect(typeof user.id).toBe('number')
            expect(user).toHaveProperty('email')
            expect(typeof user.email).toBe('string')
            expect(user).toHaveProperty('password')
            expect(typeof user.password).toBe('string')
            expect(user).toHaveProperty('role')
            expect(typeof user.role).toBe('string')
            expect(user).toHaveProperty('img')
            expect(typeof user.img).toBe('string')
            expect(user).toHaveProperty('createdAt')
            expect(typeof user.createdAt).toBe('string')
            expect(user).toHaveProperty('updatedAt')
            expect(typeof user.updatedAt).toBe('string')
        })

        const ids = response.body.map((f) => f.id)
        expect(new Set(ids).size).toBe(ids.length)
    })

    test('Update user by admin which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).put,
            '/api/user/admin',
            '',
            { userId: mockUserId, email: 'admin1@example.com', password: '123456789', role: 'ADMIN' }
        )
    })

    test('Update user by admin with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).put,
            '/api/user/admin',
            'Bearer fakeToken',
            { userId: mockUserId, email: 'admin1@example.com', password: '123456789', role: 'ADMIN' }
        )
    })

    test('Update user by admin which is not admin, should return 403', async () => {
        const response = await request(app)
            .put('/api/user/admin')
            .set('Authorization', `Bearer ${mockUserToken}`)
            .send({ userId: mockUserId, email: 'admin1@example.com', password: '123456789', role: 'ADMIN' })

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('Пользователь не обладает правами администратора')
    })

    test('Update user role with valid data, should return 200', async () => {
        const response = await request(app)
            .put('/api/user/admin')
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ userId: mockUserId, email: 'admin1@example.com', password: '', role: 'USER' })

        expect(response.status).toBe(200)
        expect(response.body.user.email).toBe('admin1@example.com')
        expect(response.body.user.role).toBe('USER')
        expect(response.body.user).toHaveProperty('id')
        expect(response.body.user).toHaveProperty('password')
        expect(response.body.user).toHaveProperty('img')
        expect(response.body.user).toHaveProperty('createdAt')
        expect(response.body.user).toHaveProperty('updatedAt')

        mockUserPassword = response.body.user.password
    })

    test('Update user password with valid data, should return 200', async () => {
        const response = await request(app)
            .put('/api/user/admin')
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ userId: mockUserId, email: 'admin1@example.com', password: '123456789', role: 'USER' })

        expect(response.status).toBe(200)
        expect(response.body.user.email).toBe('admin1@example.com')
        expect(response.body.user.role).toBe('USER')
        expect(response.body.user).toHaveProperty('id')
        expect(response.body.user).toHaveProperty('password')
        expect(response.body.user.password).not.toBe(mockUserPassword)
        expect(response.body.user).toHaveProperty('img')
        expect(response.body.user).toHaveProperty('createdAt')
        expect(response.body.user).toHaveProperty('updatedAt')
    })

    test('Update user email with valid data, should return 200', async () => {
        const response = await request(app)
            .put('/api/user/admin')
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ userId: mockUserId, email: 'admin11@example.com', password: '', role: 'USER' })

        expect(response.status).toBe(200)
        expect(response.body.user.email).toBe('admin11@example.com')
        expect(response.body.user.role).toBe('USER')
        expect(response.body.user).toHaveProperty('id')
        expect(response.body.user).toHaveProperty('password')
        expect(response.body.user).toHaveProperty('img')
        expect(response.body.user).toHaveProperty('createdAt')
        expect(response.body.user).toHaveProperty('updatedAt')
    })

    test('Update user with another candidate, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).put,
            '/api/user/admin',
            'Пользователь с таким именем уже существует',
            { userId: mockUserId, email: 'admin@example.com', password: '', role: 'USER' },
            mockAdminJwtToken
        )
    })

    test('Delete user by admin which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/user/admin/${mockUserId}`,
            ''
        )
    })

    test('Delete user by admin with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/user/admin/${mockUserId}`,
            'Bearer fakeToken'
        )
    })

    test('Delete user by admin which is not admin, should return 403', async () => {
        const response = await request(app)
            .delete(`/api/user/admin/${mockUserId}`)
            .set('Authorization', `Bearer ${mockUserToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('Пользователь не обладает правами администратора')
    })

    test('Delete user by admin which does not exist, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).delete,
            `/api/user/admin/0`,
            'Пользователь не найден',
            {},
            mockAdminJwtToken
        )
    })

    test('Delete user by admin with valid data, should return 200', async () => {
        const response = await request(app)
            .delete(`/api/user/admin/${mockUserId}`)
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body.deletedUserId).toBe(mockUserId)
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => await stop())
})