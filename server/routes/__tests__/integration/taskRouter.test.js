const { app, start, stop } = require('../../../index')
const request = require('supertest')
const { mockUserJwtToken, mockFakeUserJwtToken } = require('../__mocks__/jwtTokenMocks')
const {
    checkRouteWithInvalidInfo,
    checkRouteWithInvalidToken,
    checkRouteWithNonexistentData,
} = require('./checkRouter')

describe('taskRouter tests', () => {
    let mockTaskId

    beforeAll(async () => await start())

    test('Create task with empty info, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).post,
            '/api/task/',
            'Введены некорректные данные: задача не введена',
            { info: ''},
            mockUserJwtToken
        )
    })

    test('Create task by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/task/',
            '',
            { info: 'Write documentation' }
        )
    })

    test('Create task by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).post,
            '/api/task/',
            'Bearer fakeToken',
            { info: 'Write documentation' }
        )
    })

    test('Create task by user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).post,
            '/api/task/',
            'Пользователь не найден',
            mockFakeUserJwtToken,
            { info: 'Write documentation' }
        )
    })

    test('Create task with valid data, should return 201', async () => {
        const response = await request(app)
            .post('/api/task/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Write documentation'})

        expect(response.status).toBe(201)
        expect(response.body.task).toEqual(expect.objectContaining({
            info: 'Write documentation',
            status: false,
        }))

        expect(typeof response.body.task.info).toBe('string')
        expect(typeof response.body.task.status).toBe('boolean')

        expect(response.body.task).toHaveProperty('userId')
        expect(typeof response.body.task.userId).toBe('number')

        expect(response.body.task).toHaveProperty('id')
        expect(typeof response.body.task.id).toBe('number')

        expect(response.body.task).toHaveProperty('createdAt')
        expect(typeof response.body.task.createdAt).toBe('string')

        expect(response.body.task).toHaveProperty('updatedAt')
        expect(typeof response.body.task.updatedAt).toBe('string')

        mockTaskId = response.body.task.id
    })

    test('Update task with empty info, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).patch,
            `/api/task/${mockTaskId}`,
            'Введены некорректные данные: задача не введена',
            { info: '' },
            mockUserJwtToken
        )
    })

    test('Update task by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/task/${mockTaskId}`,
            '',
            { info: 'Write tests' }
        )
    })

    test('Update task by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/task/${mockTaskId}`,
            'Bearer fakeToken',
            { info: 'Write tests' }
        )
    })

    test('Update task which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            '/api/task/0',
            'Задача не найдена',
            mockUserJwtToken,
            { info: 'Write tests' }
        )
    })

    test('Update task with valid data, should return 200', async () => {
        const response = await request(app)
            .patch(`/api/task/${mockTaskId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ info: 'Write tests' })

        expect(response.status).toBe(200)
        expect(response.body.task).toEqual(expect.objectContaining({
            id: mockTaskId,
            info: 'Write tests'
        }))

        expect(typeof response.body.task.id).toBe('number')
        expect(typeof response.body.task.info).toBe('string')

        expect(response.body.task).toHaveProperty('status')
        expect(typeof response.body.task.status).toBe('boolean')

        expect(response.body.task).toHaveProperty('userId')
        expect(typeof response.body.task.userId).toBe('number')

        expect(response.body.task).toHaveProperty('createdAt')
        expect(typeof response.body.task.createdAt).toBe('string')

        expect(response.body.task).toHaveProperty('updatedAt')
        expect(typeof response.body.task.updatedAt).toBe('string')
    })

    test('Update task with empty status, should return 400', async () => {
        await checkRouteWithInvalidInfo(
            request(app).patch,
            `/api/task/${mockTaskId}/status`,
            'Введены некорректные данные: отсутствует статус задачи',
            {},
            mockUserJwtToken
        )
    })

    test('Update task status by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/task/${mockTaskId}/status`,
            '',
            { status: true }
        )
    })

    test('Update task status by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).patch,
            `/api/task/${mockTaskId}/status`,
            'Bearer fakeToken',
            { status: true }
        )
    })

    test('Update task status which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).patch,
            '/api/task/0/status',
            'Задача не найдена',
            mockUserJwtToken,
            { status: true }
        )
    })

    test('Update task status with valid data, should return 200', async () => {
        let response = await request(app)
            .patch(`/api/task/${mockTaskId}/status`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ status: true })

        expect(response.status).toBe(200)
        expect(response.body.task).toEqual(expect.objectContaining({
            id: mockTaskId,
            status: true
        }))

        expect(typeof response.body.task.id).toBe('number')
        expect(typeof response.body.task.status).toBe('boolean')

        expect(response.body.task).toHaveProperty('info')
        expect(typeof response.body.task.info).toBe('string')

        expect(response.body.task).toHaveProperty('userId')
        expect(typeof response.body.task.userId).toBe('number')

        expect(response.body.task).toHaveProperty('createdAt')
        expect(typeof response.body.task.createdAt).toBe('string')

        expect(response.body.task).toHaveProperty('updatedAt')
        expect(typeof response.body.task.updatedAt).toBe('string')

        response = await request(app)
            .patch(`/api/task/${mockTaskId}/status`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ status: false })

        expect(response.status).toBe(200)
        expect(response.body.task).toEqual(expect.objectContaining({
            id: mockTaskId,
            status: false
        }))

        expect(typeof response.body.task.id).toBe('number')
        expect(typeof response.body.task.status).toBe('boolean')

        expect(response.body.task).toHaveProperty('info')
        expect(typeof response.body.task.info).toBe('string')

        expect(response.body.task).toHaveProperty('userId')
        expect(typeof response.body.task.userId).toBe('number')

        expect(response.body.task).toHaveProperty('createdAt')
        expect(typeof response.body.task.createdAt).toBe('string')

        expect(response.body.task).toHaveProperty('updatedAt')
        expect(typeof response.body.task.updatedAt).toBe('string')
    })

    test('Get tasks by user which is not authorized, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/task/user',
            ''
        )
    })

    test('Get tasks by user with fake token, should return 401', async () => {
        await checkRouteWithInvalidToken(
            request(app).get,
            '/api/task/user',
            'Bearer fakeToken'
        )
    })

    test('Get tasks by user which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).get,
            '/api/task/user',
            'Пользователь не найден',
            mockFakeUserJwtToken
        )
    })

    test('Get tasks with valid data, should return 200', async () => {
        const response = await request(app)
            .get('/api/task/user')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)

        expect(response.body.tasks).toBeInstanceOf(Array)
        expect(response.body.tasks.length).toBeGreaterThan(0)
        response.body.tasks.forEach((task) => {
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

        expect(response.body.tasks.length).toBe(response.body.count)
        expect(typeof response.body.count).toBe('number')

        const ids = response.body.tasks.map((f) => f.id)
        expect(new Set(ids).size).toBe(ids.length)
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

    test('Delete task which does not exist, should return 404', async () => {
        await checkRouteWithNonexistentData(
            request(app).delete,
            '/api/task/0',
            'Задача не найдена',
            mockUserJwtToken,
        )
    })

    test('Delete task with valid data, should return 200', async () => {
        const response = await request(app)
            .delete(`/api/task/${mockTaskId}`)
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(200)
        expect(response.body.deletedTaskId).toBe(mockTaskId)
    })

    afterEach(() => jest.clearAllMocks())

    afterAll(async () => await stop())
})