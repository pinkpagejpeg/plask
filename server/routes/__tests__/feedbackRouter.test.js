const { app, start, stop } = require('../../index')
const request = require('supertest')
const {
    mockUserJwtToken,
    checkRouteWithInvalidInfo,
    checkRouteWithInvalidToken,
} = require('./checkRouter')

describe('feedbackRouter tests', () => {
    beforeAll(async () => await start())

    test('Create feedback with empty info, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/feedback/',
            'Сообщение не введено',
            { info: '' },
            mockUserJwtToken
        )
    })

    test('Create feedback by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/feedback/',
            '',
            { info: 'Great app!' }
        )
    })

    test('Create feedback by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/feedback/',
            'Bearer fakeToken',
            { info: 'Great app!' }
        )
    })

    test('Create feedback with valid data, should return 201', async () => {
        const response = await request(app)
            .post('/api/feedback/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Great app!' })

        expect(response.status).toBe(201)

        expect(response.body.feedback).toEqual(expect.objectContaining({
            info: 'Great app!',
            status: false,
        }))
        expect(typeof response.body.feedback.info).toBe('string')
        expect(typeof response.body.feedback.status).toBe('boolean')

        expect(response.body.feedback).toHaveProperty('userId')
        expect(typeof response.body.feedback.userId).toBe('number')

        expect(response.body.feedback).toHaveProperty('id')
        expect(typeof response.body.feedback.id).toBe('number')

        expect(response.body.feedback).toHaveProperty('date')
        expect(typeof response.body.feedback.date).toBe('string')

        expect(response.body.feedback).toHaveProperty('createdAt')
        expect(typeof response.body.feedback.createdAt).toBe('string')

        expect(response.body.feedback).toHaveProperty('updatedAt')
        expect(typeof response.body.feedback.updatedAt).toBe('string')
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => await stop())
})