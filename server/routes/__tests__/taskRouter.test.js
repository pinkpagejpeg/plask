const { app, start, stop } = require('../../index')
const request = require('supertest')
const { mockUserJwtToken, checkRouteWithEmptyInfo, checkRouteWithInvalidToken } = require('./checkRouter')

describe('taskRouter tests', () => {
    let mockTaskId

    beforeAll(async () => await start())

    test('Create task with empty info, should return 400', async () => {
        await checkRouteWithEmptyInfo(
            request(app).post,
            '/api/task/',
            mockUserJwtToken,
            { info: '', userId: 1 },
            'Задача не введена'
        )
    })

    test('Create task by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/task/',
            '',
            { info: 'Write documentation', userId: 1 }
        )
    })

    test('Create task by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/task/',
            'Bearer fakeToken',
            { info: 'Write documentation', userId: 1 }
        )
    })

    test('Create task with valid data, should return 200', async () => {
        const response = await request(app)
            .post('/api/task/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                info: 'Write documentation',
                userId: 1
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual(expect.objectContaining({
            info: 'Write documentation',
            status: false,
            userId: 1
        }))

        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('createdAt')
        expect(response.body).toHaveProperty('updatedAt')

        mockTaskId = response.body.id
    })

    test('Update task by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).put,
            '/api/task/',
            '',
            { info: 'Write tests', taskId: mockTaskId }
        )
    })

    test('Update task by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).put,
            '/api/task/',
            'Bearer fakeToken',
            { info: 'Write tests', taskId: mockTaskId }
        )
    })

    test('Update task with valid data, should return 200', async () => {
        const response = await request(app)
            .put('/api/task/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                info: 'Write tests',
                taskId: mockTaskId
            })

        expect(response.status).toBe(200)
        expect(response.body.task).toEqual(expect.objectContaining({
            id: mockTaskId,
            info: 'Write tests'
        }))

        expect(response.body.task).toHaveProperty('status')
        expect(response.body.task).toHaveProperty('userId')
        expect(response.body.task).toHaveProperty('createdAt')
        expect(response.body.task).toHaveProperty('updatedAt')
    })

    test('Update task status by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).put,
            '/api/task/status',
            '',
            { status: true, taskId: mockTaskId }
        )
    })

    test('Update task status by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).put,
            '/api/task/status',
            'Bearer fakeToken',
            { status: true, taskId: mockTaskId }
        )
    })

    test('Update task status with valid data, should return 200', async () => {
        let response = await request(app)
            .put('/api/task/status')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                status: true,
                taskId: mockTaskId
            })

        expect(response.status).toBe(200)
        expect(response.body.task).toEqual(expect.objectContaining({
            id: mockTaskId,
            status: true
        }))

        expect(response.body.task).toHaveProperty('info')
        expect(response.body.task).toHaveProperty('userId')
        expect(response.body.task).toHaveProperty('createdAt')
        expect(response.body.task).toHaveProperty('updatedAt')

        response = await request(app)
            .put('/api/task/status')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                status: false,
                taskId: mockTaskId
            })

        expect(response.status).toBe(200)
        expect(response.body.task).toEqual(expect.objectContaining({
            id: mockTaskId,
            status: false
        }))

        expect(response.body.task).toHaveProperty('info')
        expect(response.body.task).toHaveProperty('userId')
        expect(response.body.task).toHaveProperty('createdAt')
        expect(response.body.task).toHaveProperty('updatedAt')
    })

    test('Delete task by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/task/${mockTaskId}`,
            ''
        )
    })

    test('Delete task by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).delete,
            `/api/task/${mockTaskId}`,
            'Bearer fakeToken'
        )
    })

    test('Delete task with valid data, should return 200', async () => {
        const response = await request(app)
            .delete(`/api/task/${mockTaskId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body.deletedTaskId).toBe(mockTaskId)
    })

    test('Get tasks by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/task/1',
            ''
        )
    })

    test('Get tasks by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/task/1',
            'Bearer fakeToken'
        )
    })

    test('Get tasks with valid data, should return 200', async () => {
        const response = await request(app)
            .get('/api/task/1')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)

        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThan(0)
        response.body.forEach((task) => {
            expect(task).toHaveProperty('id')
            expect(typeof task.id).toBe('number')
            expect(task).toHaveProperty('info')
            expect(typeof task.info).toBe('string')
            expect(task).toHaveProperty('status')
            expect(typeof task.status).toBe('boolean')
            expect(task).toHaveProperty('createdAt')
            expect(typeof task.createdAt).toBe('string')
            expect(task).toHaveProperty('updatedAt')
            expect(typeof task.updatedAt).toBe('string')
            expect(task).toHaveProperty('userId')
            expect(typeof task.userId).toBe('number')
        })

        const ids = response.body.map((f) => f.id)
        expect(new Set(ids).size).toBe(ids.length)
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => await stop())
})