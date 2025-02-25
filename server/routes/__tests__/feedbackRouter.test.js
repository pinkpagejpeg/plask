const { app, start, stop } = require('../../index')
const request = require('supertest')
const {
    mockUserJwtToken,
    mockAdminJwtToken,
    checkRouteWithInvalidInfo,
    checkRouteWithInvalidToken,
    checkRouteWithNonexistentData,
    checkRouteWithoutAdminRights
} = require('./checkRouter')

describe('feedbackRouter tests', () => {
    let mockFeedbackId

    beforeAll(async () => await start())

    test('Create feedback with empty info, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/feedback/',
            'Сообщение не введено',
            { info: '', userId: 1 },
            mockUserJwtToken
        )
    })

    test('Create feedback with empty userId, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/feedback/',
            'Отсутствует идентификатор пользователя',
            { info: 'Great app!' },
            mockUserJwtToken
        )
    })

    test('Create feedback by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/feedback/',
            '',
            { info: 'Great app!', userId: 1 }
        )
    })

    test('Create feedback by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/feedback/',
            'Bearer fakeToken',
            { info: 'Great app!', userId: 1 }
        )
    })

    test('Create feedback with valid data, should return 201', async () => {
        const response = await request(app)
            .post('/api/feedback/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                info: 'Great app!',
                userId: 1
            })

        expect(response.status).toBe(201)

        expect(response.body.feedback).toEqual(expect.objectContaining({
            info: 'Great app!',
            status: false,
            userId: 1
        }))
        expect(typeof response.body.feedback.info).toBe('string')
        expect(typeof response.body.feedback.status).toBe('boolean')
        expect(typeof response.body.feedback.userId).toBe('number')

        expect(response.body.feedback).toHaveProperty('id')
        expect(typeof response.body.feedback.id).toBe('number')

        expect(response.body.feedback).toHaveProperty('date')
        expect(typeof response.body.feedback.date).toBe('string')

        expect(response.body.feedback).toHaveProperty('createdAt')
        expect(typeof response.body.feedback.createdAt).toBe('string')

        expect(response.body.feedback).toHaveProperty('updatedAt')
        expect(typeof response.body.feedback.updatedAt).toBe('string')

        mockFeedbackId = response.body.feedback.id
    })

    test('Get feedbacks by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/feedback/',
            ''
        )
    })

    test('Get feedbacks by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/feedback/',
            'Bearer fakeToken'
        )
    })

    test('Get feedbacks by user which is not admin, should return 403', async () => {
        await checkRouteWithoutAdminRights(
            request(app).get,
            '/api/feedback/',
        )
    })

    test('Get feedbacks by valid user, should return 200', async () => {
        const response = await request(app)
            .get('/api/feedback/')
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
            `/api/feedback/${mockFeedbackId}`,
            'Отсутствует статус обратной связи',
            {},
            mockAdminJwtToken
        )
    })

    test('Update feedback by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/feedback/${mockFeedbackId}`,
            '',
            { status: true }
        )
    })

    test('Update feedback by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/feedback/${mockFeedbackId}`,
            'Bearer fakeToken',
            { status: true }
        )
    })

    test('Update feedback by user which is not admin, should return 403', async () => {
        await checkRouteWithoutAdminRights(
            request(app).patch,
            `/api/feedback/${mockFeedbackId}`,
            { status: true }
        )
    })

    test('Update feedback which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            '/api/feedback/0',
            mockAdminJwtToken,
            'Обращение не найдено',
            { status: true }
        )
    })

    test('Update feedback by valid user, should return 200', async () => {
        const response = await request(app)
            .patch(`/api/feedback/${mockFeedbackId}`)
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