const jwt = require('jsonwebtoken')
const AuthMiddleware = require('../AuthMiddleware')
const ApiError = require('../../error/ApiError')
const { mockUserJwtToken } = require('@mocks/jwtTokenMocks')

jwt.verify = jest.fn((token, secret) => {
    if (token !== mockUserJwtToken) {
        throw new jwt.JsonWebTokenError('invalid token')
    }

    if (secret !== process.env.SECRET_KEY) {
        throw new jwt.JsonWebTokenError('invalid secret key')
    }
    
    return { id: 1, email: 'user@example.com', role: 'USER' }
})

jest.mock('../../error/ApiError', () => ({
    unauthorized: jest.fn((msg) => new Error(msg)),
}))

describe('AuthMiddleware unit tests', () => {
    let req, res, next

    beforeEach(() => {
        req = { headers: {} }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        next = jest.fn()
    })

    test('Request method options', () => {
        req.method = 'OPTIONS'
        AuthMiddleware(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(ApiError.unauthorized).not.toHaveBeenCalled()
    })

    test('Empty token, should return 401', () => {
        req.headers.authorization = ''
        AuthMiddleware(req, res, next)

        expect(ApiError.unauthorized).toHaveBeenCalledWith('Пользователь не авторизован')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Пользователь не авторизован' }))
        expect(next).toHaveBeenCalledTimes(1)
    })

    test('Fake token, should return 401', () => {
        req.headers.authorization = 'Bearer fakeToken'
        AuthMiddleware(req, res, next)

        expect(ApiError.unauthorized).toHaveBeenCalledWith('Неверный или просроченный токен')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Неверный или просроченный токен' }))
        expect(next).toHaveBeenCalledTimes(1)
    })

    test('Valid token', () => {
        req.headers.authorization = `Bearer ${mockUserJwtToken}`
        AuthMiddleware(req, res, next)

        expect(jwt.verify).toHaveBeenCalledWith(mockUserJwtToken, process.env.SECRET_KEY)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith() 
        expect(ApiError.unauthorized).not.toHaveBeenCalled()
    })

    test('Unexpected error in middleware, should call next with error', () => {
        const error = new Error('Unexpected error')
        jest.spyOn(ApiError, 'unauthorized').mockImplementation(() => { throw error }) 
        
        AuthMiddleware(req, res, next)
    
        expect(next).toHaveBeenCalledWith(error)
    })

    afterEach(() => jest.clearAllMocks())
})