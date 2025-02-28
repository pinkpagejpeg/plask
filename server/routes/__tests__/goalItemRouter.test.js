const request = require('supertest')
const { app, start, stop } = require('../../index')
const {
    mockUserJwtToken,
    checkRouteWithInvalidInfo,
    checkRouteWithInvalidToken,
    checkRouteWithNonexistentData,
} = require('./checkRouter')

describe('goalRouter tests', () => {
    let mockGoalId, mockGoalItemId

    beforeAll(async () => {
        await start()

        const response = await request(app)
            .post('/api/goal/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Learn JavaScript', userId: 1 })

        mockGoalId = response.body.goal.id
    })

    test('Create subgoal with empty info, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            `/api/goal/${mockGoalId}/items`,
            'Подцель не введена',
            { info: '' },
            mockUserJwtToken
        )
    })

    test('Create subgoal by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            `/api/goal/${mockGoalId}/items`,
            '',
            { info: 'Learn variables' }
        )
    })

    test('Create subgoal by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            `/api/goal/${mockGoalId}/items`,
            'Bearer fakeToken',
            { info: 'Learn variables' }
        )
    })

    test('Create subgoal for goal which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).post,
            `/api/goal/0/items`,
            'Цель не найдена',
            mockUserJwtToken,
            { info: 'Learn variables' }
        )
    })

    test('Create subgoal with valid data, should return 201', async () => {
        const response = await request(app)
            .post(`/api/goal/${mockGoalId}/items`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Learn variables' })

        expect(response.status).toBe(201)
        expect(response.body.goalItem).toEqual(expect.objectContaining({
            info: 'Learn variables',
            goalId: mockGoalId,
            status: false
        }))

        expect(typeof response.body.goalItem.info).toBe('string')
        expect(typeof response.body.goalItem.goalId).toBe('number')
        expect(typeof response.body.goalItem.status).toBe('boolean')

        expect(response.body.goalItem).toHaveProperty('id')
        expect(typeof response.body.goalItem.id).toBe('number')

        expect(response.body.goalItem).toHaveProperty('createdAt')
        expect(typeof response.body.goalItem.createdAt).toBe('string')

        expect(response.body.goalItem).toHaveProperty('updatedAt')
        expect(typeof response.body.goalItem.updatedAt).toBe('string')

        mockGoalItemId = response.body.goalItem.id
    })

    test('Update subgoal with empty info, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).patch,
            `/api/goal/${mockGoalId}/items/${mockGoalItemId}`,
            'Подцель не введена',
            { info: '' },
            mockUserJwtToken
        )
    })

    test('Update subgoal by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/goal/${mockGoalId}/items/${mockGoalItemId}`,
            '',
            { info: 'Learn data types' }
        )
    })

    test('Update subgoal by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/goal/${mockGoalId}/items/${mockGoalItemId}`,
            'Bearer fakeToken',
            { info: 'Learn data types' }
        )
    })

    test('Update subgoal which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            `/api/goal/${mockGoalId}/items/0`,
            'Подцель не найдена',
            mockUserJwtToken,
            { info: 'Learn data types' }
        )
    })

    test('Update subgoal with valid data, should return 200', async () => {
        const response = await request(app)
            .patch(`/api/goal/${mockGoalId}/items/${mockGoalItemId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Learn data types' })

        expect(response.status).toBe(200)
        expect(response.body.goalItem).toEqual(expect.objectContaining({
            info: 'Learn data types',
            id: mockGoalItemId,
            goalId: mockGoalId
        }))

        expect(typeof response.body.goalItem.info).toBe('string')
        expect(typeof response.body.goalItem.goalId).toBe('number')
        expect(typeof response.body.goalItem.id).toBe('number')

        expect(response.body.goalItem).toHaveProperty('status')
        expect(typeof response.body.goalItem.status).toBe('boolean')

        expect(response.body.goalItem).toHaveProperty('createdAt')
        expect(typeof response.body.goalItem.createdAt).toBe('string')

        expect(response.body.goalItem).toHaveProperty('updatedAt')
        expect(typeof response.body.goalItem.updatedAt).toBe('string')
    })

    test('Update subgoal with empty status, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).patch,
            `/api/goal/${mockGoalId}/items/${mockGoalItemId}/status`,
            'Отсутствует статус подцели',
            {},
            mockUserJwtToken
        )
    })

    test('Update subgoal status by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/goal/${mockGoalId}/items/${mockGoalItemId}/status`,
            '',
            { status: true }
        )
    })

    test('Update subgoal status by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/goal/${mockGoalId}/items/${mockGoalItemId}/status`,
            'Bearer fakeToken',
            { status: true }
        )
    })

    test('Update subgoal status which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            `/api/goal/${mockGoalId}/items/0/status`,
            'Подцель не найдена',
            mockUserJwtToken,
            { status: true }
        )
    })

    test('Update subgoal status with valid data, should return 200', async () => {
        let response = await request(app)
            .patch(`/api/goal/${mockGoalId}/items/${mockGoalItemId}/status`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ status: true })

        expect(response.status).toBe(200)
        expect(response.body.goalItem).toEqual(expect.objectContaining({
            status: true,
            id: mockGoalItemId,
            goalId: mockGoalId
        }))

        expect(typeof response.body.goalItem.info).toBe('string')
        expect(typeof response.body.goalItem.goalId).toBe('number')
        expect(typeof response.body.goalItem.id).toBe('number')

        expect(response.body.goalItem).toHaveProperty('status')
        expect(typeof response.body.goalItem.status).toBe('boolean')

        expect(response.body.goalItem).toHaveProperty('createdAt')
        expect(typeof response.body.goalItem.createdAt).toBe('string')

        expect(response.body.goalItem).toHaveProperty('updatedAt')
        expect(typeof response.body.goalItem.updatedAt).toBe('string')

        let progress = await request(app)
            .get(`/api/goal/${mockGoalId}/progress`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(progress.status).toBe(200)
        expect(progress.body.progress).toBe(100)
        expect(typeof progress.body.progress).toBe('number')

        response = await request(app)
            .patch(`/api/goal/${mockGoalId}/items/${mockGoalItemId}/status`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ status: false })

        expect(response.status).toBe(200)
        expect(response.body.goalItem).toEqual(expect.objectContaining({
            status: false,
            id: mockGoalItemId,
            goalId: mockGoalId
        }))

        expect(typeof response.body.goalItem.info).toBe('string')
        expect(typeof response.body.goalItem.goalId).toBe('number')
        expect(typeof response.body.goalItem.id).toBe('number')

        expect(response.body.goalItem).toHaveProperty('status')
        expect(typeof response.body.goalItem.status).toBe('boolean')

        expect(response.body.goalItem).toHaveProperty('createdAt')
        expect(typeof response.body.goalItem.createdAt).toBe('string')

        expect(response.body.goalItem).toHaveProperty('updatedAt')
        expect(typeof response.body.goalItem.updatedAt).toBe('string')

        progress = await request(app)
            .get(`/api/goal/${mockGoalId}/progress`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(progress.status).toBe(200)
        expect(progress.body.progress).toBe(0)
        expect(typeof progress.body.progress).toBe('number')
    })

    test('Get list of subgoals by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/goal/${mockGoalId}/items`,
            ''
        )
    })

    test('Get list of subgoals by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            `/api/goal/${mockGoalId}/items`,
            'Bearer fakeToken'
        )
    })

    test('Get list of subgoals for goal which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).get,
            `/api/goal/0/items`,
            'Цель не найдена',
            mockUserJwtToken
        )
    })

    test('Get list of subgoals with valid data, should return 200', async () => {
        const response = await request(app)
            .get(`/api/goal/${mockGoalId}/items`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)

        expect(response.body.goalItems).toBeInstanceOf(Array)
        expect(response.body.goalItems.length).toBeGreaterThan(0)
        response.body.goalItems.forEach((subgoal) => {
            expect(subgoal).toHaveProperty('id')
            expect(typeof subgoal.id).toBe('number')
            expect(subgoal).toHaveProperty('info')
            expect(typeof subgoal.info).toBe('string')
            expect(subgoal).toHaveProperty('status')
            expect(typeof subgoal.status).toBe('boolean')
            expect(subgoal).toHaveProperty('createdAt')
            expect(typeof subgoal.createdAt).toBe('string')
            expect(subgoal).toHaveProperty('updatedAt')
            expect(typeof subgoal.updatedAt).toBe('string')
            expect(subgoal).toHaveProperty('goalId')
            expect(typeof subgoal.goalId).toBe('number')
        })

        expect(response.body.goalItems.length).toBe(response.body.count)
        expect(typeof response.body.count).toBe('number')

        const ids = response.body.goalItems.map((f) => f.id)
        expect(new Set(ids).size).toBe(ids.length)
    })

    test('Delete subgoal by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/goal/${mockGoalId}/items/${mockGoalItemId}`,
            ''
        )
    })

    test('Delete subgoal by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/goal/${mockGoalId}/items/${mockGoalItemId}`,
            'Bearer fakeToken'
        )
    })

    test('Delete subgoal which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).delete,
            `/api/goal/${mockGoalId}/items/0`,
            'Подцель не найдена',
            mockUserJwtToken,
        )
    })

    test('Delete subgoal with valid data, should return 200', async () => {
        const response = await request(app)
            .delete(`/api/goal/${mockGoalId}/items/${mockGoalItemId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body.deletedGoalItemId).toBe(mockGoalItemId)
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => {
        await request(app)
            .delete(`/api/goal/${mockGoalId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        await stop()
    })
})