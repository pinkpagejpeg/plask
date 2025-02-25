const request = require('supertest')
const { app, start, stop } = require('../../index')
const {
    mockUserJwtToken,
    checkRouteWithInvalidInfo,
    checkRouteWithInvalidToken,
    checkRouteWithNonexistentData,
} = require('./checkRouter')

describe('goalRouter tests', () => {
    let mockGoalId

    beforeAll(async () => await start())

    test('Create goal with empty info, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/goal/',
            'Цель не введена',
            { info: '', userId: 1 },
            mockUserJwtToken
        )
    })

    test('Create goal with empty userId, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/goal/',
            'Отсутствует идентификатор пользователя',
            { info: 'Learn JavaScript' },
            mockUserJwtToken
        )
    })

    test('Create goal by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/goal/',
            '',
            { info: 'Learn JavaScript', userId: 1 }
        )
    })

    test('Create goal by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/goal/',
            'Bearer fakeToken',
            { info: 'Learn JavaScript', userId: 1 }
        )
    })

    test('Create goal with valid data, should return 201', async () => {
        const response = await request(app)
            .post('/api/goal/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Learn JavaScript', userId: 1 })

        expect(response.status).toBe(201)
        expect(response.body.goal).toEqual(expect.objectContaining({
            info: 'Learn JavaScript',
            userId: 1
        }))

        expect(typeof response.body.goal.info).toBe('string')
        expect(typeof response.body.goal.userId).toBe('number')

        expect(response.body.goal).toHaveProperty('id')
        expect(typeof response.body.goal.id).toBe('number')

        expect(response.body.goal).toHaveProperty('createdAt')
        expect(typeof response.body.goal.createdAt).toBe('string')

        expect(response.body.goal).toHaveProperty('updatedAt')
        expect(typeof response.body.goal.updatedAt).toBe('string')

        mockGoalId = response.body.goal.id
    })

    test('Get goal progress by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/goal/${mockGoalId}/progress`,
            ''
        )
    })

    test('Get goal progress by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/goal/${mockGoalId}/progress`,
            'Bearer fakeToken'
        )
    })

    test('Get goal progress which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).get,
            '/api/goal/0/progress',
            mockUserJwtToken,
            'Цель не найдена'
        )
    })

    test('Get goal progress with valid data, should return 200', async () => {
        const response = await request(app)
            .get(`/api/goal/${mockGoalId}/progress`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body.progress).toBe(0)
        expect(typeof response.body.progress).toBe('number')
    })

    test('Update goal with empty info, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).patch,
            `/api/goal/${mockGoalId}`,
            'Цель не введена',
            { info: '' },
            mockUserJwtToken
        )
    })

    test('Update goal by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/goal/${mockGoalId}`,
            '',
            { info: 'Learn C++' }
        )
    })

    test('Update goal by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/goal/${mockGoalId}`,
            'Bearer fakeToken',
            { info: 'Learn C++' }
        )
    })

    test('Update goal which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            '/api/goal/0',
            mockUserJwtToken,
            'Цель не найдена',
            { info: 'Learn C++' }
        )
    })

    test('Update goal with valid data, should return 200', async () => {
        const response = await request(app)
            .patch(`/api/goal/${mockGoalId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Learn C++' })

        expect(response.status).toBe(200)
        expect(response.body.goal).toEqual(expect.objectContaining({
            info: 'Learn C++',
            id: mockGoalId
        }))

        expect(typeof response.body.goal.id).toBe('number')
        expect(typeof response.body.goal.info).toBe('string')

        expect(response.body.goal).toHaveProperty('userId')
        expect(typeof response.body.goal.userId).toBe('number')

        expect(response.body.goal).toHaveProperty('createdAt')
        expect(typeof response.body.goal.createdAt).toBe('string')

        expect(response.body.goal).toHaveProperty('updatedAt')
        expect(typeof response.body.goal.updatedAt).toBe('string')
    })

    test('Get goal by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/goal/${mockGoalId}`,
            ''
        )
    })

    test('Get goal by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/goal/${mockGoalId}`,
            'Bearer fakeToken'
        )
    })

    test('Get goal which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).get,
            '/api/goal/0',
            mockUserJwtToken,
            'Цель не найдена'
        )
    })

    test('Get goal with valid data, should return 200', async () => {
        const response = await request(app)
            .get(`/api/goal/${mockGoalId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body.goal).toEqual(expect.objectContaining({
            info: 'Learn C++',
            id: mockGoalId
        }))

        expect(typeof response.body.goal.id).toBe('number')
        expect(typeof response.body.goal.info).toBe('string')

        expect(response.body.goal).toHaveProperty('userId')
        expect(typeof response.body.goal.userId).toBe('number')

        expect(response.body.goal).toHaveProperty('createdAt')
        expect(typeof response.body.goal.createdAt).toBe('string')

        expect(response.body.goal).toHaveProperty('updatedAt')
        expect(typeof response.body.goal.updatedAt).toBe('string')
    })

    test('Get list of goals by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/goal/user/1',
            ''
        )
    })

    test('Get list of goals by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/goal/user/1',
            'Bearer fakeToken'
        )
    })

    test('Get list of goals with valid data, should return 200', async () => {
        const response = await request(app)
            .get('/api/goal/user/1')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)

        expect(response.body.goals).toBeInstanceOf(Array)
        expect(response.body.goals.length).toBeGreaterThan(0)
        response.body.goals.forEach((goal) => {
            expect(goal).toHaveProperty('id')
            expect(typeof goal.id).toBe('number')
            expect(goal).toHaveProperty('info')
            expect(typeof goal.info).toBe('string')
            expect(goal).toHaveProperty('createdAt')
            expect(typeof goal.createdAt).toBe('string')
            expect(goal).toHaveProperty('updatedAt')
            expect(typeof goal.updatedAt).toBe('string')
            expect(goal).toHaveProperty('userId')
            expect(typeof goal.userId).toBe('number')
        })

        expect(response.body.goals.length).toBe(response.body.count)
        expect(typeof response.body.count).toBe('number')

        const ids = response.body.goals.map((f) => f.id)
        expect(new Set(ids).size).toBe(ids.length)
    })

    test('Delete goal by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/goal/${mockGoalId}`,
            ''
        )
    })

    test('Delete goal by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/goal/${mockGoalId}`,
            'Bearer fakeToken'
        )
    })

    test('Delete goal which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).delete,
            `/api/goal/0`,
            mockUserJwtToken,
            'Цель не найдена'
        )
    })

    test('Delete goal with valid data, should return 200', async () => {
        const response = await request(app)
            .delete(`/api/goal/${mockGoalId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body.deletedGoalId).toBe(mockGoalId)
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => await stop())
})