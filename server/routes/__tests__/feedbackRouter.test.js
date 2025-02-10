const { app, start, stop } = require('../../index')
const request = require('supertest')
const jwt = require('jsonwebtoken')

describe('feedbackRouter tests', () => {
    let mockUserJwtToken, mockAdminJwtToken

    beforeAll(async () => {
        mockUserJwtToken = jwt.sign({
            id: 22,
            email: 'user@example.com',
            role: 'USER'
        }, process.env.SECRET_KEY)

        mockAdminJwtToken = jwt.sign({
            id: 23,
            email: 'admin@example.com',
            role: 'ADMIN'
        }, process.env.SECRET_KEY)

        await start()
    })

    test('Create feedback with empty info, should return 400', async () => {
        const response = await request(app)
            .post('/api/feedback/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                info: '',
                userId: 22
            })

        expect(response.status).toBe(400)
        expect(response.body.message).toContain('Сообщение не введено')
    })

    test('Create feedback by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .post('/api/feedback/')
            .set('Authorization', '')
            .send({
                info: 'Great app!',
                userId: 22
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Create feedback by user with fake token, should return 401', async () => {
        const response = await request(app)
            .post('/api/feedback/')
            .set('Authorization', 'Bearer fakeToken')
            .send({
                info: 'Great app!',
                userId: 22
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Create feedback with valid data, should return 200', async () => {
        const response = await request(app)
            .post('/api/feedback/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({
                info: 'Great app!',
                userId: 22
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual(expect.objectContaining({
            info: 'Great app!',
            status: false,
            userId: 22
        }))

        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('date')
        expect(response.body).toHaveProperty('createdAt')
        expect(response.body).toHaveProperty('updatedAt')
    })

    test('Get feedbacks by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .get('/api/feedback/')
            .set('Authorization', '')

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Get feedbacks by user which is not admin, should return 403', async () => {
        const response = await request(app)
            .get('/api/feedback/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('Пользователь не обладает правами администратора')
    })

    test('Get feedbacks by valid user, should return 200', async () => {
        const response = await request(app)
            .get('/api/feedback/')
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)

        expect(response.status).toBe(200)

        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThan(0)
        response.body.forEach((feedback) => {
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

        const ids = response.body.map((f) => f.id)
        expect(new Set(ids).size).toBe(ids.length)
    })

    test('Update feedback by user which is not authorized, should return 401', async () => {
        const response = await request(app)
            .put('/api/feedback/')
            .set('Authorization', '')
            .send({ feedbackId: 1 })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe('Пользователь не авторизован')
    })

    test('Update feedback by user which is not admin, should return 403', async () => {
        const response = await request(app)
            .put('/api/feedback/')
            .set('Authorization', `Bearer ${mockUserJwtToken}`)
            .send({ feedbackId: 1 })

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('Пользователь не обладает правами администратора')
    })

    test('Update feedback by valid user, should return 200', async () => {
        const response = await request(app)
            .put('/api/feedback/')
            .set('Authorization', `Bearer ${mockAdminJwtToken}`)
            .send({ feedbackId: 1 })

        expect(response.status).toBe(200)
        expect(response.body.feedback.status).toEqual(true)

        expect(response.body.feedback).toHaveProperty('id')
        expect(response.body.feedback).toHaveProperty('info')
        expect(response.body.feedback).toHaveProperty('status')
        expect(response.body.feedback).toHaveProperty('date')
        expect(response.body.feedback).toHaveProperty('userId')
        expect(response.body.feedback).toHaveProperty('createdAt')
        expect(response.body.feedback).toHaveProperty('updatedAt')
    })

    afterEach(async () => {
        jest.clearAllMocks()
    })

    afterAll(async () => {
        await stop()
    })
})