const jwt = require('jsonwebtoken')
const CheckRoleMiddleware = require('../CheckRoleMiddleware')
const ApiError = require('../../error/ApiError')
const { mockAdminJwtToken, mockUserJwtToken } = require('@mocks/jwtTokenMocks')

jwt.verify = jest.fn((token, secret) => {
    if (token !== mockAdminJwtToken && token !== mockUserJwtToken) {
        throw new jwt.JsonWebTokenError('invalid token')
    }
    if (secret !== process.env.SECRET_KEY) {
        throw new jwt.JsonWebTokenError('invalid secret key')
    }
    return (token === mockAdminJwtToken) ?
        { id: 2, email: 'admin@example.com', role: 'ADMIN' } :
        { id: 1, email: 'user@example.com', role: 'USER' }
})

jest.mock('../../error/ApiError', () => ({
    unauthorized: jest.fn((msg) => new Error(msg)),
    forbidden: jest.fn((msg) => new Error(msg)),
}))

describe('CheckRoleMiddleware unit tests', () => {
    let req, res, next

    beforeEach(() => {
        req = { headers: {} }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        next = jest.fn()
    })

    test('Request method options', () => {
        req.method = 'OPTIONS'
        const checkRole = CheckRoleMiddleware('ADMIN')
        checkRole(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(ApiError.unauthorized).not.toHaveBeenCalled()
    })

    test('Empty token, should return 401', () => {
        req.headers.authorization = ''
        const checkRole = CheckRoleMiddleware('ADMIN')
        checkRole(req, res, next)

        expect(ApiError.unauthorized).toHaveBeenCalledWith('Пользователь не авторизован')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Пользователь не авторизован' }))
        expect(next).toHaveBeenCalledTimes(1)
    })

    test('Fake token, should return 401', () => {
        req.headers.authorization = 'Bearer fakeToken'
        const checkRole = CheckRoleMiddleware('ADMIN')
        checkRole(req, res, next)

        expect(ApiError.unauthorized).toHaveBeenCalledWith('Неверный или просроченный токен')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Неверный или просроченный токен' }))
        expect(next).toHaveBeenCalledTimes(1)
    })

    test('User is not admin, should return 403', () => {
        req.headers.authorization = `Bearer ${mockUserJwtToken}`
        const checkRole = CheckRoleMiddleware('ADMIN')
        checkRole(req, res, next)

        expect(ApiError.forbidden).toHaveBeenCalledWith('Пользователь не обладает правами администратора')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Пользователь не обладает правами администратора' }))
        expect(next).toHaveBeenCalledTimes(1)
    })

    test('Valid token', () => {
        req.headers.authorization = `Bearer ${mockAdminJwtToken}`
        const checkRole = CheckRoleMiddleware('ADMIN')
        checkRole(req, res, next)

        expect(jwt.verify).toHaveBeenCalledWith(mockAdminJwtToken, process.env.SECRET_KEY)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith() 
        expect(ApiError.unauthorized).not.toHaveBeenCalled()
        expect(ApiError.forbidden).not.toHaveBeenCalled()
    })

    test('Unexpected error in middleware, should call next with error', () => {
        const error = new Error('Unexpected error')
        jest.spyOn(ApiError, 'unauthorized').mockImplementation(() => { throw error }) 
        
        const checkRole = CheckRoleMiddleware('ADMIN')
        checkRole(req, res, next)
    
        expect(next).toHaveBeenCalledWith(error)
    })

    afterEach(() => jest.clearAllMocks())
})