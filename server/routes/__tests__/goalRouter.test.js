const request = require('supertest')
const { app, start, stop } = require('../../index')
const jwt = require('jsonwebtoken')

describe('goalRouter tests', () => {
    let mockUserJwtToken, mockGoalId, mockGoalItemId

    beforeAll(async () => {
        mockUserJwtToken = jwt.sign({
            id: 1,
            email: 'user@example.com',
            role: 'USER'
        }, process.env.SECRET_KEY)

        await start()
    })


    test('Create goal with empty info, should return 400', async () => {
        const response = await request(app)
            .post('/api/goal/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                userId: 1,
                info: ''
            })

        expect(response.status).toBe(400)
        expect(response.body.message).toContain('Цель не введена')
    })

    test('Create goal by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .post('/api/goal/')
            .set('Authorization', '')
            .send({
                info: 'Learn JavaScript',
                userId: 1
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Create goal by user with fake token, should return 401', async () => {
        const response = await request(app)
            .post('/api/goal/')
            .set('Authorization', 'Bearer fakeToken')
            .send({
                info: 'Learn JavaScript',
                userId: 1
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Create goal with valid data, should return 200', async () => {
        const response = await request(app)
            .post('/api/goal/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                info: 'Learn JavaScript',
                userId: 1
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual(expect.objectContaining({
            info: 'Learn JavaScript',
            userId: 1
        }))

        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('createdAt')
        expect(response.body).toHaveProperty('updatedAt')

        mockGoalId = response.body.id
    })

    test('Get goal progress by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .get(`/api/goal/progress/${mockGoalId}`)
            .set('Authorization', '')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Get goal progress by user with fake token, should return 401', async () => {
        const response = await request(app)
            .get(`/api/goal/progress/${mockGoalId}`)
            .set('Authorization', 'Bearer fakeToken')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Get goal progress with valid data, should return 200', async () => {
        const response = await request(app)
            .get(`/api/goal/progress/${mockGoalId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body.progress).toBe(0)
    })

    test('Update goal by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .put('/api/goal/')
            .set('Authorization', '')
            .send({
                info: 'Learn C++',
                goalId: mockGoalId
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Update goal by user with fake token, should return 401', async () => {
        const response = await request(app)
            .put('/api/goal/')
            .set('Authorization', 'Bearer fakeToken')
            .send({
                info: 'Learn C++',
                goalId: mockGoalId
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Update goal with valid data, should return 200', async () => {
        const response = await request(app)
            .put('/api/goal/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                info: 'Learn C++',
                goalId: mockGoalId
            })

        expect(response.status).toBe(200)
        expect(response.body.goal).toEqual(expect.objectContaining({
            info: 'Learn C++',
            id: mockGoalId
        }))

        expect(response.body.goal).toHaveProperty('userId')
        expect(response.body.goal).toHaveProperty('createdAt')
        expect(response.body.goal).toHaveProperty('updatedAt')
    })

    test('Get goal by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .get(`/api/goal/${mockGoalId}`)
            .set('Authorization', '')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Get goal by user with fake token, should return 401', async () => {
        const response = await request(app)
            .get(`/api/goal/${mockGoalId}`)
            .set('Authorization', 'Bearer fakeToken')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Get goal with valid data, should return 200', async () => {
        const response = await request(app)
            .get(`/api/goal/${mockGoalId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(expect.objectContaining({
            info: 'Learn C++',
            id: mockGoalId
        }))

        expect(response.body).toHaveProperty('userId')
        expect(response.body).toHaveProperty('createdAt')
        expect(response.body).toHaveProperty('updatedAt')
    })

    test('Get list of goals by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .get('/api/goal/user/1')
            .set('Authorization', '')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Get list of goals by user with fake token, should return 401', async () => {
        const response = await request(app)
            .get('/api/goal/user/1')
            .set('Authorization', 'Bearer fakeToken')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Get list of goals with valid data, should return 200', async () => {
        const response = await request(app)
            .get('/api/goal/user/1')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)

        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThan(0)
        response.body.forEach((goal) => {
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

        const ids = response.body.map((f) => f.id)
        expect(new Set(ids).size).toBe(ids.length)
    })

    test('Create subgoal with empty info, should return 400', async () => {
        const response = await request(app)
            .post('/api/goal/item')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                info: '',
                goalId: mockGoalId
            })

        expect(response.status).toBe(400)
        expect(response.body.message).toContain('Задача не введена')
    })

    test('Create subgoal by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .post('/api/goal/item')
            .set('Authorization', '')
            .send({
                info: 'Learn variables',
                goalId: mockGoalId
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Create subgoal by user with fake token, should return 401', async () => {
        const response = await request(app)
            .post('/api/goal/item')
            .set('Authorization', 'Bearer fakeToken')
            .send({
                info: 'Learn variables',
                goalId: mockGoalId
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Create subgoal with valid data, should return 200', async () => {
        const response = await request(app)
            .post('/api/goal/item')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                info: 'Learn variables',
                goalId: mockGoalId
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual(expect.objectContaining({
            info: 'Learn variables',
            goalId: mockGoalId,
            status: false
        }))

        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('createdAt')
        expect(response.body).toHaveProperty('updatedAt')

        mockGoalItemId = response.body.id
    })

    test('Update subgoal by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .put('/api/goal/item')
            .set('Authorization', '')
            .send({
                info: 'Learn data types',
                goalItemId: mockGoalItemId
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Update subgoal by user with fake token, should return 401', async () => {
        const response = await request(app)
            .put('/api/goal/item')
            .set('Authorization', 'Bearer fakeToken')
            .send({
                info: 'Learn data types',
                goalItemId: mockGoalItemId
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Update subgoal with valid data, should return 200', async () => {
        const response = await request(app)
            .put('/api/goal/item')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                info: 'Learn data types',
                goalItemId: mockGoalItemId
            })

        expect(response.status).toBe(200)
        expect(response.body.goal_item).toEqual(expect.objectContaining({
            info: 'Learn data types',
            id: mockGoalItemId,
            goalId: mockGoalId
        }))

        expect(response.body.goal_item).toHaveProperty('status')
        expect(response.body.goal_item).toHaveProperty('createdAt')
        expect(response.body.goal_item).toHaveProperty('updatedAt')
    })

    test('Update subgoal status by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .put('/api/goal/item/status')
            .set('Authorization', '')
            .send({
                status: true,
                goalItemId: mockGoalItemId
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Update subgoal status by user with fake token, should return 401', async () => {
        const response = await request(app)
            .put('/api/goal/item/status')
            .set('Authorization', 'Bearer fakeToken')
            .send({
                status: true,
                goalItemId: mockGoalItemId
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Update subgoal status with valid data, should return 200', async () => {
        let response = await request(app)
            .put('/api/goal/item/status')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                status: true,
                goalItemId: mockGoalItemId
            })

        expect(response.status).toBe(200)
        expect(response.body.goal_item).toEqual(expect.objectContaining({
            status: true,
            id: mockGoalItemId,
            goalId: mockGoalId
        }))

        expect(response.body.goal_item).toHaveProperty('info')
        expect(response.body.goal_item).toHaveProperty('createdAt')
        expect(response.body.goal_item).toHaveProperty('updatedAt')

        let progress = await request(app)
            .get(`/api/goal/progress/${mockGoalId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(progress.status).toBe(200)
        expect(progress.body.progress).toBe(100)

        response = await request(app)
            .put('/api/goal/item/status')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                status: false,
                goalItemId: mockGoalItemId
            })

        expect(response.status).toBe(200)
        expect(response.body.goal_item).toEqual(expect.objectContaining({
            status: false,
            id: mockGoalItemId,
            goalId: mockGoalId
        }))

        expect(response.body.goal_item).toHaveProperty('info')
        expect(response.body.goal_item).toHaveProperty('createdAt')
        expect(response.body.goal_item).toHaveProperty('updatedAt')

        progress = await request(app)
            .get(`/api/goal/progress/${mockGoalId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(progress.status).toBe(200)
        expect(progress.body.progress).toBe(0)
    })

    test('Get list of subgoals by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .get(`/api/goal/item/${mockGoalId}`)
            .set('Authorization', '')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Get list of subgoals by user with fake token, should return 401', async () => {
        const response = await request(app)
            .get(`/api/goal/item/${mockGoalId}`)
            .set('Authorization', 'Bearer fakeToken')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Get list of subgoals with valid data, should return 200', async () => {
        const response = await request(app)
            .get(`/api/goal/item/${mockGoalId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
        console.log(response.body)
        expect(response.status).toBe(200)

        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThan(0)
        response.body.forEach((subgoal) => {
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

        const ids = response.body.map((f) => f.id)
        expect(new Set(ids).size).toBe(ids.length)
    })

    test('Delete subgoal by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .delete(`/api/goal/item/${mockGoalItemId}`)
            .set('Authorization', '')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Delete subgoal by user with fake token, should return 401', async () => {
        const response = await request(app)
            .delete(`/api/goal/item/${mockGoalItemId}`)
            .set('Authorization', 'Bearer fakeToken')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Delete subgoal with valid data, should return 200', async () => {
        const response = await request(app)
            .delete(`/api/goal/item/${mockGoalItemId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body.deletedGoalItemId).toBe(mockGoalItemId)
    })

    test('Delete goal by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .delete(`/api/goal/${mockGoalId}`)
            .set('Authorization', '')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Delete goal by user with fake token, should return 401', async () => {
        const response = await request(app)
            .delete(`/api/goal/${mockGoalId}`)
            .set('Authorization', 'Bearer fakeToken')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
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