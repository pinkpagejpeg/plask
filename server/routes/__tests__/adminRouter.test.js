const request = require('supertest')
const { jwtDecode } = require('jwt-decode')
const { app, start, stop } = require('../../index')
const {
    mockAdminJwtToken,
    mockUserJwtToken,
    checkRouteWithInvalidInfo,
    checkRouteWithInvalidToken,
    checkRouteWithoutAdminRights,
    checkRouteWithNonexistentData
} = require('./checkRouter')

describe('userRouter tests', () => {
    let mockUserId, mockUserPassword, mockFeedbackId, mockUserToken

    beforeAll(async () => {
        await start()

        const createFeedback = await request(app)
            .post('/api/feedback/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                info: 'Great app!',
                userId: 1
            })

        mockFeedbackId = createFeedback.body.feedback.id
    })

    test('Create user with empty email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/admin/users',
            'Введены некорректные данные: Email пользователя не заполнен',
            { email: '', password: '12345678', role: 'ADMIN' },
            mockAdminJwtToken
        )
    })

    test('Create user with empty role, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/admin/users',
            'Введены некорректные данные: Роль пользователя не заполнена',
            { email: 'admin1@example.com', password: '12345678', role: '' },
            mockAdminJwtToken
        )
    })

    test('Create user with empty password, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/admin/users',
            'Введены некорректные данные: Длина пароля должна составлять от 6 до 12 символов',
            { email: 'admin1@example.com', password: '12345', role: 'ADMIN' },
            mockAdminJwtToken
        )
    })

    test('Create user by admin which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/admin/users',
            '',
            { email: 'admin1@example.com', password: '12345678', role: 'ADMIN' }
        )
    })

    test('Create user by admin with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/admin/users',
            'Bearer fakeToken',
            { email: 'admin1@example.com', password: '12345678', role: 'ADMIN' }
        )
    })

    test('Create user by admin which is not admin, should return 403', async () => {
        await checkRouteWithoutAdminRights(
            request(app).post,
            '/api/admin/users',
            { email: 'admin1@example.com', password: '12345678', role: 'ADMIN' }
        )
    })

    test('Create user with valid data, should return 201', async () => {
        const response = await request(app)
            .post('/api/admin/users')
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ email: 'admin1@example.com', password: '12345678', role: 'ADMIN' })

        const decoded = jwtDecode(response.body.token)

        expect(response.status).toBe(201)
        expect(decoded.email).toBe('admin1@example.com')
        expect(typeof decoded.email).toBe('string')
        expect(decoded.role).toBe('ADMIN')
        expect(typeof decoded.role).toBe('string')
        expect(decoded).toHaveProperty('id')
        expect(typeof decoded.id).toBe('number')
        expect(decoded).toHaveProperty('exp')
        expect(decoded).toHaveProperty('exp')
        expect(decoded).toHaveProperty('iat')
        expect(decoded).toHaveProperty('iat')

        mockUserId = decoded.id
        mockUserToken = response.body.token
    })

    test('Create user with another candidate, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/admin/users',
            'Пользователь с таким именем уже существует',
            { email: 'admin1@example.com', password: '12345678', role: 'ADMIN' },
            mockAdminJwtToken
        )
    })

    test('Get users by admin which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/admin/users`,
            ''
        )
    })

    test('Get users by admin with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/admin/users`,
            'Bearer fakeToken'
        )
    })

    test('Get users by admin which is not admin, should return 403', async () => {
        await checkRouteWithoutAdminRights(
            request(app).get,
            '/api/admin/users'
        )
    })

    test('Get users by admin with valid data, should return 200', async () => {
        const response = await request(app)
            .get(`/api/admin/users`)
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)

        expect(response.status).toBe(200)

        expect(response.body.users).toBeInstanceOf(Array)
        expect(response.body.users.length).toBeGreaterThan(0)
        response.body.users.forEach((user) => {
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

        expect(response.body.users.length).toBe(response.body.count)
        expect(typeof response.body.count).toBe('number')

        const ids = response.body.users.map((f) => f.id)
        expect(new Set(ids).size).toBe(ids.length)
    })

    test('Update user with empty email, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).patch,
            `/api/admin/users/${mockUserId}`,
            'Введены некорректные данные: Email пользователя не заполнен',
            { email: '', password: '', role: 'ADMIN' },
            mockAdminJwtToken
        )
    })

    test('Update user with empty role, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).patch,
            `/api/admin/users/${mockUserId}`,
            'Введены некорректные данные: Роль пользователя не заполнена',
            { email: 'admin1@example.com', password: '', role: '' },
            mockAdminJwtToken
        )
    })

    test('Update user with invalid password, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).patch,
            `/api/admin/users/${mockUserId}`,
            'Введены некорректные данные: Длина пароля должна составлять от 6 до 12 символов',
            { email: 'user1@example.com', password: '12345', role: 'ADMIN' },
            mockAdminJwtToken
        )
    })

    test('Update user by admin which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/admin/users/${mockUserId}`,
            '',
            { email: 'admin1@example.com', password: '123456789', role: 'ADMIN' }
        )
    })

    test('Update user by admin with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/admin/users/${mockUserId}`,
            'Bearer fakeToken',
            { email: 'admin1@example.com', password: '123456789', role: 'ADMIN' }
        )
    })

    test('Update user by admin which is not admin, should return 403', async () => {
        await checkRouteWithoutAdminRights(
            request(app).patch,
            `/api/admin/users/${mockUserId}`,
            { email: 'admin1@example.com', password: '123456789', role: 'ADMIN' }
        )
    })

    test('Update user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            `/api/admin/users/0`,
            'Пользователь не найден',
            mockAdminJwtToken,
            { email: 'admin1@example.com', password: '123456789', role: 'ADMIN' }
        )
    })

    test('Update user role with valid data, should return 200', async () => {
        const response = await request(app)
            .patch(`/api/admin/users/${mockUserId}`)
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ email: 'admin1@example.com', password: '', role: 'USER' })

        expect(response.status).toBe(200)

        expect(response.body.user.email).toBe('admin1@example.com')
        expect(typeof response.body.user.email).toBe('string')

        expect(response.body.user.role).toBe('USER')
        expect(typeof response.body.user.role).toBe('string')

        expect(response.body.user.id).toBe(mockUserId)
        expect(typeof response.body.user.id).toBe('number')

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

    test('Update user password with valid data, should return 200', async () => {
        const response = await request(app)
            .patch(`/api/admin/users/${mockUserId}`)
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ email: 'admin1@example.com', password: '123456789', role: 'USER' })

        expect(response.status).toBe(200)

        expect(response.body.user.email).toBe('admin1@example.com')
        expect(typeof response.body.user.email).toBe('string')

        expect(response.body.user.role).toBe('USER')
        expect(typeof response.body.user.role).toBe('string')

        expect(response.body.user.id).toBe(mockUserId)
        expect(typeof response.body.user.id).toBe('number')

        expect(response.body.user).toHaveProperty('password')
        expect(typeof response.body.user.password).toBe('string')
        expect(response.body.user.password).not.toBe(mockUserPassword)

        expect(response.body.user).toHaveProperty('img')
        expect(typeof response.body.user.img).toBe('string')

        expect(response.body.user).toHaveProperty('createdAt')
        expect(typeof response.body.user.createdAt).toBe('string')

        expect(response.body.user).toHaveProperty('updatedAt')
        expect(typeof response.body.user.updatedAt).toBe('string')
    })

    test('Update user email with valid data, should return 200', async () => {
        const response = await request(app)
            .patch(`/api/admin/users/${mockUserId}`)
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ email: 'admin11@example.com', password: '', role: 'USER' })

        expect(response.status).toBe(200)

        expect(response.body.user.email).toBe('admin11@example.com')
        expect(typeof response.body.user.email).toBe('string')

        expect(response.body.user.role).toBe('USER')
        expect(typeof response.body.user.role).toBe('string')

        expect(response.body.user.id).toBe(mockUserId)
        expect(typeof response.body.user.id).toBe('number')

        expect(response.body.user).toHaveProperty('password')
        expect(typeof response.body.user.password).toBe('string')

        expect(response.body.user).toHaveProperty('img')
        expect(typeof response.body.user.img).toBe('string')

        expect(response.body.user).toHaveProperty('createdAt')
        expect(typeof response.body.user.createdAt).toBe('string')

        expect(response.body.user).toHaveProperty('updatedAt')
        expect(typeof response.body.user.updatedAt).toBe('string')
    })

    test('Update user with another candidate, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).patch,
            `/api/admin/users/${mockUserId}`,
            'Пользователь с таким именем уже существует',
            { email: 'admin@example.com', password: '', role: 'USER' },
            mockAdminJwtToken
        )
    })

    test('Delete user by admin which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/admin/users/${mockUserId}`,
            ''
        )
    })

    test('Delete user by admin with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/admin/users/${mockUserId}`,
            'Bearer fakeToken'
        )
    })

    test('Delete user by admin which is not admin, should return 403', async () => {
        await checkRouteWithoutAdminRights(
            request(app).delete,
            `/api/admin/users/${mockUserId}`
        )
    })

    test('Delete user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).delete,
            `/api/admin/users/0`,
            'Пользователь не найден',
            mockAdminJwtToken
        )
    })

    test('Delete user by admin with valid data, should return 200', async () => {
        const response = await request(app)
            .delete(`/api/admin/users/${mockUserId}`)
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)

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

    test('Get feedbacks by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/admin/feedbacks',
            ''
        )
    })

    test('Get feedbacks by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/admin/feedbacks',
            'Bearer fakeToken'
        )
    })

    test('Get feedbacks by user which is not admin, should return 403', async () => {
        await checkRouteWithoutAdminRights(
            request(app).get,
            '/api/admin/feedbacks',
        )
    })

    test('Get feedbacks by valid user, should return 200', async () => {
        const response = await request(app)
            .get('/api/admin/feedbacks')
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)

        expect(response.status).toBe(200)

        expect(response.body.feedbacks).toBeInstanceOf(Array)
        expect(response.body.feedbacks.length).toBeGreaterThan(0)

        response.body.feedbacks.forEach((feedback) => {
            expect(feedback).toHaveProperty('id')
            expect(typeof feedback.id).toBe('number')

            expect(feedback).toHaveProperty('info')
            expect(typeof feedback.info).toBe('string')

            expect(feedback).toHaveProperty('date')
            expect(typeof feedback.date).toBe('string')

            expect(feedback).toHaveProperty('status')
            expect(typeof feedback.status).toBe('boolean')

            expect(feedback).toHaveProperty('createdAt')
            expect(typeof feedback.createdAt).toBe('string')

            expect(feedback).toHaveProperty('updatedAt')
            expect(typeof feedback.updatedAt).toBe('string')

            expect(feedback).toHaveProperty('userId')
            expect(typeof feedback.userId).toBe('number')

            expect(feedback).toHaveProperty('user')
            expect(typeof feedback.user).toBe('object')

            expect(feedback.user).toHaveProperty('email')
            expect(typeof feedback.user.email).toBe('string')
        })

        expect(response.body.feedbacks.length).toBe(response.body.count)
        expect(typeof response.body.count).toBe('number')

        const ids = response.body.feedbacks.map((f) => f.id)
        expect(new Set(ids).size).toBe(ids.length)
    })

    test('Update feedback with empty status, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).patch,
            `/api/admin/feedbacks/${mockFeedbackId}`,
            'Отсутствует статус обратной связи',
            {},
            mockAdminJwtToken
        )
    })

    test('Update feedback by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/admin/feedbacks/${mockFeedbackId}`,
            '',
            { status: true }
        )
    })

    test('Update feedback by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/admin/feedbacks/${mockFeedbackId}`,
            'Bearer fakeToken',
            { status: true }
        )
    })

    test('Update feedback by user which is not admin, should return 403', async () => {
        await checkRouteWithoutAdminRights(
            request(app).patch,
            `/api/admin/feedbacks/${mockFeedbackId}`,
            { status: true }
        )
    })

    test('Update feedback which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            '/api/admin/feedbacks/0',
            'Обращение не найдено',
            mockAdminJwtToken,
            { status: true }
        )
    })

    test('Update feedback by valid user, should return 200', async () => {
        const response = await request(app)
            .patch(`/api/admin/feedbacks/${mockFeedbackId}`)
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ status: true })

        expect(response.status).toBe(200)

        expect(response.body.feedback).toHaveProperty('id')
        expect(typeof response.body.feedback.id).toBe('number')

        expect(response.body.feedback).toHaveProperty('info')
        expect(typeof response.body.feedback.info).toBe('string')

        expect(response.body.feedback).toHaveProperty('status')
        expect(typeof response.body.feedback.status).toBe('boolean')
        expect(response.body.feedback.status).toBe(true)

        expect(response.body.feedback).toHaveProperty('date')
        expect(typeof response.body.feedback.date).toBe('string')

        expect(response.body.feedback).toHaveProperty('userId')
        expect(typeof response.body.feedback.userId).toBe('number')

        expect(response.body.feedback).toHaveProperty('createdAt')
        expect(typeof response.body.feedback.createdAt).toBe('string')

        expect(response.body.feedback).toHaveProperty('updatedAt')
        expect(typeof response.body.feedback.updatedAt).toBe('string')
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => await stop())
})