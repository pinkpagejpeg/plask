const ErrorHandlingMiddleware = require('../ErrorHandlingMiddleware')
const ApiError = require('../../error/ApiError')

describe('ErrorHandlingMiddleware unit tests', () => {
    let err, req, res, next

    beforeEach(() => {
        req = { headers: {} }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        next = jest.fn()
    })

    test('Error instance of ApiError (bad request)', () => {
        err = ApiError.badRequest('Неправильный логин пользователя')
        ErrorHandlingMiddleware(err, req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ message: 'Неправильный логин пользователя' })
        expect(next).not.toHaveBeenCalled()
    })

    test('Error instance of ApiError (unauthorized)', () => {
        err = ApiError.unauthorized('Пользователь не авторизован')
        ErrorHandlingMiddleware(err, req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Пользователь не авторизован' })
        expect(next).not.toHaveBeenCalled()
    })

    test('Error instance of ApiError (forbidden)', () => {
        err = ApiError.forbidden('Пользователь не обладает правами администратора')
        ErrorHandlingMiddleware(err, req, res, next)

        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({ message: 'Пользователь не обладает правами администратора' })
        expect(next).not.toHaveBeenCalled()
    })

    test('Error instance of ApiError (notFound)', () => {
        err = ApiError.notFound('Пользователь не найден')
        ErrorHandlingMiddleware(err, req, res, next)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: 'Пользователь не найден' })
        expect(next).not.toHaveBeenCalled()
    })

    test('Error instance of ApiError (internal)', () => {
        err = ApiError.internal('При подключении базы данных возникла ошибка')
        ErrorHandlingMiddleware(err, req, res, next)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'При подключении базы данных возникла ошибка' })
        expect(next).not.toHaveBeenCalled()
    })

    test('Unexpected error', () => {
        err = new Error('Unexpected error')
        
        ErrorHandlingMiddleware(err, req, res, next)
    
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Непредвиденная ошибка' })
        expect(next).not.toHaveBeenCalled()
    })

    afterEach(() => jest.clearAllMocks())
})