const ApiError = require('../../../error/ApiError')
const formatErrorMessages = require('../../../error/formatErrorMessages')
const AuthMiddleware = require('../../../middleware/AuthMiddleware')
const { validationResult } = require('express-validator')

const checkRouteWithInvalidInfo = async (
    validatorMessage,
    handler,
    requestMethod,
    route,
    token,
    responseArgs,
) => {
    validationResult.mockImplementationOnce(() => ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{ msg: validatorMessage }])
    }))

    handler.mockImplementationOnce((req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next(ApiError.badRequest(
                `Введены некорректные данные: ${formatErrorMessages(errors.array().map(error => error.msg))}`
            ))
        }
        res.status(200).json('Запрос успешно выполнен')
    })

    let request = requestMethod(route)

    if (token) {
        request.set('Authorization', `Bearer ${token}`)
    }

    if (responseArgs) {
        request.send(responseArgs)
    }

    const response = await request

    expect(response.status).toBe(400)
    expect(response.body.message).toContain(`Введены некорректные данные: ${validatorMessage}`)
    expect(handler).toHaveBeenCalledTimes(1)
}

const checkRouteWithoutToken = async (
    method,
    route,
    handler,
    responseArgs
) => {
    let request = method(route).set('Authorization', '')

    if (responseArgs) {
        request.send(responseArgs)
    }

    const response = await request

    expect(response.status).toBe(401)
    expect(response.body.message).toContain('Пользователь не авторизован')
    expect(handler).not.toHaveBeenCalled()
}

const checkRouteWithInvalidToken = async (
    method,
    route,
    handler,
    responseArgs
) => {
    AuthMiddleware.mockImplementationOnce((req, res, next) =>
        next(ApiError.unauthorized('Пользователь не авторизован'))
    )

    let request = method(route).set('Authorization', 'Bearer fakeToken')

    if (responseArgs) {
        request.send(responseArgs)
    }

    const response = await request

    expect(response.status).toBe(401)
    expect(response.body.message).toContain('Пользователь не авторизован')
    expect(handler).not.toHaveBeenCalled()
}

module.exports = {
    checkRouteWithInvalidInfo,
    checkRouteWithoutToken,
    checkRouteWithInvalidToken
}