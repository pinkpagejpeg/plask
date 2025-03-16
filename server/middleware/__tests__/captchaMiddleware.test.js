const jwt = require('jsonwebtoken')
const CaptchaMiddleware = require('../CaptchaMiddleware')
const ApiError = require('../../error/ApiError')
const { mockUserJwtToken } = require('@mocks/jwtTokenMocks')

jest.mock('../../error/ApiError', () => ({
    badRequest: jest.fn((msg) => new Error(msg)),
}))

describe('CaptchaMiddleware unit tests', () => {
    let req, res, next

    beforeEach(() => {
        req = {
            headers: { authorization: mockUserJwtToken },
            body: {}
        }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        next = jest.fn()
    })

    test('Request method options', () => {
        req.method = 'OPTIONS'
        CaptchaMiddleware(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(ApiError.badRequest).not.toHaveBeenCalled()
    })

    test('Empty token, should return 401', () => {
        req.body.hcaptchaToken = ''
        CaptchaMiddleware(req, res, next)

        expect(ApiError.badRequest).toHaveBeenCalledWith('Капча не пройдена')
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Капча не пройдена' }))
        expect(next).toHaveBeenCalledTimes(1)
    })

    test('Valid token', () => {
        req.body.hcaptchaToken = 'testToken'
        CaptchaMiddleware(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith() 
        expect(ApiError.badRequest).not.toHaveBeenCalled()
    })

    test('Unexpected error in middleware, should call next with error', () => {
        const error = new Error('Unexpected error')
        jest.spyOn(ApiError, 'badRequest').mockImplementation(() => { throw error }) 
        
        CaptchaMiddleware(req, res, next)
    
        expect(next).toHaveBeenCalledWith(error)
    })

    afterEach(() => jest.clearAllMocks())
})